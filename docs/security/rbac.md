# Role-based access control

**Status:** Phase 0 implements the permission key format and pure predicates
(`@gap/permissions`). Roles, assignments, guards and the catalog arrive in
Phase 3.

## Permission keys

Format `module.resource.action` (or `resource.action` when module and resource
coincide), lower snake_case: `invoice.view`, `journal.reverse`,
`report.profit_loss`. Validated by `parsePermissionKey`.

- No wildcards. Every grant is explicit (`invoice.*` grants nothing — tested).
- Enforcement is server-side only (`@RequirePermissions()` guard, Phase 3).
  The web uses the same predicates for navigation visibility only.

## Model (Phase 3)

```
permissions (catalog, seeded from code)
roles (system roles + organization custom roles)
role_permissions (role ↔ permission)
user_roles (organization membership ↔ role)
```

Default company roles: Company Owner, Company Admin, Finance Manager, Senior
Accountant, Junior Accountant, Sales Manager, Sales Executive, Purchase
Manager, Purchase Executive, Inventory Manager, Inventory Executive, HR
Manager, HR Executive, Project Manager, Employee, Viewer. Organizations may
create custom roles. Role/permission changes are audited.
