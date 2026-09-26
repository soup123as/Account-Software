# Regulatory data policy

1. **No fabricated rules.** The platform ships without real tax rates,
   thresholds or filing deadlines. All regulatory values are entered through
   the rule-versioning workflow with a cited authoritative source.
2. **No hard-coding.** Rates and rules never appear in application code or
   frontend constants.
3. **Seed data** may contain reference data that is not regulatory (ISO
   country and currency codes, names) and clearly labelled demo data. Test
   fixtures use obviously synthetic values and are named as fixtures.
4. **Provenance.** Each rule version links to a `regulatory_sources` record
   (authority, document, URL, publication/retrieval date) and records who
   approved it and when it was last reviewed.
5. **No compliance claims.** The UI and documents must not claim that a
   country is "compliant" unless its rules are approved and current. Coverage
   status is displayed per country.
6. **Change control.** Active and historical versions are immutable; updates
   are new versions.
