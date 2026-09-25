# Compliance engine

**Status:** design. Implemented in Phase 16.

Components: compliance rules (versioned like tax rules), filing requirements,
deadlines, tax returns, regulatory reports, compliance calendar, status,
documents and history.

- Filing obligations are derived per organization from its country,
  jurisdictions, registrations and approved rule versions.
- The worker generates calendar entries and reminders (idempotent scheduled
  jobs) and marks overdue obligations.
- Tax returns aggregate `tax_transactions` for a period using the rule
  versions recorded on each transaction.
- Submissions to authorities (where integrated) use idempotency keys and store
  the authority's acknowledgement.
- Every status change is audited.
