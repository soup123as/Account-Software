# Multi-tenancy

**Status:** Phase 0 provides the tenant-context mechanism and deny-by-default
RLS. Organizations, memberships and tenant policies are implemented in Phase 2.

## Model

```
users ──< organization_members >── organizations
            role(s) per membership        │
                                           └──< every tenant-owned table (organization_id)
```

- One user may belong to many organizations with different roles in each.
- Roles and permissions attach to the **membership**, not the user.
- Every organization-owned row carries `organization_id` (NOT NULL, FK, indexed).

## Isolation layers

| Layer          | Mechanism                                                                                 |
| -------------- | ----------------------------------------------------------------------------------------- |
| Application    | Services receive a `TenantContext`; repositories always filter by `organizationId`.       |
| API            | Tenant resolution guard verifies an **active** membership for the requested organization. |
| Database (RLS) | Policies compare `organization_id` with `app.current_organization_id()` (and membership). |

Any single layer failing must not expose data; each is tested independently.

## Tenant context bridge (implemented)

`@gap/database` exports `withTenantTransaction(prisma, context, fn)`:

1. Validates `userId` / `organizationId` are UUIDs (rejects anything else).
2. Opens a transaction and runs
   `set_config('app.current_user_id', …, true)` and
   `set_config('app.current_organization_id', …, true)` — **transaction-local**,
   so pooled connections never carry identity into another request.
3. SQL helpers `app.current_user_id()` / `app.current_organization_id()`
   return the values, or `NULL` when unset, so policies fail closed.

Integration tests prove the settings are visible inside the transaction, absent
outside it, and never leak across concurrent transactions.

## Phase 2 plan

- Tables: `organizations`, `organization_settings`, `organization_members`,
  `branches`, `departments`.
- The API connects to PostgreSQL through a dedicated non-owner, `NOBYPASSRLS`
  role (switched per transaction with `SET LOCAL ROLE`) so RLS applies to API
  queries, not only to Supabase Data API access.
- Policies per table for SELECT / INSERT / UPDATE / DELETE, plus `WITH CHECK`
  on writes so rows cannot be moved into another tenant.
- Security tests: cross-tenant SELECT, INSERT, UPDATE, DELETE; suspended
  membership; suspended organization.
