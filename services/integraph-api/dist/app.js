import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import sse from 'fastify-sse-v2';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { EventEmitter } from 'node:events';
import { load, save } from './repo';
import { JobCreateSchema, JobSchema, OrgCreateSchema, OrgSchema, ProjectCreateSchema, ProjectSchema, RunCreateSchema, RunSchema } from './schemas';
export async function buildApp() {
    const app = Fastify({
        logger: {
            level: process.env.LOG_LEVEL || 'info',
            redact: { paths: ['req.headers.authorization', 'req.headers.x-api-key'], remove: true },
        },
    });
    await app.register(cors, { origin: true });
    await app.register(sse);
    await app.register(rateLimit, { max: 100, timeWindow: '1 minute', allowList: ['127.0.0.1'] });
    // Correlation
    app.addHook('onRequest', async (req, reply) => {
        const corr = req.headers['x-correlation-id'] || crypto.randomUUID();
        reply.header('x-correlation-id', String(corr));
        req.correlationId = String(corr);
        app.log.info({ msg: 'request', method: req.method, url: req.url, correlationId: req.correlationId });
    });
    // Errors
    app.setErrorHandler((err, req, reply) => {
        const status = err.statusCode || 500;
        app.log.error({ err, correlationId: req.correlationId });
        reply.code(status).send({ error: { code: 'server_error', message: err.message, correlationId: req.correlationId } });
    });
    // Auth stub
    app.addHook('preHandler', async (req, reply) => {
        const url = req.url || '';
        if (url.startsWith('/v1/health') || url.startsWith('/v1/version') || url.startsWith('/v1/openapi'))
            return;
        const requiredKey = process.env.API_KEY;
        if (!requiredKey)
            return;
        const provided = (req.headers['x-api-key'] || req.headers['X-Api-Key'] || req.headers['x-Api-key']);
        if (provided !== requiredKey) {
            reply.code(401).send({ error: { code: 'unauthorized', message: 'Invalid or missing API key', correlationId: req.correlationId } });
        }
    });
    // DB state
    let orgs = [];
    let projects = [];
    let jobs = [];
    let runs = [];
    async function loadDb() {
        const db = await load();
        orgs = db.orgs;
        projects = db.projects;
        jobs = db.jobs;
        runs = db.runs;
    }
    async function persist() {
        await save({ orgs, projects, jobs, runs });
    }
    const bus = new EventEmitter();
    function broadcast(evt) { bus.emit('broadcast', evt); }
    // Routes
    app.get('/v1/health', { config: { rateLimit: false } }, async () => ({ status: 'ok' }));
    app.get('/v1/version', { config: { rateLimit: false } }, async () => ({ version: process.env.APP_VERSION || '0.0.1-dev' }));
    app.get('/v1/orgs', async (_req, reply) => { await loadDb(); reply.send({ items: orgs.map(o => OrgSchema.parse(o)), next: null }); });
    app.post('/v1/orgs', async (req, reply) => {
        await loadDb();
        const parsed = OrgCreateSchema.safeParse(req.body ?? {});
        if (!parsed.success) {
            reply.code(400).send({ error: { code: 'bad_request', message: 'Invalid org payload', details: parsed.error.flatten(), correlationId: req.correlationId } });
            return;
        }
        const item = OrgSchema.parse({ id: crypto.randomUUID(), name: parsed.data.name, region: parsed.data.region, createdAt: new Date().toISOString() });
        orgs.push(item);
        await persist();
        reply.code(201).send(item);
    });
    app.get('/v1/projects', async (_req, reply) => { await loadDb(); reply.send({ items: projects.map(p => ProjectSchema.parse(p)), next: null }); });
    app.post('/v1/projects', async (req, reply) => {
        await loadDb();
        const parsed = ProjectCreateSchema.safeParse(req.body ?? {});
        if (!parsed.success) {
            reply.code(400).send({ error: { code: 'bad_request', message: 'Invalid project payload', details: parsed.error.flatten(), correlationId: req.correlationId } });
            return;
        }
        let { name, orgId } = parsed.data;
        if (!orgId) {
            if (orgs.length === 1)
                orgId = orgs[0].id;
            else {
                let devOrg = orgs.find(o => o.id === 'org-dev');
                if (!devOrg) {
                    devOrg = OrgSchema.parse({ id: 'org-dev', name: 'Development Org', createdAt: new Date().toISOString() });
                    orgs.push(devOrg);
                }
                orgId = devOrg.id;
            }
        }
        const item = ProjectSchema.parse({ id: crypto.randomUUID(), orgId, name, createdAt: new Date().toISOString() });
        projects.push(item);
        await persist();
        reply.code(201).send(item);
    });
    app.get('/v1/projects/:id', async (req, reply) => {
        await loadDb();
        const id = req.params.id;
        const item = projects.find(p => p.id === id);
        if (!item) {
            reply.code(404).send({ error: { code: 'not_found', message: 'Project not found', correlationId: req.correlationId } });
            return;
        }
        reply.send(ProjectSchema.parse(item));
    });
    app.get('/v1/jobs', async (_req, reply) => { await loadDb(); reply.send({ items: jobs.map(j => JobSchema.parse(j)), next: null }); });
    app.post('/v1/jobs', async (req, reply) => {
        await loadDb();
        const parsed = JobCreateSchema.safeParse(req.body ?? {});
        if (!parsed.success) {
            reply.code(400).send({ error: { code: 'bad_request', message: 'Invalid job payload', details: parsed.error.flatten(), correlationId: req.correlationId } });
            return;
        }
        let { type, orgId, projectId } = parsed.data;
        if (!orgId) {
            if (orgs.length === 1)
                orgId = orgs[0].id;
            else {
                let devOrg = orgs.find(o => o.id === 'org-dev');
                if (!devOrg) {
                    devOrg = OrgSchema.parse({ id: 'org-dev', name: 'Development Org', createdAt: new Date().toISOString() });
                    orgs.push(devOrg);
                }
                orgId = devOrg.id;
            }
        }
        const job = JobSchema.parse({ id: crypto.randomUUID(), orgId, projectId, type, status: 'queued', createdAt: new Date().toISOString() });
        jobs.push(job);
        await persist();
        bus.emit('broadcast', { event: 'job.created', data: { id: job.id, orgId: job.orgId, projectId: job.projectId, type: job.type, status: job.status, createdAt: job.createdAt } });
        reply.code(201).send(job);
    });
    app.get('/v1/jobs/:id', async (req, reply) => {
        await loadDb();
        const id = req.params.id;
        const item = jobs.find(j => j.id === id);
        if (!item) {
            reply.code(404).send({ error: { code: 'not_found', message: 'Job not found', correlationId: req.correlationId } });
            return;
        }
        reply.send(JobSchema.parse(item));
    });
    app.get('/v1/jobs/:id/runs', async (req, reply) => { await loadDb(); const id = req.params.id; reply.send({ items: runs.filter(r => r.jobId === id).map(r => RunSchema.parse(r)), next: null }); });
    app.post('/v1/jobs/:id/runs', async (req, reply) => {
        await loadDb();
        const id = req.params.id;
        const parsed = RunCreateSchema.safeParse(req.body ?? {});
        if (!parsed.success) {
            reply.code(400).send({ error: { code: 'bad_request', message: 'Invalid run payload', details: parsed.error.flatten(), correlationId: req.correlationId } });
            return;
        }
        const job = jobs.find(j => j.id === id);
        if (!job) {
            reply.code(404).send({ error: { code: 'not_found', message: 'Job not found', correlationId: req.correlationId } });
            return;
        }
        const run = RunSchema.parse({ id: crypto.randomUUID(), jobId: id, status: parsed.data.status ?? 'queued', createdAt: new Date().toISOString() });
        runs.push(run);
        if (run.status === 'succeeded' || run.status === 'failed')
            job.status = run.status;
        else if (run.status === 'running')
            job.status = 'running';
        await persist();
        bus.emit('broadcast', { event: 'run.created', data: { id: run.id, jobId: run.jobId, status: run.status, createdAt: run.createdAt } });
        if (run.status === 'succeeded' || run.status === 'failed')
            bus.emit('broadcast', { event: 'run.completed', data: { id: run.id, jobId: run.jobId, status: run.status, completedAt: run.createdAt } });
        reply.code(201).send(run);
    });
    // SSE stream
    app.get('/v1/events/stream', async (req, reply) => {
        reply.raw.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
        reply.raw.setHeader('Cache-Control', 'no-cache, no-transform');
        reply.raw.setHeader('Connection', 'keep-alive');
        reply.raw.write(`: connected\n\n`);
        const onBroadcast = (evt) => {
            try {
                reply.raw.write(`event: ${evt.event}\ndata: ${JSON.stringify(evt.data)}\n\n`);
            }
            catch { }
        };
        bus.on('broadcast', onBroadcast);
        const hb = setInterval(() => { try {
            reply.raw.write(`event: heartbeat\ndata: ${JSON.stringify({ at: new Date().toISOString() })}\n\n`);
        }
        catch { } }, 15000);
        req.raw.on('close', () => { clearInterval(hb); bus.off('broadcast', onBroadcast); });
    });
    // OpenAPI
    app.get('/v1/openapi', { config: { rateLimit: false } }, async (_req, reply) => {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        const openapiPath = join(__dirname, '..', '..', 'docs', 'openapi', 'openapi.yaml');
        const file = await readFile(openapiPath, 'utf8');
        reply.header('content-type', 'application/yaml; charset=utf-8').send(file);
    });
    return app;
}
