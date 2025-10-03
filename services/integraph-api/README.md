# Integraph API (Scaffold)

Fastify + TypeScript service exposing initial `/v1` endpoints.

## Run (dev)

```pwsh
npm install
npm run dev
```

The server listens on `http://localhost:8080`.

## Endpoints

- GET /v1/health
- GET /v1/version
- GET /v1/orgs
- POST /v1/orgs
- GET /v1/projects
- POST /v1/projects
- GET /v1/projects/:id
- GET /v1/jobs
- POST /v1/jobs
- GET /v1/jobs/:id
- GET /v1/jobs/:id/runs
- POST /v1/jobs/:id/runs
- GET /v1/runs
- GET /v1/runs/:id
- GET /v1/users/me
- GET /v1/events/stream (SSE)
- GET /v1/openapi (serves local OpenAPI YAML)

## Notes
- Correlation ID is propagated via `X-Correlation-Id`.
- CORS is enabled permissively in dev.
- Auth is currently stubbed; health/version/openapi are open, others will require OIDC/API keys later. If `API_KEY` env var is set, all non-open routes require header `x-api-key: $API_KEY`.
- SSE events: `heartbeat` every 15s, plus `job.created`, `run.created`, and `run.completed` when actions occur.