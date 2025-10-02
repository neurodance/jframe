import Fastify, { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import cors from '@fastify/cors'
import sse from 'fastify-sse-v2'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { z } from 'zod'

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

// Correlation ID middleware
app.addHook('onRequest', async (req: FastifyRequest, reply: FastifyReply) => {
  const corr = req.headers['x-correlation-id'] || crypto.randomUUID()
  reply.header('x-correlation-id', String(corr))
  ;(req as any).correlationId = String(corr)
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

// In-memory store for orgs
const orgs: Array<{ id: string; name: string; region?: string; createdAt: string }> = []
// In-memory store for projects
const projects: Array<{ id: string; orgId: string; name: string; createdAt: string } > = []

app.get('/v1/health', async () => ({ status: 'ok' }))
app.get('/v1/version', async () => ({ version: process.env.APP_VERSION || '0.0.1-dev' }))

app.get('/v1/orgs', async (req: FastifyRequest, reply: FastifyReply) => {
  reply.send({ items: orgs, next: null })
})

const OrgCreateSchema = z.object({ name: z.string().min(1), region: z.string().optional() })
app.post('/v1/orgs', async (req: FastifyRequest, reply: FastifyReply) => {
  const parsed = OrgCreateSchema.safeParse(req.body ?? {})
  if (!parsed.success) {
    reply.code(400).send({ error: { code: 'bad_request', message: 'Invalid org payload', details: parsed.error.flatten(), correlationId: (req as any).correlationId } })
    return
  }
  const { name, region } = parsed.data
  const item = { id: crypto.randomUUID(), name, region, createdAt: new Date().toISOString() }
  orgs.push(item)
  reply.code(201).send(item)
})

app.get('/v1/users/me', async (req: FastifyRequest, reply: FastifyReply) => {
  // stubbed identity; replace after OIDC wiring
  reply.send({ id: 'user-dev', email: 'dev@example.com', name: 'Dev User' })
})

// Projects
const ProjectCreateSchema = z.object({ name: z.string().min(1), orgId: z.string().optional() })

app.get('/v1/projects', async (_req: FastifyRequest, reply: FastifyReply) => {
  reply.send({ items: projects, next: null })
})

app.post('/v1/projects', async (req: FastifyRequest, reply: FastifyReply) => {
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
  reply.code(201).send(item)
})

app.get('/v1/projects/:id', async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  const id = (req.params as any).id as string
  const item = projects.find(p => p.id === id)
  if (!item) {
    reply.code(404).send({ error: { code: 'not_found', message: 'Project not found', correlationId: (req as any).correlationId } })
    return
  }
  reply.send(item)
})

// SSE events stream (stub)
app.get('/v1/events/stream', async (req: FastifyRequest, reply: FastifyReply) => {
  reply.sse({ data: JSON.stringify({ type: 'heartbeat', at: new Date().toISOString() }) })
})

// Serve OpenAPI (static) for local iteration
app.get('/v1/openapi', async (_req: FastifyRequest, reply: FastifyReply) => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  // src -> services/integraph-api -> services -> repo root -> docs/openapi/openapi.yaml
  const openapiPath = join(__dirname, '..', '..', '..', '..', 'docs', 'openapi', 'openapi.yaml')
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
