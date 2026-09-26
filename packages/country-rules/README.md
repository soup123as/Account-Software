# @gap/country-rules — reserved (Phase 4)

**Status: not implemented.** This directory reserves the package boundary in the
monorepo. It has no `package.json` yet, so pnpm and Turborepo ignore it.

Scope: per-country modules (AU, IN, US, GB, CA, ...) providing metadata, validation adapters (e.g. identifier formats) and reporting/invoice configuration references. Regulatory values live in the database, not here. Design: `docs/country-rules/adding-a-country.md`.

See `docs/architecture/application-architecture.md` for the package map and
`docs/roadmap.md` for phase sequencing.
