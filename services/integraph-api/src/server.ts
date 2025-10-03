import { buildApp } from './app'

const port = Number(process.env.PORT || 8080)
const host = '0.0.0.0'

buildApp()
  .then(app => app.listen({ port, host }))
  .then(() => console.log(`Integraph API listening on http://localhost:${port}`))
  .catch((err: unknown) => { console.error(err); process.exit(1) })
