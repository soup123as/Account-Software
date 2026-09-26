# Security model

## Priorities

Security → data integrity → accounting correctness → tenant isolation →
auditability. Features never ship by weakening these.

## Trust boundaries

| Boundary          | Rule                                                                                     |
| ----------------- | ---------------------------------------------------------------------------------------- |
| Browser → API     | Browser is untrusted. All authorization is server-side; UI checks are cosmetic.          |
| API → PostgreSQL  | Queries run inside tenant transactions; RLS is the last line of defence.                 |
| Supabase Data API | `anon`/`authenticated` roles get no table privileges unless a policy is designed for it. |
| Service role key  | Server only. Bypasses RLS; used for identity administration, never tenant reads.         |
| Worker            | Runs with the same tenant discipline; job payloads carry IDs, not secrets.               |

## Secrets

- Never committed. `.env` is git-ignored; `.env.example` has blank secrets
  (tested).
- Never exposed to the browser: only `VITE_APP_NAME`, `VITE_API_URL`,
  `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` are allowed; builds fail on any
  other `VITE_*` variable (tested). Forbidden examples: `VITE_DATABASE_URL`,
  `VITE_SUPABASE_SERVICE_ROLE_KEY`, `VITE_SESSION_SECRET`,
  `VITE_ENCRYPTION_KEY`, `VITE_PRIVATE_API_KEY`.
- Never logged: redaction in `@gap/logger`; config errors print names, not values.
- CI runs gitleaks over full history.

## Platform roles (Phase 3 / 17)

Super Admin, Platform Admin, Platform Finance Admin, Platform Support Admin,
Platform Auditor (read-only). Platform Support does **not** receive implicit
access to tenant financial data; access requires an explicit, time-boxed,
audited grant.

See [rls.md](rls.md), [rbac.md](rbac.md) and
[../architecture/security.md](../architecture/security.md).
