# Application security architecture

This page covers runtime controls in the application. The policy-level model
is in [../security/security-model.md](../security/security-model.md).

## Implemented in Phase 0

| Control                   | Where                                                                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Env validation, fail-fast | `apps/api/src/config/env.schema.ts`, `apps/worker/src/config/env.ts` (values never echoed)                               |
| Security headers          | Helmet in `apps/api/src/bootstrap.ts` (CSP `default-src 'none'`, HSTS, nosniff, frameguard)                              |
| CORS                      | Only `APP_URL`, credentials allowed, explicit methods/headers                                                            |
| Body limits               | JSON only, 1 MB                                                                                                          |
| Rate limiting             | `@nestjs/throttler` global guard (`RATE_LIMIT_*`)                                                                        |
| Error hygiene             | `AllExceptionsFilter`: no stack traces, DB errors or framework messages in responses                                     |
| Request correlation       | `x-request-id` (validated to prevent log injection)                                                                      |
| Log redaction             | `@gap/logger` redacts passwords, tokens, secrets, API keys, cookies, authorization headers; query strings are not logged |
| Browser secret exposure   | Allowlist of 4 public `VITE_*` keys; build fails otherwise (`apps/web/config/public-env.ts`)                             |
| RLS baseline              | RLS enabled on every table; Supabase `anon`/`authenticated` revoked                                                      |
| Append-only audit log     | `app.reject_mutation()` trigger on `audit_logs`                                                                          |
| Supabase service role     | Server-only `SupabaseAdminService`; never used for tenant reads                                                          |
| CI                        | Dependency audit, gitleaks secret scan, repository hygiene tests                                                         |

## Planned

- Phase 1: Supabase JWT verification, session management, deny-by-default auth guard, 2FA architecture.
- Phase 2–3: tenant guard, RLS policies, permission guard.
- Phase 8+: idempotency keys for payments, webhooks and imports.
- Phase 19: Redis-backed distributed rate limiting, API keys, webhook signing,
  secure file access, penetration-test preparation.
