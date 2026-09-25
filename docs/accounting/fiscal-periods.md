# Fiscal years and periods

**Status:** design. Implemented in Phase 5.

- Each organization defines fiscal year start/end; country configuration
  (Phase 4) supplies defaults only (e.g. a country's customary fiscal year).
- A fiscal year is divided into periods (typically monthly).
- Period states: `OPEN` → `LOCKED` → `CLOSED`.
  - `OPEN`: normal posting allowed.
  - `LOCKED`: no normal posting; authorized adjustment workflow may post with
    a dedicated permission and audit reason.
  - `CLOSED`: no posting.
- Closing a period validates that all journals in it are posted and balanced,
  that the trial balance for the period balances, records the closing
  activity and writes an audit record.
- Reopening requires a dedicated permission (e.g. `fiscal_period.reopen`),
  a reason, and is audited.
- Year-end closing posts closing entries that transfer revenue and expense
  balances to retained earnings; opening balances for the next year are
  derived from the ledger, not entered as free-standing totals.
