# Application architecture

## Monorepo layout

```
apps/
  web/       React SPA (Vite). src/app/{router,providers,layouts}, src/features/*
  api/       NestJS REST API. src/common, src/config, src/infrastructure, src/modules/*
  worker/    BullMQ worker. src/jobs/<area>/*.job.ts registered in src/jobs/index.ts
packages/
  shared/        Error hierarchy, API envelope types, constants (browser-safe)
  money/         Decimal money, explicit rounding, allocation
  currency/      Currency codes, historical-rate conversion
  validation/    Zod schemas (UUIDs, ISO codes, decimal strings, pagination)
  permissions/   Permission-key format and pure predicates
  logger/        pino with mandatory redaction (Node only)
  database/      Prisma schema, migrations, seed runner, client, tenant context
  accounting-engine/, rules-engine/, tax-engine/, country-rules/,
  reporting/, notifications/   Reserved (README only) until their phase
tests/
  integration/ security/ e2e/ unit/   Cross-cutting suites
docs/  infrastructure/  .github/workflows/
```

Feature folders listed in the product specification (e.g. `apps/web/src/features/invoices`,
`apps/api/src/modules/invoices`) are created in the phase that implements them,
never as empty placeholders.

## Dependency rules

- Apps depend on packages; packages never depend on apps.
- `web` may depend only on browser-safe packages (`shared`, `validation`,
  `money`, `currency`, `permissions`). It must not depend on `database`,
  `logger` or any server library — enforced by `tests/security`.
- Domain packages (`money`, `accounting-engine`, `tax-engine`, ...) are pure:
  no I/O, no framework imports. Persistence lives in the API.
- Country-specific behaviour lives in `country-rules` and database
  configuration, never in the accounting core.
- No circular dependencies between packages.

## Module system and builds

- All workspaces are ESM (`"type": "module"`, `NodeNext` resolution; relative
  imports use `.js` extensions).
- Packages compile with `tsc` to `dist/`; Turborepo builds dependencies first
  (`dependsOn: ["^build"]`).
- The API uses TypeScript decorator metadata for NestJS DI. Vitest runs API
  tests through SWC (`unplugin-swc`) because esbuild cannot emit that metadata.
  Constructor-injected classes must be value imports, not `import type`.

## API conventions

- Base path `/api/v1` (`API_PREFIX`).
- Success: `{ "success": true, "data": ... }`.
- Failure: `{ "success": false, "error": { "code", "message", "details?", "requestId" } }`.
- Errors are thrown as `AppError` subclasses from `@gap/shared`; the global
  filter never exposes stack traces, framework messages or database errors.
- Inputs are validated with Zod via `ZodValidationPipe`. Monetary amounts are
  transported as decimal strings, never JSON numbers.
- List endpoints use cursor pagination (`limit` ≤ 100).

## Web conventions

- Routes are lazy-loaded (code splitting); navigation lists only implemented routes.
- Server state via TanStack Query; mutations are never retried automatically.
- All UI strings go through i18next (`src/locales/<lang>/common.json`);
  `<html dir>` follows the language (RTL support).
- Every data view implements loading, empty and error states.
- Status is never conveyed by color alone (badges carry text and icons).
