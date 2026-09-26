# Roadmap and phase status

Development proceeds in phases. A phase is closed only when it compiles,
typechecks, lints, passes unit/integration/security tests, validates the
database (migrations applied, no drift), keeps tenant isolation and financial
integrity intact, updates documentation and is committed.

| Phase | Scope                                                                 | Status   |
| ----- | --------------------------------------------------------------------- | -------- |
| 0     | Monorepo, tooling, app shells, shared packages, Prisma foundation, CI | **Done** |
| 1     | Authentication (Supabase Auth), sessions, guards, user sync           | Next     |
| 2     | Multi-tenancy: organizations, memberships, tenant context, RLS        | Planned  |
| 3     | RBAC: roles, permissions, custom roles, guards, permission-aware UI   | Planned  |
| 4     | Global configuration: countries, regions, jurisdictions, currencies   | Planned  |
| 5     | Accounting engine: CoA, fiscal periods, journals, posting, ledger     | Planned  |
| 6     | Tax engine, rule versioning, tax transactions                         | Planned  |
| 7     | Customers and vendors                                                 | Planned  |
| 8     | Sales: quotations, orders, invoices, credit notes, payments, AR       | Planned  |
| 9     | Purchasing: POs, bills, debit notes, vendor payments, AP              | Planned  |
| 10    | Expenses and approvals                                                | Planned  |
| 11    | Banking and reconciliation                                            | Planned  |
| 12    | Inventory                                                             | Planned  |
| 13    | Payroll architecture                                                  | Planned  |
| 14    | Projects                                                              | Planned  |
| 15    | Reports and exports                                                   | Planned  |
| 16    | Compliance engine                                                     | Planned  |
| 17    | Super Admin                                                           | Planned  |
| 18    | Documents, notifications, background jobs                             | Planned  |
| 19    | Security hardening                                                    | Planned  |
| 20    | Production readiness and deployment                                   | Planned  |

The local verification gate for every phase is
`infrastructure/scripts/verify-phase.sh`.
