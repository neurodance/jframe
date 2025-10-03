import Fastify, { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import cors from '@fastify/cors'
import rateLimit from '@fastify/rate-limit'
import sse from 'fastify-sse-v2'
import { EventEmitter } from 'node:events'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { load, save } from './repo'
import { JobCreateSchema, OrgCreateSchema, ProjectCreateSchema, RunCreateSchema } from './schemas'

const app = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    redact: {
      paths: ['req.headers.authorization', 'req.headers.x-api-key'],
      remove: true,
    },
  },
})

// Basic CORS
await app.register(cors, { origin: true })
await app.register(sse)
await app.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
  allowList: ['127.0.0.1'],
})

// Correlation ID middleware
app.addHook('onRequest', async (req: FastifyRequest, reply: FastifyReply) => {
  const corr = req.headers['x-correlation-id'] || crypto.randomUUID()
  reply.header('x-correlation-id', String(corr))
  ;(req as any).correlationId = String(corr)
  app.log.info({ msg: 'request', method: req.method, url: req.url, correlationId: (req as any).correlationId })
})

// Global error handler with standard envelope
app.setErrorHandler((err: FastifyError, req: FastifyRequest, reply: FastifyReply) => {
  const status = (err as any).statusCode || 500
  app.log.error({ err, correlationId: (req as any).correlationId })
  reply.code(status).send({ error: { code: 'server_error', message: err.message, correlationId: (req as any).correlationId } })
})

// Simple auth stub (to be replaced by OIDC/API key)
app.addHook('preHandler', async (req: FastifyRequest, reply: FastifyReply) => {
  // Allow health and version without auth
  const url = req.url || ''
  if (url.startsWith('/v1/health') || url.startsWith('/v1/version') || url.startsWith('/v1/openapi')) return
  // Validate X-Api-Key if configured; otherwise allow
  const requiredKey = process.env.API_KEY
  if (!requiredKey) return
  const provided = (req.headers['x-api-key'] || req.headers['X-Api-Key'] || req.headers['x-Api-key']) as string | undefined
  if (provided !== requiredKey) {
    reply
      .code(401)
      .send({ error: { code: 'unauthorized', message: 'Invalid or missing API key', correlationId: (req as any).correlationId } })
  }
})

// Lazy-loaded JSON db
let orgs: Array<{ id: string; name: string; region?: string; createdAt: string }> = []
let projects: Array<{ id: string; orgId: string; name: string; createdAt: string } > = []
let jobs: Array<{ id: string; orgId: string; projectId?: string; type: string; status: 'queued'|'running'|'succeeded'|'failed'; createdAt: string }> = []
let runs: Array<{ id: string; jobId: string; status: 'queued'|'running'|'succeeded'|'failed'; createdAt: string }> = []

async function loadDb() {
  const db = await load()
  orgs = db.orgs
  projects = db.projects
  jobs = db.jobs
  runs = db.runs
}

async function persist() {
  await save({ orgs, projects, jobs, runs })
}

// In-process SSE event bus
type SseEvent = { event: string; data: unknown }
const bus = new EventEmitter()
function broadcast(evt: SseEvent) {
  bus.emit('broadcast', evt)
}

app.get('/v1/health', { config: { rateLimit: false } }, async () => ({ status: 'ok' }))
app.get('/v1/version', { config: { rateLimit: false } }, async () => ({ version: process.env.APP_VERSION || '0.0.1-dev' }))

app.get('/v1/orgs', async (req: FastifyRequest, reply: FastifyReply) => {
  await loadDb()
  reply.send({ items: orgs, next: null })
})

app.post('/v1/orgs', async (req: FastifyRequest, reply: FastifyReply) => {
  await loadDb()
  const parsed = OrgCreateSchema.safeParse(req.body ?? {})
  if (!parsed.success) {
    reply.code(400).send({ error: { code: 'bad_request', message: 'Invalid org payload', details: parsed.error.flatten(), correlationId: (req as any).correlationId } })
    return
  }
  const { name, region } = parsed.data
  const item = { id: crypto.randomUUID(), name, region, createdAt: new Date().toISOString() }
  orgs.push(item)
  await persist()
  reply.code(201).send(item)
})

app.get('/v1/users/me', async (req: FastifyRequest, reply: FastifyReply) => {
  // stubbed identity; replace after OIDC wiring
  reply.send({ id: 'user-dev', email: 'dev@example.com', name: 'Dev User' })
})

// Projects
app.get('/v1/projects', async (_req: FastifyRequest, reply: FastifyReply) => {
  await loadDb()
  reply.send({ items: projects, next: null })
})

app.post('/v1/projects', async (req: FastifyRequest, reply: FastifyReply) => {
  await loadDb()
  const parsed = ProjectCreateSchema.safeParse(req.body ?? {})
  if (!parsed.success) {
    reply
      .code(400)
      .send({
        error: {
          code: 'bad_request',
          message: 'Invalid project payload',
          details: parsed.error.flatten(),
          correlationId: (req as any).correlationId,
        },
      })
    return
  }
  let { name, orgId } = parsed.data
  if (!orgId) {
    // If a single org exists, default to it; else synthesize a dev org
    if (orgs.length === 1) orgId = orgs[0].id
    else {
      let devOrg = orgs.find(o => o.id === 'org-dev')
      if (!devOrg) {
        devOrg = { id: 'org-dev', name: 'Development Org', createdAt: new Date().toISOString() }
        orgs.push(devOrg)
      }
      orgId = devOrg.id
    }
  }
  const item = { id: crypto.randomUUID(), orgId, name, createdAt: new Date().toISOString() }
  projects.push(item)
  await persist()
  reply.code(201).send(item)
})

app.get('/v1/projects/:id', async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  await loadDb()
  const id = (req.params as any).id as string
  const item = projects.find(p => p.id === id)
  if (!item) {
    reply.code(404).send({ error: { code: 'not_found', message: 'Project not found', correlationId: (req as any).correlationId } })
    return
  }
  reply.send(item)
})

// Jobs & Runs
app.get('/v1/jobs', async (_req: FastifyRequest, reply: FastifyReply) => {
  await loadDb()
  reply.send({ items: jobs, next: null })
})

app.post('/v1/jobs', async (req: FastifyRequest, reply: FastifyReply) => {
  await loadDb()
  const parsed = JobCreateSchema.safeParse(req.body ?? {})
  if (!parsed.success) {
    reply.code(400).send({ error: { code: 'bad_request', message: 'Invalid job payload', details: parsed.error.flatten(), correlationId: (req as any).correlationId } })
    return
  }
  let { type, orgId, projectId } = parsed.data
  if (!orgId) {
    if (orgs.length === 1) orgId = orgs[0].id
    else {
      let devOrg = orgs.find(o => o.id === 'org-dev')
      if (!devOrg) {
        devOrg = { id: 'org-dev', name: 'Development Org', createdAt: new Date().toISOString() }
        orgs.push(devOrg)
      }
      orgId = devOrg.id
    }
  }
  const job = { id: crypto.randomUUID(), orgId, projectId, type, status: 'queued' as const, createdAt: new Date().toISOString() }
  jobs.push(job)
  await persist()
  // emit job.created for SSE consumers
  broadcast({ event: 'job.created', data: { id: job.id, orgId: job.orgId, projectId: job.projectId, type: job.type, status: job.status, createdAt: job.createdAt } })
  reply.code(201).send(job)
})

app.get('/v1/jobs/:id', async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  await loadDb()
  const id = (req.params as any).id as string
  const item = jobs.find(j => j.id === id)
  if (!item) {
    reply.code(404).send({ error: { code: 'not_found', message: 'Job not found', correlationId: (req as any).correlationId } })
    return
  }
  reply.send(item)
})

app.get('/v1/jobs/:id/runs', async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  await loadDb()
  const id = (req.params as any).id as string
  reply.send({ items: runs.filter(r => r.jobId === id), next: null })
})

app.post('/v1/jobs/:id/runs', async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  await loadDb()
  const id = (req.params as any).id as string
  const parsed = RunCreateSchema.safeParse(req.body ?? {})
  if (!parsed.success) {
    reply.code(400).send({ error: { code: 'bad_request', message: 'Invalid run payload', details: parsed.error.flatten(), correlationId: (req as any).correlationId } })
    return
  }
  const job = jobs.find(j => j.id === id)
  if (!job) {
    reply.code(404).send({ error: { code: 'not_found', message: 'Job not found', correlationId: (req as any).correlationId } })
    return
  }
  const run = { id: crypto.randomUUID(), jobId: id, status: parsed.data.status ?? 'queued', createdAt: new Date().toISOString() }
  runs.push(run)
  if (run.status === 'succeeded' || run.status === 'failed') job.status = run.status
  else if (run.status === 'running') job.status = 'running'
  await persist()
  // emit run.created and, if terminal, run.completed
  broadcast({ event: 'run.created', data: { id: run.id, jobId: run.jobId, status: run.status, createdAt: run.createdAt } })
  if (run.status === 'succeeded' || run.status === 'failed') {
    broadcast({ event: 'run.completed', data: { id: run.id, jobId: run.jobId, status: run.status, completedAt: run.createdAt } })
  }
  reply.code(201).send(run)
})

// SSE events stream with heartbeat and broadcast support
app.get('/v1/events/stream', async (req: FastifyRequest, reply: FastifyReply) => {
  // headers
  reply.raw.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
  reply.raw.setHeader('Cache-Control', 'no-cache, no-transform')
  reply.raw.setHeader('Connection', 'keep-alive')
  // initial comment to open stream
  reply.raw.write(`: connected\n\n`)

  const write = (evt: SseEvent) => {
    try {
      const payload = `event: ${evt.event}\ndata: ${JSON.stringify(evt.data)}\n\n`
      reply.raw.write(payload)
    } catch {
      // ignore write errors
    }
  }

  const onBroadcast = (evt: SseEvent) => write(evt)
  bus.on('broadcast', onBroadcast)

  // heartbeat every 15 seconds
  const hb = setInterval(() => {
    try {
      const beat = { at: new Date().toISOString() }
      reply.raw.write(`event: heartbeat\ndata: ${JSON.stringify(beat)}\n\n`)
    } catch {
      // ignore
    }
  }, 15000)

  // cleanup
  req.raw.on('close', () => {
    clearInterval(hb)
    bus.off('broadcast', onBroadcast)
  })
})

// Serve OpenAPI (static) for local iteration
app.get('/v1/openapi', { config: { rateLimit: false } }, async (_req: FastifyRequest, reply: FastifyReply) => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  // src -> services/integraph-api -> services -> repo root -> docs/openapi/openapi.yaml
  const openapiPath = join(__dirname, '..', '..', '..', 'docs', 'openapi', 'openapi.yaml')
  const file = await readFile(openapiPath, 'utf8')
  reply.header('content-type', 'application/yaml; charset=utf-8').send(file)
})

const port = Number(process.env.PORT || 8080)
app
  .listen({ port, host: '0.0.0.0' })
  .then(() => app.log.info(`Integraph API listening on http://localhost:${port}`))
  .catch((err: unknown) => {
    app.log.error(err)
    process.exit(1)
  })
