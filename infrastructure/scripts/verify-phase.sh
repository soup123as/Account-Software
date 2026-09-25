#!/usr/bin/env bash
# Runs the full local verification gate required before closing a phase.
# Requires PostgreSQL and Redis (see infrastructure/docker) and a populated .env.
set -euo pipefail
cd "$(dirname "$0")/../.."

step() { printf '\n==> %s\n' "$1"; }

step "Install";               pnpm install --frozen-lockfile
step "Format";                pnpm format:check
step "Prisma validate";       pnpm db:validate
step "Migrations deploy";     pnpm db:migrate:deploy
step "Migration drift";       pnpm --filter @gap/database db:check-drift
step "Lint";                  pnpm lint
step "Typecheck";             pnpm typecheck
step "Unit tests";            pnpm test
step "Build";                 pnpm build
step "Security tests";        pnpm test:security
step "Integration tests";     pnpm test:integration
step "Dependency audit";      pnpm audit --audit-level=high

printf '\nAll checks passed.\n'
