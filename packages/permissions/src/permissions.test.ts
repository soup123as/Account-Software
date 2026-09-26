import { describe, expect, it } from 'vitest';
import {
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
  isPermissionKey,
  parsePermissionKey,
} from './index.js';

describe('permission keys', () => {
  it.each(['invoice.view', 'report.profit_loss', 'accounting.journal.reverse', 'user.create'])(
    'accepts %s',
    (key) => {
      expect(isPermissionKey(key)).toBe(true);
    },
  );

  it.each([
    'invoice',
    'Invoice.view',
    'invoice.*',
    'a.b.c.d',
    'invoice..view',
    'invoice.view ',
    '1x.view',
  ])('rejects %j', (key) => {
    expect(isPermissionKey(key)).toBe(false);
    expect(() => parsePermissionKey(key)).toThrow(TypeError);
  });
});

describe('authorization predicates', () => {
  const granted = new Set(['invoice.view', 'invoice.create']);
  const view = parsePermissionKey('invoice.view');
  const create = parsePermissionKey('invoice.create');
  const approve = parsePermissionKey('invoice.approve');

  it('requires an exact grant', () => {
    expect(hasPermission(granted, view)).toBe(true);
    expect(hasPermission(granted, approve)).toBe(false);
  });

  it('has no implicit wildcard semantics', () => {
    expect(hasPermission(new Set(['invoice.*', '*']), view)).toBe(false);
  });

  it('supports all/any checks', () => {
    expect(hasAllPermissions(granted, [view, create])).toBe(true);
    expect(hasAllPermissions(granted, [view, approve])).toBe(false);
    expect(hasAnyPermission(granted, [approve, create])).toBe(true);
    expect(hasAnyPermission(granted, [approve])).toBe(false);
  });

  it('denies when nothing is granted', () => {
    expect(hasAllPermissions(new Set(), [view])).toBe(false);
  });
});
