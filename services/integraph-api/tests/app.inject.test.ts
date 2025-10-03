import { describe, expect, it, beforeAll, afterAll } from 'vitest'
import { buildApp } from '../src/app'

describe('app.inject smoke', () => {
  let app: Awaited<ReturnType<typeof buildApp>>

  beforeAll(async () => {
    app = await buildApp()
  })

  afterAll(async () => {
    await app.close()
  })

  it('GET /v1/health', async () => {
    const res = await app.inject({ method: 'GET', url: '/v1/health' })
    expect(res.statusCode).toBe(200)
    expect(res.json()).toEqual({ status: 'ok' })
  })

  it('POST /v1/jobs then POST /v1/jobs/:id/runs', async () => {
    const createJob = await app.inject({ method: 'POST', url: '/v1/jobs', payload: { type: 'generate' } })
    expect(createJob.statusCode).toBe(201)
    const job = createJob.json() as { id: string }
    expect(job.id).toBeTruthy()

    const createRun = await app.inject({ method: 'POST', url: `/v1/jobs/${job.id}/runs`, payload: { status: 'succeeded' } })
    expect(createRun.statusCode).toBe(201)
    const run = createRun.json() as { id: string; jobId: string }
    expect(run.id).toBeTruthy()
    expect(run.jobId).toBe(job.id)
  })
})
