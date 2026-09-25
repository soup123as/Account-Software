# Adding a country

**Status:** process definition; tooling arrives in Phase 4.

Adding a country must not require changes to `accounting-engine`, `tax-engine`
or `rules-engine`.

1. **Reference data (database, via migration or Super Admin):** country
   (ISO2/ISO3, phone code, locale, timezone, date/number formats, default
   currency, default fiscal year, tax system, accounting framework, status),
   regions, jurisdictions, currency if new.
2. **Regulatory sources:** register the authoritative sources (legislation,
   tax authority publications) with URLs and retrieval dates.
3. **Rules:** create DRAFT tax/compliance rule versions citing those sources;
   submit for review; approve; schedule.
4. **Adapter (optional):** `packages/country-rules/src/<CC>/` for identifier
   validation, address format, invoice/report configuration references. Export
   it from `packages/country-rules/src/index.ts`.
5. **Chart of accounts template** for the country (configuration, not code).
6. **Tests:** adapter unit tests; rule resolution tests using clearly labelled
   test fixtures (not real rates presented as authoritative).
7. **Docs:** add the country to the coverage table with its verification status.

A country without approved rules can still be selected, but tax calculation
returns an explicit "no approved rule" error instead of assuming zero tax.
