import { describe, it, expect } from 'vitest'
import { OrgCreateSchema, ProjectCreateSchema, JobCreateSchema, RunCreateSchema } from '../src/schemas'

describe('schemas', () => {
  it('validates org create', () => {
    expect(OrgCreateSchema.safeParse({ name: 'Acme' }).success).toBe(true)
    expect(OrgCreateSchema.safeParse({ name: '' }).success).toBe(false)
  })

  it('validates project create', () => {
    expect(ProjectCreateSchema.safeParse({ name: 'Proj' }).success).toBe(true)
    expect(ProjectCreateSchema.safeParse({ name: '' }).success).toBe(false)
  })

  it('validates job create', () => {
    expect(JobCreateSchema.safeParse({ type: 'build' }).success).toBe(true)
    expect(JobCreateSchema.safeParse({}).success).toBe(false)
  })

  it('validates run create', () => {
    expect(RunCreateSchema.safeParse({}).success).toBe(true)
    expect(RunCreateSchema.safeParse({ status: 'running' }).success).toBe(true)
    expect(RunCreateSchema.safeParse({ status: 'nope' as any }).success).toBe(false)
  })
})
