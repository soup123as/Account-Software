# System overview

The Global Accounting Platform is a multi-tenant SaaS for accounting, finance,
tax, invoicing, payroll, inventory, banking and reporting across multiple
countries. This document describes the runtime topology; see
[application-architecture.md](application-architecture.md) for code structure.

## Runtime components

```
 Browser (React SPA, apps/web)
   │  HTTPS, JSON envelopes, Supabase access token (Phase 1)
   ▼
 API (NestJS, apps/api) ──────────────┐
   │ Prisma (tenant context per tx)   │ enqueue jobs
   ▼                                  ▼
 PostgreSQL (Supabase)             Redis ◄──── Worker (BullMQ, apps/worker)
   RLS on every table                          emails, PDFs, reports, exports,
   append-only financial records               recurring & scheduled jobs
```

| Component        | Technology                       | Responsibility                                                                      |
| ---------------- | -------------------------------- | ----------------------------------------------------------------------------------- |
| `web`            | React, Vite, Tailwind, shadcn/ui | UI only. Never enforces authorization; never holds secrets.                         |
| `api`            | NestJS (REST, `/api/v1`)         | Authentication, tenant resolution, authorization, validation, domain orchestration. |
| `worker`         | BullMQ                           | Asynchronous and scheduled work. Idempotent handlers.                               |
| PostgreSQL       | Supabase-hosted PostgreSQL 15+   | System of record. Constraints, RLS, append-only triggers.                           |
| Redis            | Managed Redis                    | Queues, cache, (Phase 19) distributed rate limiting.                                |
| Supabase Auth    | —                                | Identity (Phase 1). Application users are separate records.                         |
| Supabase Storage | —                                | Private document storage (Phase 18).                                                |

## Request lifecycle (API)

1. `requestContextMiddleware` assigns / validates the request ID.
2. Helmet sets security headers; CORS allows only `APP_URL`.
3. JSON body parsed (1 MB limit).
4. Global throttler guard (rate limit).
5. _(Phase 1)_ Authentication guard — deny by default, `@Public()` opt-out.
6. _(Phase 2)_ Tenant resolution — verified active membership.
7. _(Phase 3)_ Permission guard — `module.resource.action`.
8. Controller → Zod validation pipe → service → Prisma inside `withTenantTransaction`.
9. `AllExceptionsFilter` renders the standard error envelope.
10. `requestLoggingMiddleware` emits one structured log line.

## Principles

Security, data integrity, accounting correctness, tenant isolation,
auditability and regulatory rule versioning take precedence over speed or UI
polish. See [../engineering-standards.md](../engineering-standards.md).
