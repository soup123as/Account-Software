import type { PermissionKey } from './permission-key.js';

/**
 * Pure authorization predicates. The effective permission set for a user is
 * resolved server-side from their organization membership (Phase 3); the
 * frontend may use these only for display decisions, never for enforcement.
 *
 * There is intentionally no wildcard support: every grant is explicit.
 */
export function hasPermission(granted: ReadonlySet<string>, required: PermissionKey): boolean {
  return granted.has(required);
}

export function hasAllPermissions(
  granted: ReadonlySet<string>,
  required: readonly PermissionKey[],
): boolean {
  return required.every((permission) => granted.has(permission));
}

export function hasAnyPermission(
  granted: ReadonlySet<string>,
  required: readonly PermissionKey[],
): boolean {
  return required.some((permission) => granted.has(permission));
}
