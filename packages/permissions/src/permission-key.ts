declare const permissionKeyBrand: unique symbol;

/**
 * A permission key in `module.resource.action` form. Two segments are allowed
 * where the module and resource coincide (e.g. `invoice.view`, `report.tax`).
 * Segments are lower snake_case.
 */
export type PermissionKey = string & { readonly [permissionKeyBrand]: true };

const PERMISSION_KEY = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*){1,2}$/;

export function isPermissionKey(value: string): value is PermissionKey {
  return value.length <= 128 && PERMISSION_KEY.test(value);
}

export function parsePermissionKey(value: string): PermissionKey {
  if (!isPermissionKey(value)) {
    throw new TypeError(
      `"${value}" is not a valid permission key; expected lower snake_case "module.resource.action".`,
    );
  }
  return value;
}
