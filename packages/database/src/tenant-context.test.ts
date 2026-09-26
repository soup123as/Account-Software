import { describe, expect, it } from 'vitest';
import {
  assertValidTenantContext,
  getTenantContext,
  requireTenantContext,
  runWithTenantContext,
} from './tenant-context.js';

const USER = '6f1c1a8e-2f3b-4c1d-9e8f-0a1b2c3d4e5f';
const ORG = '0b8f8a4e-7a57-4d0f-9b9c-3f0e0a1f3b11';

describe('tenant context', () => {
  it('is only visible inside the run scope', async () => {
    expect(getTenantContext()).toBeUndefined();
    await runWithTenantContext({ userId: USER, organizationId: ORG }, async () => {
      await Promise.resolve();
      expect(getTenantContext()).toEqual({ userId: USER, organizationId: ORG });
    });
    expect(getTenantContext()).toBeUndefined();
  });

  it('isolates concurrent scopes', async () => {
    const other = 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d';
    const seen = await Promise.all(
      [USER, other].map((userId) =>
        runWithTenantContext({ userId, organizationId: null }, async () => {
          await new Promise((resolve) => setTimeout(resolve, 5));
          return requireTenantContext().userId;
        }),
      ),
    );
    expect(seen).toEqual([USER, other]);
  });

  it('is immutable', () => {
    runWithTenantContext({ userId: USER, organizationId: ORG }, () => {
      expect(() => {
        (requireTenantContext() as { userId: string }).userId = 'x';
      }).toThrow(TypeError);
    });
  });

  it('requires a context where one is mandatory', () => {
    expect(() => requireTenantContext()).toThrow(/No tenant context/);
  });

  it.each([
    { userId: 'not-a-uuid', organizationId: null },
    { userId: USER, organizationId: "' OR 1=1 --" },
  ])('rejects malformed identifiers %j', (context) => {
    expect(() => assertValidTenantContext(context)).toThrow(TypeError);
  });
});
