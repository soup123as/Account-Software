# Global Accounting Platform

Multi-tenant, multi-company, multi-country accounting, finance, tax,
invoicing, payroll, inventory, banking and reporting platform (SaaS).

> **Status: Phase 0 — foundation.** The monorepo, tooling, application shells,
> shared financial primitives, database foundation, tests and CI are in place.
> No business modules (invoices, tax, payroll, inventory, accounting engine)
> exist yet. See [docs/roadmap.md](docs/roadmap.md).

## Architecture

```
apps/web     React + Vite SPA          ─┐
apps/api     NestJS REST API (/api/v1) ─┼─► PostgreSQL (Supabase, RLS)
apps/worker  BullMQ background worker  ─┴─► Redis
packages/*   shared, money, currency, validation, permissions, logger, database
             (+ reserved: accounting-engine, rules-engine, tax-engine,
                country-rules, reporting, notifications)
```

- [System overview](docs/architecture/system-overview.md)
- [Application architecture](docs/architecture/application-architecture.md)
- [Multi-tenancy](docs/architecture/multi-tenancy.md)
- [Security architecture](docs/architecture/security.md)
- [Engineering standards](docs/engineering-standards.md)

## Features (Phase 0)

- pnpm + Turborepo monorepo, TypeScript strict mode, ESLint (type-aware), Prettier
- **API:** NestJS with validated environment, structured JSON logging with
  secret redaction, request IDs, Helmet security headers, strict CORS, body
  limits, global rate limiting, standard error envelope that never leaks
  internals, liveness (`/api/v1/health`) and readiness (`/api/v1/health/ready`)
  endpoints, Supabase admin-client skeleton
- **Worker:** BullMQ worker with job registry, idempotent scheduled heartbeat,
  graceful shutdown
- **Web:** React 19, Vite, Tailwind CSS v4, shadcn/ui primitives, TanStack
  Query, React Router (lazy routes), i18next (RTL-aware), accessible app shell,
  system-status page, Supabase browser-client skeleton, build-time guard
  against exposing non-public `VITE_*` variables
- **Financial primitives:** `@gap/money` (decimal arithmetic, explicit rounding
  modes, exact allocation), `@gap/currency` (historical-rate conversion)
- **Database:** Prisma foundation, append-only `audit_logs`, tenant-context
  bridge (`withTenantTransaction`), RLS enabled on every table
- **Tests:** unit, integration (PostgreSQL + Redis), security, Playwright E2E
- **CI:** lint, typecheck, tests, build, migration drift check, dependency
  audit, secret scanning

## Technology

React · TypeScript · Vite · Tailwind CSS · shadcn/ui · TanStack Query · Zod ·
NestJS · PostgreSQL · Supabase · Prisma · Redis · BullMQ · Vitest · Playwright ·
pnpm · Turborepo. React Hook Form and Recharts are added with the first forms
and charts (Phases 1 and 15).

## Requirements

- Node.js ≥ 22.12 (`.nvmrc`)
- pnpm 10 (`corepack enable`)
- PostgreSQL 16 and Redis 7 — via Docker (below) or local installs
- A Supabase project for authentication (from Phase 1)

## Installation

```bash
corepack enable
pnpm install
cp .env.example .env        # then fill in values
```

## Environment

All configuration is documented in [.env.example](.env.example). Rules:

- Never commit `.env`. Production secrets live in the hosting provider /
  GitHub Environments.
- Only `VITE_APP_NAME`, `VITE_API_URL`, `VITE_SUPABASE_URL` and
  `VITE_SUPABASE_ANON_KEY` may reach the browser. Any other `VITE_*` variable
  fails the web build. Never create `VITE_DATABASE_URL`,
  `VITE_SUPABASE_SERVICE_ROLE_KEY`, `VITE_SESSION_SECRET`,
  `VITE_ENCRYPTION_KEY` or `VITE_PRIVATE_API_KEY`.
- The API and worker validate their environment at start-up and refuse to boot
  with invalid configuration (errors list variable names, never values).

## Supabase setup

1. Create a Supabase project.
2. Project Settings → API: copy the URL and anon key into `SUPABASE_URL`,
   `SUPABASE_ANON_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`; copy the
   service-role key into `SUPABASE_SERVICE_ROLE_KEY` (**server only**).
3. Project Settings → Database: set `DATABASE_URL` to the pooled connection
   string (port 6543, `?pgbouncer=true`) and `DIRECT_DATABASE_URL` to the
   direct connection (port 5432). Migrations use the direct connection.

## Database setup

Local PostgreSQL and Redis:

```bash
docker compose -f infrastructure/docker/docker-compose.yml up -d
```

Then in `.env`:

```
DATABASE_URL=postgresql://gap:gap_local_dev@localhost:5432/gap_dev
DIRECT_DATABASE_URL=postgresql://gap:gap_local_dev@localhost:5432/gap_dev
SHADOW_DATABASE_URL=postgresql://gap:gap_local_dev@localhost:5432/gap_shadow
```

### Prisma

| Task                         | Command                                      |
| ---------------------------- | -------------------------------------------- |
| Generate client              | `pnpm db:generate`                           |
| Validate + format check      | `pnpm db:validate`                           |
| Create/apply migration (dev) | `pnpm db:migrate:dev`                        |
| Apply migrations (prod / CI) | `pnpm db:migrate:deploy`                     |
| Migration status             | `pnpm db:migrate:status`                     |
| Drift check vs. schema       | `pnpm --filter @gap/database db:check-drift` |

Never use `prisma db push` against shared or production databases, and never
modify a production schema by hand.

### Migrations

Migrations live in `packages/database/prisma/migrations`. Each migration that
creates a table must also enable RLS on it (enforced by tests). The Phase 0
migration creates the `app` security schema, tenant-context helper
functions, the `app.reject_mutation()` append-only trigger and `audit_logs`.

### Seed

```bash
pnpm db:seed
```

The seed runner refuses to run with `NODE_ENV=production` and honours
`SEED_DATABASE=false`. Phase 0 registers no seeders; reference data
(countries, currencies, permissions, roles, frameworks) arrives in Phases 3–4.
Real regulatory values are never seeded.

## Running

```bash
pnpm dev                              # web + api + worker (after one pnpm build)
pnpm --filter @gap/web dev            # http://localhost:5173
pnpm --filter @gap/api dev            # http://localhost:3000/api/v1/health
pnpm --filter @gap/worker dev         # requires Redis
```

## Testing

```bash
pnpm test               # unit tests (all workspaces)
pnpm test:security      # repository & secret-exposure checks
pnpm test:integration   # needs DATABASE_URL (migrated) + Redis
pnpm build && VITE_API_URL=http://localhost:3100/api/v1 pnpm --filter @gap/web build
pnpm test:e2e           # Playwright; starts API (port 3100) and web preview
```

Full local gate (what CI runs): `infrastructure/scripts/verify-phase.sh`.

## Linting and build

```bash
pnpm lint
pnpm typecheck
pnpm format:check
pnpm build
```

## Deployment

`deploy.yml` is a manual workflow that builds, uploads artifacts and runs
`prisma migrate deploy` against the selected GitHub Environment. Hosting
targets (Vercel for web, Node hosting for API/worker, production Redis) are
provisioned in Phase 20; until then the release job fails deliberately so no
run is mistaken for a deployment.

## Multi-tenancy, RLS and RBAC

- Tenant isolation is enforced in the application, the API and PostgreSQL RLS.
  See [multi-tenancy](docs/architecture/multi-tenancy.md) and [RLS](docs/security/rls.md).
- Permissions use `module.resource.action` keys with no wildcards. See [RBAC](docs/security/rbac.md).

## Country rules

Country-specific behaviour is configuration (database) plus small adapters in
`packages/country-rules`; the accounting engine is country-agnostic.
Regulatory data is versioned, sourced and approved — never hard-coded or
invented. See [country rule engine](docs/country-rules/country-rule-engine.md),
[rule versioning](docs/country-rules/rule-versioning.md),
[adding a country](docs/country-rules/adding-a-country.md) and
[regulatory data policy](docs/compliance/regulatory-data.md).

## Accounting integrity

Decimal money only, explicit rounding, double-entry validation, immutable
posted records, reversals for corrections, lockable periods, preserved
historical rates and rule versions. See
[financial integrity](docs/accounting/financial-integrity.md).

## Security

See [security model](docs/security/security-model.md). Report vulnerabilities
privately to the maintainers; do not open public issues for security reports.

## Contributing

1. Branch from `development` (`feature/<scope>`).
2. Follow [engineering standards](docs/engineering-standards.md) and the
   definition of done.
3. Use conventional commits (`feat(accounting): …`, `security(rls): …`).
4. Run `infrastructure/scripts/verify-phase.sh` before opening a PR.
