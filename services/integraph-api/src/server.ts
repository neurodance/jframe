import Fastify from 'fastify'
import cors from 'fastify-cors'
import sse from 'fastify-sse-v2'

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
app.addHook('onRequest', async (req, reply) => {
  const corr = req.headers['x-correlation-id'] || crypto.randomUUID()
  reply.header('x-correlation-id', String(corr))
  ;(req as any).correlationId = String(corr)
})

// Simple auth stub (to be replaced by OIDC/API key)
app.addHook('preHandler', async (req, reply) => {
  // Allow health and version without auth
  if (req.routerPath?.startsWith('/v1/health') || req.routerPath?.startsWith('/v1/version')) return
  // TODO: validate JWT or X-Api-Key
})

// In-memory store for orgs
const orgs: Array<{ id: string; name: string; region?: string; createdAt: string }> = []

app.get('/v1/health', async () => ({ status: 'ok' }))
app.get('/v1/version', async () => ({ version: process.env.APP_VERSION || '0.0.1-dev' }))

app.get('/v1/orgs', async (req, reply) => {
  reply.send({ items: orgs, next: null })
})

app.post('/v1/orgs', async (req, reply) => {
  const body = (req.body ?? {}) as { name?: string; region?: string }
  if (!body.name) {
    reply.code(400).send({ error: { code: 'bad_request', message: 'name is required', correlationId: (req as any).correlationId } })
    return
  }
  const item = { id: crypto.randomUUID(), name: body.name, region: body.region, createdAt: new Date().toISOString() }
  orgs.push(item)
  reply.code(201).send(item)
})

app.get('/v1/users/me', async (req, reply) => {
  // stubbed identity; replace after OIDC wiring
  reply.send({ id: 'user-dev', email: 'dev@example.com', name: 'Dev User' })
})

// SSE events stream (stub)
app.get('/v1/events/stream', { websocket: false }, async (req, reply) => {
  reply.sse({ data: JSON.stringify({ type: 'heartbeat', at: new Date().toISOString() }) })
})

const port = Number(process.env.PORT || 8080)
app
  .listen({ port, host: '0.0.0.0' })
  .then(() => app.log.info(`Integraph API listening on http://localhost:${port}`))
  .catch((err) => {
    app.log.error(err)
    process.exit(1)
  })
