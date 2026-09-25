# Rule versioning

**Status:** design. Implemented in Phase 6 (tax rules) and Phase 16 (compliance rules).

## Record

Every regulatory rule version stores: `country_id`, `jurisdiction_id`,
`rule_code`, `rule_type`, `conditions` (JSON, schema-validated),
`configuration` (JSON, schema-validated), `effective_from`, `effective_to`,
`version`, `source` (FK to `regulatory_sources`), `status`, `approved_by`,
`approved_at`, `last_reviewed_at`.

## Lifecycle

```
DRAFT → REVIEW → APPROVED → SCHEDULED → ACTIVE → EXPIRED
  ▲        │
  └────────┘ (changes requested)
```

- Only `DRAFT` versions are editable.
- Approval requires a different user from the author (four-eyes) and a source.
- `SCHEDULED` becomes `ACTIVE` when `effective_from` is reached (worker job).
- An `ACTIVE` or `EXPIRED` version is **never** modified. A change creates a
  new version; the previous version gets an `effective_to`.
- Effective ranges for the same rule code and scope must not overlap
  (exclusion constraint on `daterange(effective_from, effective_to)`).
- Transactions reference the version they used, so historical documents always
  re-render and re-report with the rule in force at the time.
