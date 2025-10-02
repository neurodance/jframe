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
- GET /v1/users/me
- GET /v1/events/stream (SSE)
- GET /v1/openapi (serves local OpenAPI YAML)

## Notes
- Correlation ID is propagated via `X-Correlation-Id`.
- CORS is enabled permissively in dev.
- Auth is currently stubbed; health/version/openapi are open, others will require OIDC/API keys later.