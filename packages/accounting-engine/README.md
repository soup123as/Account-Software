# @gap/accounting-engine — reserved (Phase 5)

**Status: not implemented.** This directory reserves the package boundary in the
monorepo. It has no `package.json` yet, so pnpm and Turborepo ignore it.

Scope: chart of accounts, journal validation (debits = credits), posting, ledger, fiscal periods, reversals and closing. Pure domain logic on top of `@gap/money`; persistence stays in the API. Design: `docs/accounting/`.

See `docs/architecture/application-architecture.md` for the package map and
`docs/roadmap.md` for phase sequencing.
