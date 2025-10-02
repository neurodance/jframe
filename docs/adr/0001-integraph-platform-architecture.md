# ADR-0001: Integraph Platform, Architecture, and Initial Scope

Status: Accepted
Date: 2025-10-02
Owners: @neurodance

## Context

We are building Integraph as an enterprise-grade SaaS platform for creating and operating a wide array of work products (beyond Jotts). The platform must be API-first, secure, compliant with global regulations, and interoperable via MCP (Model Context Protocol). It must include an orchestrator that has full visibility/control over operations with human-in-the-loop capabilities, robust logging, and real-time monitoring.

Key drivers:
- Universal adoption: portable SDKs, clean REST and MCP interfaces, excellent docs/examples.
- Security, safety, privacy, legal: world-class baseline with jurisdiction-aware data handling (e.g., EU AI Act readiness).
- Price/performance + global latency: pragmatic cloud choices; CDN; data residency via regional deployments.
- Extensibility: templateable work products, composable tools, evented integrations, marketplace-friendly.

## Decision

We adopt a cloud-native, API-first architecture on Azure with Cloudflare for global acceleration, using a polyglot runtime where it adds clear value:

- Runtime & Services
  - Primary application services: Node.js 20 + TypeScript on Fastify.
  - Durable orchestration: Azure Durable Functions in .NET 9 for long-running workflows, compensations, schedules, and human-in-the-loop checkpoints.
  - Eventing: Azure Event Grid + Service Bus (topics/queues) for domain events and reliable background processing.
  - Real-time: Server-Sent Events (SSE) from API; optional WebSockets via Azure Web PubSub.

- Data & Storage
  - PostgreSQL (Azure Database for PostgreSQL Flexible Server) for transactional data (orgs, projects, work products, jobs, runs, webhooks, audit).
  - Redis (Azure Cache for Redis) for caching, rate limits/quotas, idempotency keys, and lightweight queues.
  - Azure Blob Storage for assets/binaries with signed URL flows and lifecycle policies.
  - Cloudflare R2 optional replication for cross-cloud redundancy.

- Networking & Delivery
  - Cloudflare CDN, WAF, Bot Management, and global Anycast to front Azure regional deployments.
  - Azure Front Door as needed for regional routing; private networking for service-to-service traffic.

- Identity & Access
  - Entra ID (Azure AD) for SSO/OIDC (SAML if required), SCIM provisioning for enterprises.
  - API keys (HMAC) for server-to-server use; fine-grained RBAC/ABAC scoped to org/project/resources.
  - Tenant-aware authz middleware in API and orchestrator; audit trails on all sensitive ops.

- Observability
  - OpenTelemetry for traces/metrics/logs; Azure Monitor + Application Insights; correlationId propagation edge-to-db.
  - Structured logging with sensitive-field redaction; per-tenant dashboards and SLO reports.

- Compliance & Governance
  - Data classification and tagging; configurable data residency per org; DSR (data subject requests) automation.
  - Retention policies, encryption at rest and in transit (TLS 1.3), KMS-backed key rotation.
  - SOC 2 Type II, ISO 27001, GDPR readiness, and EU AI Act alignment roadmap.

- MCP Interoperability
  - First-class MCP server exposing tools: generate, continue, review, transform, validate, list/get runs/products, stream events, store assets.
  - Tool JSON Schemas are versioned and discoverable; namespaced to avoid collisions; designed to compose with other MCP servers.
  - Prioritize integration with Azure Logic Apps (connector ecosystem) and Cloudflare Workers AI; support external MCP routing.

- Orchestrator
  - Central orchestrator service that owns workflows, state transitions, policy enforcement, and human approvals.
  - Capabilities: pause/resume/cancel, retries/backoff, compensation steps, concurrency limits, SLA enforcement.
  - Control surface (API and UI) to inspect/rerun steps, approve/deny gates, attach notes, and emit fine-grained events.

## Rationale

- Node/TS Fastify is a high-performance, widely adopted choice that aligns with our front-end stack and broader ecosystem (MCP tooling, SDK gen, DX).
- Azure Durable Functions in .NET 9 provides best-in-class primitives for durable, long-running orchestrations with strong reliability semantics.
- Azure + Cloudflare pairing balances partner goals, global delivery, security posture, and cost/perf flexibility.
- Postgres/Redis/Blob are proven, managed services with clear operational models and cost visibility.
- Entra ID SSO + API keys covers enterprise SSO and programmatic access securely.
- OpenAPI-first enables SDKs and client adapters with strong type safety; MCP adds interop with agentic ecosystems.

## Consequences

- Polyglot skillset: Node/TS and .NET 9 will be used; we’ll standardize tooling and CI to make this smooth.
- Multi-region, residency-aware deployments add complexity but unlock global adoption and compliance needs.
- Durable orchestrations introduce infrastructure overhead but provide essential capabilities for enterprise workflows.

## Alternatives Considered

- Single-runtime (all Node or all .NET): simpler ops, but weaker fit for durable workflows or MCP tooling.
- AWS or GCP: comparable capabilities; Azure chosen for partner strategy and team familiarity; revisit if economics shift.
- Kafka instead of Event Grid/Service Bus: powerful, but higher ops overhead for our initial scope.

## Implementation Plan (initial sprints)

1) API Contracts (OpenAPI v1)
- Resources: orgs, users, api-keys, projects, work-products, templates, jobs, runs, assets, webhooks, events.
- Concerns: pagination (cursor), filtering, idempotency-key, ETags, versioning (/v1), consistent error envelope.
- Deliverables: openapi.yaml, JSON Schemas for key payloads, SDK generation (TypeScript).

2) MVP Service Scaffold
- Fastify app with OIDC/JWT + API key auth, tenant guards, request logging, correlationId propagation.
- CRUD for orgs/projects; job/run creation endpoints; asset signed URL endpoints.
- SSE endpoint for live event tail.

3) Orchestrator Skeleton
- Durable Functions app (.NET 9): define orchestration for generate/continue/review/transform/validate.
- Wire to queue/job execution; emit domain events; simple human approval step.

4) MCP Server
- Implement tools mirroring REST endpoints with JSON Schema I/O; capability discovery; interop tests.

5) Eventing & Webhooks
- Domain events schema, webhook delivery with HMAC signatures + retry policy.

6) Security & Compliance Foundations
- RBAC model, audit logging, rate limiting, quotas, PII tagging, data retention policies.

7) Ops & CI/CD
- IaC for Azure (Bicep/Terraform); GitHub Actions for build/test/deploy; env promotion.
- Logs/metrics/traces dashboards; alerting baselines.

## Tiering & Pricing Framework

We’ll define a two-axis matrix:
- Axis A (Delivery stages): Discovery → Pilot → GA → Enterprise → Regulated.
- Axis B (Account tiers): Developer → Team → Business → Enterprise → Strategic Partner.
For each cell, we’ll set throughput targets (QPS, storage, concurrent jobs), SLOs, feature flags, and quotas. Pricing strategy will derive from enabled features and SLOs.

## Open Questions

- Exact regions to launch first; specific residency constraints per customer segment.
- Connector priorities for Logic Apps and third-party MCP servers.
- Initial work-product templates beyond Jotts to seed the marketplace.

---
This ADR will guide backlog grooming and subsequent design docs. Future ADRs will refine data model, RBAC/ABAC, event schemas, and orchestration patterns.
