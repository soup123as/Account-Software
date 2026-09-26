# Financial integrity

These rules are mandatory for every phase. The "Enforced by" column lists the
mechanism; application checks alone are never sufficient.

| #   | Rule                                    | Enforced by                                                                            | Status                        |
| --- | --------------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------- |
| 1   | Money stored as NUMERIC/DECIMAL         | Prisma `Decimal @db.Decimal(20,4)`; schema test forbids `Float`                        | Phase 0 ✔                     |
| 2   | No JS floating point for totals         | `@gap/money` (decimal.js); rejects fractional `number` input; ESLint bans `parseFloat` | Phase 0 ✔                     |
| 3   | Explicit, deterministic rounding        | `RoundingMode` required for every rounding; `toFixed` refuses implicit rounding        | Phase 0 ✔                     |
| 4   | Amounts transported as strings          | `decimalStringSchema` (max 4 dp); `Money.toJSON()` emits strings                       | Phase 0 ✔                     |
| 5   | Debits = credits                        | Engine validation + deferred constraint trigger                                        | Phase 5                       |
| 6   | Posted journals immutable / undeletable | DB trigger (pattern proven on `audit_logs`)                                            | Phase 5                       |
| 7   | Corrections via reversal                | Engine API exposes reverse, not edit                                                   | Phase 5                       |
| 8   | Financial operations are transactional  | `withTenantTransaction`                                                                | Phase 0 ✔ (mechanism)         |
| 9   | Locked/closed periods reject posting    | Engine + DB check on period status                                                     | Phase 5                       |
| 10  | Historical exchange rates preserved     | Rate stored on each transaction (`ExchangeRate` value object)                          | Phase 4                       |
| 11  | Historical tax rule versions preserved  | `tax_transactions.tax_rule_version_id` FK to immutable versions                        | Phase 6                       |
| 12  | Financial changes auditable             | Append-only `audit_logs`                                                               | Phase 0 ✔ (table)             |
| 13  | Tenant isolation                        | App + API guard + RLS                                                                  | Phase 0 ✔ (baseline), Phase 2 |
| 14  | Payments idempotent                     | `Idempotency-Key` header + unique keys                                                 | Phase 8                       |
| 15  | Database constraints enforce integrity  | FKs, uniques, CHECKs in every migration                                                | Ongoing                       |

## Allocation

`Money.allocate(ratios, scale, mode)` splits an amount so the parts always sum
exactly to the rounded total (largest-remainder, ties by index). Use it for
splitting payments across invoices, tax across lines, and cost allocations.
