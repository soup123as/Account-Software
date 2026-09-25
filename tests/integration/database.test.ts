import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createPrismaClient, withTenantTransaction, type PrismaClient } from '@gap/database';
import { requireEnv } from '../support/env.ts';

const USER_A = '6f1c1a8e-2f3b-4c1d-9e8f-0a1b2c3d4e5f';
const USER_B = 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d';
const ORG_A = '0b8f8a4e-7a57-4d0f-9b9c-3f0e0a1f3b11';

let prisma: PrismaClient;

beforeAll(async () => {
  prisma = createPrismaClient({ databaseUrl: requireEnv('DATABASE_URL') });
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('migrations', () => {
  it('are all applied successfully', async () => {
    const rows = await prisma.$queryRaw<
      { migration_name: string; finished_at: Date | null; rolled_back_at: Date | null }[]
    >`
      SELECT migration_name, finished_at, rolled_back_at FROM _prisma_migrations
    `;
    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) {
      expect(row.finished_at, row.migration_name).not.toBeNull();
      expect(row.rolled_back_at, row.migration_name).toBeNull();
    }
  });
});

describe('row level security baseline', () => {
  it('is enabled on every table in the public schema', async () => {
    const tables = await prisma.$queryRaw<{ table_name: string; rls: boolean }[]>`
      SELECT c.relname AS table_name, c.relrowsecurity AS rls
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public' AND c.relkind IN ('r', 'p')
    `;
    expect(tables.length).toBeGreaterThan(0);
    const withoutRls = tables.filter((t) => !t.rls).map((t) => t.table_name);
    expect(withoutRls).toEqual([]);
  });

  it('denies a non-owner role by default, even with table privileges', async () => {
    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'gap_rls_probe') THEN
          CREATE ROLE gap_rls_probe NOLOGIN NOSUPERUSER NOBYPASSRLS;
        END IF;
      END $$;
    `);
    await prisma.$executeRawUnsafe('GRANT SELECT, INSERT ON public.audit_logs TO gap_rls_probe');
    await prisma.$executeRaw`INSERT INTO audit_logs (action, module) VALUES ('test.rls_probe', 'tests')`;

    const visible = await prisma.$transaction(async (tx) => {
      await tx.$executeRawUnsafe('SET LOCAL ROLE gap_rls_probe');
      return tx.$queryRaw<{ count: bigint }[]>`SELECT count(*)::bigint AS count FROM audit_logs`;
    });
    expect(visible[0]!.count).toBe(0n);

    await expect(
      prisma.$transaction(async (tx) => {
        await tx.$executeRawUnsafe('SET LOCAL ROLE gap_rls_probe');
        await tx.$executeRaw`INSERT INTO audit_logs (action, module) VALUES ('test.rls_probe', 'tests')`;
      }),
    ).rejects.toThrow(/row-level security/);
  });
});

describe('audit_logs', () => {
  it('accepts inserts', async () => {
    const created = await prisma.auditLog.create({
      data: {
        action: 'test.insert',
        module: 'tests',
        organizationId: ORG_A,
        userId: USER_A,
        newValues: { amount: '100.0000' },
        ipAddress: '203.0.113.10',
      },
    });
    expect(created.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(created.createdAt).toBeInstanceOf(Date);
  });

  it('rejects UPDATE, DELETE and TRUNCATE (append-only)', async () => {
    const row = await prisma.auditLog.create({
      data: { action: 'test.immutable', module: 'tests' },
    });
    await expect(
      prisma.auditLog.update({ where: { id: row.id }, data: { action: 'tampered' } }),
    ).rejects.toThrow(/append-only/);
    await expect(prisma.auditLog.delete({ where: { id: row.id } })).rejects.toThrow(/append-only/);
    await expect(prisma.$executeRawUnsafe('TRUNCATE audit_logs')).rejects.toThrow(/append-only/);

    const unchanged = await prisma.auditLog.findUniqueOrThrow({ where: { id: row.id } });
    expect(unchanged.action).toBe('test.immutable');
  });
});

describe('tenant context bridge', () => {
  const readContext = (tx: Pick<PrismaClient, '$queryRaw'>) =>
    tx.$queryRaw<{ user_id: string | null; organization_id: string | null }[]>`
      SELECT app.current_user_id()::text AS user_id, app.current_organization_id()::text AS organization_id
    `;

  it('exposes the tenant identity to SQL inside the transaction', async () => {
    const [row] = await withTenantTransaction(
      prisma,
      { userId: USER_A, organizationId: ORG_A },
      (tx) => readContext(tx),
    );
    expect(row).toEqual({ user_id: USER_A, organization_id: ORG_A });
  });

  it('fails closed (NULL) outside a tenant transaction', async () => {
    const [row] = await readContext(prisma);
    expect(row).toEqual({ user_id: null, organization_id: null });
  });

  it('never leaks identity between concurrent transactions on pooled connections', async () => {
    const results = await Promise.all(
      Array.from({ length: 10 }, (_, i) => {
        const userId = i % 2 === 0 ? USER_A : USER_B;
        return withTenantTransaction(prisma, { userId, organizationId: null }, async (tx) => {
          await tx.$executeRaw`SELECT pg_sleep(0.01)`;
          const [row] = await readContext(tx);
          return { expected: userId, actual: row!.user_id };
        });
      }),
    );
    for (const { expected, actual } of results) {
      expect(actual).toBe(expected);
    }
    const [after] = await readContext(prisma);
    expect(after!.user_id).toBeNull();
  });

  it('rejects malformed identities before touching the database', async () => {
    await expect(
      withTenantTransaction(
        prisma,
        { userId: "x'; DROP TABLE audit_logs; --", organizationId: null },
        () => Promise.resolve(),
      ),
    ).rejects.toThrow(TypeError);
  });
});
