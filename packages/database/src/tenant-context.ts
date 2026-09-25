import { AsyncLocalStorage } from 'node:async_hooks';
import type { Prisma, PrismaClient } from '@prisma/client';

/**
 * Identity of the caller for the current unit of work.
 *
 * Phase 0 establishes the mechanism; Phase 1 populates `userId` from the
 * verified Supabase session and Phase 2 populates `organizationId` from a
 * verified active membership and adds the RLS policies that read these values.
 */
export interface TenantContext {
  readonly userId: string;
  readonly organizationId: string | null;
  readonly requestId?: string;
}

/** Transaction-local PostgreSQL settings read by `app.current_user_id()` etc. */
export const TENANT_SETTING = {
  USER_ID: 'app.current_user_id',
  ORGANIZATION_ID: 'app.current_organization_id',
} as const;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const storage = new AsyncLocalStorage<TenantContext>();

export function assertValidTenantContext(context: TenantContext): void {
  if (!UUID.test(context.userId)) {
    throw new TypeError('TenantContext.userId must be a UUID.');
  }
  if (context.organizationId !== null && !UUID.test(context.organizationId)) {
    throw new TypeError('TenantContext.organizationId must be a UUID or null.');
  }
}

export function runWithTenantContext<T>(context: TenantContext, fn: () => T): T {
  assertValidTenantContext(context);
  return storage.run(Object.freeze({ ...context }), fn);
}

export function getTenantContext(): TenantContext | undefined {
  return storage.getStore();
}

export function requireTenantContext(): TenantContext {
  const context = storage.getStore();
  if (!context) {
    throw new Error('No tenant context is active for this operation.');
  }
  return context;
}

/**
 * Runs `fn` inside a database transaction with the tenant identity bound via
 * `set_config(..., is_local => true)`. The settings are scoped to the
 * transaction, so pooled connections never leak identity between requests.
 */
export async function withTenantTransaction<T>(
  prisma: PrismaClient,
  context: TenantContext,
  fn: (tx: Prisma.TransactionClient) => Promise<T>,
  options?: {
    readonly isolationLevel?: Prisma.TransactionIsolationLevel;
    readonly timeoutMs?: number;
  },
): Promise<T> {
  assertValidTenantContext(context);
  return prisma.$transaction(
    async (tx) => {
      await tx.$queryRaw`
        SELECT
          set_config(${TENANT_SETTING.USER_ID}, ${context.userId}, true),
          set_config(${TENANT_SETTING.ORGANIZATION_ID}, ${context.organizationId ?? ''}, true)
      `;
      return fn(tx);
    },
    {
      ...(options?.isolationLevel ? { isolationLevel: options.isolationLevel } : {}),
      ...(options?.timeoutMs ? { timeout: options.timeoutMs } : {}),
    },
  );
}
