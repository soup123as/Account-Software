# Row Level Security

## Baseline (Phase 0 — implemented)

- RLS is **enabled on every table** in `public`, including
  `_prisma_migrations`. With no policies, non-owner roles see nothing.
- Supabase `anon` and `authenticated` roles have all privileges revoked on
  these tables (when those roles exist).
- `tests/integration/database.test.ts` verifies RLS is enabled on every table
  and that a non-owner role with explicit `SELECT`/`INSERT` grants still reads
  zero rows and cannot insert.
- `packages/database/src/schema.test.ts` fails if a migration creates a table
  without `ENABLE ROW LEVEL SECURITY`.

## Helpers

| Function                        | Returns                                          |
| ------------------------------- | ------------------------------------------------ |
| `app.current_user_id()`         | `uuid` from transaction-local setting, or `NULL` |
| `app.current_organization_id()` | `uuid` from transaction-local setting, or `NULL` |
| `app.reject_mutation()`         | Trigger function making a table append-only      |

## Tenant policies (Phase 2)

Template for a tenant-owned table:

```sql
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY customers_tenant_select ON customers FOR SELECT
  USING (organization_id = app.current_organization_id()
         AND app.is_active_member(organization_id));

CREATE POLICY customers_tenant_insert ON customers FOR INSERT
  WITH CHECK (organization_id = app.current_organization_id()
              AND app.is_active_member(organization_id));

CREATE POLICY customers_tenant_update ON customers FOR UPDATE
  USING (organization_id = app.current_organization_id())
  WITH CHECK (organization_id = app.current_organization_id());

CREATE POLICY customers_tenant_delete ON customers FOR DELETE
  USING (organization_id = app.current_organization_id());
```

`app.is_active_member()` (Phase 2) checks `organization_members` for the
current user with `status = 'ACTIVE'` and an active organization; it is
`SECURITY DEFINER` with a fixed `search_path`.

The API will execute tenant queries under a non-owner `NOBYPASSRLS` role so
these policies apply to API traffic as well as to direct Supabase access.
Required tests per table: cross-tenant SELECT, INSERT, UPDATE, DELETE.
