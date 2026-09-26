# Engineering standards

## Definition of done

A feature is complete only when: UI, API, database (with migration),
validation, authorization, RLS (where applicable), audit logging (where
applicable), error/loading/empty states, tests and documentation exist, and
typecheck, lint, tests and build pass.

## Code

- TypeScript strict mode everywhere (`noUncheckedIndexedAccess`,
  `noImplicitOverride`, `verbatimModuleSyntax`, no unused locals/params).
- Small, focused modules; no god classes, no circular dependencies, no
  duplicated business logic (put it in a package).
- No `any` in production code; ESLint type-aware rules enforce promise
  handling (`no-floating-promises`, `no-misused-promises`).
- `console` is banned in application code; use the structured logger.
- `parseFloat` is banned; monetary values use `@gap/money`.
- No hard-coded countries, currencies, tax rates or regulatory rules.
- No placeholder UI that pretends to work. Unimplemented items are either
  absent or explicitly labelled with the phase that delivers them.

## Database

- Every schema change is a Prisma migration committed to git.
  Development: `pnpm db:migrate:dev`. Production/CI: `prisma migrate deploy`.
  **Never** `prisma db push` against shared or production databases; never
  hand-edit production schemas.
- UUID primary keys (`gen_random_uuid()`), `timestamptz`, snake_case names,
  explicit foreign keys, unique constraints and indexes for every access path.
- Money: `Decimal @db.Decimal(20,4)`. `Float` is forbidden (tested).
- Every new table enables RLS in its migration (tested).
- CI verifies migrations apply cleanly and match `schema.prisma` (no drift).

## Testing

| Suite       | Location                       | Runs with                                    |
| ----------- | ------------------------------ | -------------------------------------------- |
| Unit        | `**/*.test.ts(x)` next to code | `pnpm test`                                  |
| Integration | `tests/integration`            | `pnpm test:integration` (PostgreSQL + Redis) |
| Security    | `tests/security`               | `pnpm test:security`                         |
| E2E         | `tests/e2e` (Playwright)       | `pnpm test:e2e` (after `pnpm build`)         |

Critical financial logic is test-driven. Integration suites fail (never skip)
when infrastructure is missing.

## Git

- Branches: `main` (production), `development` (integration), feature branches.
- Conventional commits: `feat(scope): …`, `fix(scope): …`, `security(scope): …`,
  `docs(scope): …`, `chore(scope): …`.
- Never force-push shared branches, rewrite published history, or run
  destructive commands (`git reset --hard`, `git clean -fd`) without explicit
  authorization.

## Logging

Structured JSON with `requestId`, `userId`, `organizationId`, method, path,
status, duration and error code. Never log passwords, tokens, API secrets,
private keys, request bodies or query strings.
