import { z } from 'zod'

export const OrgSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  region: z.string().optional(),
  createdAt: z.string(),
})

export const OrgCreateSchema = z.object({ name: z.string().min(1), region: z.string().optional() })

export const ProjectSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  name: z.string().min(1),
  createdAt: z.string(),
})

export const ProjectCreateSchema = z.object({ name: z.string().min(1), orgId: z.string().optional() })

export const JobSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  projectId: z.string().optional(),
  type: z.string().min(1),
  status: z.enum(['queued', 'running', 'succeeded', 'failed']),
  createdAt: z.string(),
})

export const JobCreateSchema = z.object({
  type: z.string().min(1),
  orgId: z.string().optional(),
  projectId: z.string().optional(),
})

export const RunSchema = z.object({
  id: z.string(),
  jobId: z.string(),
  status: z.enum(['queued', 'running', 'succeeded', 'failed']),
  createdAt: z.string(),
})

export const RunCreateSchema = z.object({ status: z.enum(['queued', 'running', 'succeeded', 'failed']).optional() })

export type Org = z.infer<typeof OrgSchema>
export type Project = z.infer<typeof ProjectSchema>
export type Job = z.infer<typeof JobSchema>
export type Run = z.infer<typeof RunSchema>
