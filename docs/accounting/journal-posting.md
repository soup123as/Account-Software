# Journal posting

**Status:** design. Implemented in Phase 5.

## Lifecycle

```
DRAFT ──validate──► POSTED ──reverse──► (POSTED original + POSTED reversal)
  │                                     └── corrected entry posted separately
  └── editable / deletable only while DRAFT
```

## Posting algorithm

Performed inside one database transaction (`withTenantTransaction`,
SERIALIZABLE or row locks on the period and number sequence):

1. Load the journal with its lines (`FOR UPDATE`).
2. Validate: at least two lines; every account active and owned by the
   organization; Σ debit = Σ credit (transaction and base currency) using
   decimal arithmetic; each line one-sided; amounts ≤ 4 decimal places.
3. Resolve the fiscal period from the entry date; reject if not `OPEN`.
4. Assign the next journal number from an organization-scoped sequence.
5. Mark POSTED with `posted_at` / `posted_by`; write ledger rows.
6. Write an audit log entry. Commit.

A database trigger additionally rejects UPDATE/DELETE of posted journals and
their lines (same mechanism as `app.reject_mutation()` on `audit_logs`), so
immutability does not depend on application code.

## Reversal

A reversal is a new journal with every line's debit and credit swapped,
linked to the original (`reversal_of_id`), dated in an open period. The
original is never modified. Corrections are then posted as a new entry.

## Idempotency

Postings originating from business documents carry a unique
`(organization_id, source_type, source_id, purpose)` key so a retried request
cannot post twice.
