# Accounting engine

**Status:** design. Implemented in Phase 5 (`packages/accounting-engine` + API
`accounts`, `journals`, `ledger` modules). Phase 0 provides the monetary
foundation (`@gap/money`) it builds on.

## Scope

Chart of accounts, account categories, fiscal years and periods, journal
entries and lines, posting, general ledger, opening balances, reversals,
adjustments, closing entries and trial balance.

## Design rules

- True double-entry: every posted journal has Σ debits = Σ credits in the
  transaction currency **and** in the organization's base currency.
- Each line is either a debit or a credit (non-negative amounts, one side
  zero), enforced by CHECK constraints.
- Amounts are `NUMERIC(20,4)`; arithmetic uses `@gap/money` (decimal.js),
  never JavaScript floating point.
- Foreign-currency lines store the transaction amount, the exchange rate used
  and the base-currency amount. Rates are never re-derived later.
- The engine is framework-free and country-agnostic. Account templates per
  country come from configuration (`country-rules` + database).
- Business modules (sales, purchases, banking, inventory, payroll) never write
  ledger rows directly; they request postings from the engine.

## Account types

Assets, Liabilities, Equity, Revenue, Cost of Goods Sold, Expenses, Other
Income, Other Expenses. Each account: code (unique per organization), name,
type, optional parent, active flag, source template, customisation flag.

See also [journal-posting.md](journal-posting.md),
[financial-integrity.md](financial-integrity.md),
[fiscal-periods.md](fiscal-periods.md).
