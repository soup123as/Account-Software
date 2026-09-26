# Country rule engine

**Status:** design. Country configuration in Phase 4, rules and tax engine in
Phase 6.

## Separation of concerns

| Layer                         | Contains                                                                                                                                        |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Database (platform tables)    | Countries, regions, jurisdictions, currencies, frameworks, tax systems, tax authorities, **versioned rules and rates**, regulatory sources      |
| `packages/country-rules/<CC>` | Code adapters: identifier validators (e.g. format checks for ABN, GSTIN), address/phone formats, report/invoice layout configuration references |
| `packages/rules-engine`       | Resolves the applicable approved rule version for a context                                                                                     |
| `packages/tax-engine`         | Generic calculation from a resolved rule version                                                                                                |
| `packages/accounting-engine`  | Country-agnostic; receives tax lines and accounts, never country logic                                                                          |

## Resolution flow

```
Transaction context
  (organization, country, jurisdiction, business type, registration,
   transaction date, transaction type, party locations, product/tax category)
        │
        ▼
rules-engine: select rules where status ∈ {ACTIVE, EXPIRED}
              and effective_from ≤ date < effective_to (or open-ended)
              and conditions match → exactly one version, else TaxRuleError
        │
        ▼
tax-engine: compute base, tax, rounding (per rule configuration)
        │
        ▼
tax_transactions row stores rule id + version id + rate/config snapshot
        │
        ▼
accounting-engine: posting with tax accounts from configuration
```

Ambiguity (zero or multiple matching versions) is an error, never a guess.

## No fabricated data

Rates, thresholds and filing requirements are entered by Super Admin with a
cited regulatory source and go through review/approval before activation.
Seed data never contains real-looking regulatory values.
