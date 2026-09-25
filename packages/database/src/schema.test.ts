import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const prismaDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'prisma');
const schemaSource = readFileSync(join(prismaDir, 'schema.prisma'), 'utf8');
/** Schema with `//` and `///` comments removed, so conventions are checked on declarations only. */
const schema = schemaSource.replace(/\/\/.*$/gm, '');
const models = [...schema.matchAll(/^model (\w+) \{([\s\S]*?)^\}/gm)].map(([, name, body]) => ({
  name: name!,
  body: body!,
}));

describe('Prisma schema conventions', () => {
  it('never uses Float (money must be Decimal)', () => {
    expect(schema).not.toMatch(/\bFloat\b/);
  });

  it.each(models.map((m) => [m.name, m.body] as const))(
    '%s uses a database-generated UUID primary key',
    (_, body) => {
      expect(body).toMatch(
        /\bid\s+String\s+@id @default\(dbgenerated\("gen_random_uuid\(\)"\)\) @db\.Uuid/,
      );
    },
  );

  it.each(models.map((m) => [m.name, m.body] as const))(
    '%s maps to a snake_case table',
    (_, body) => {
      expect(body).toMatch(/@@map\("[a-z][a-z0-9_]*"\)/);
    },
  );

  it.each(models.map((m) => [m.name, m.body] as const))(
    '%s stores DateTime as timestamptz',
    (_, body) => {
      for (const line of body.split('\n').filter((l) => /\sDateTime\??\s/.test(l))) {
        expect(line).toContain('@db.Timestamptz');
      }
    },
  );

  it.each(models.map((m) => [m.name, m.body] as const))(
    '%s stores Decimal as NUMERIC(20,4) or narrower-scale rates',
    (_, body) => {
      for (const line of body.split('\n').filter((l) => /\sDecimal\??\s/.test(l))) {
        expect(line).toMatch(/@db\.Decimal\(\d+, ?\d+\)/);
      }
    },
  );
});

describe('migrations', () => {
  const migrationsDir = join(prismaDir, 'migrations');
  const migrations = readdirSync(migrationsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  it('exist and are timestamp-ordered', () => {
    expect(migrations.length).toBeGreaterThan(0);
    for (const name of migrations) {
      expect(name).toMatch(/^\d{14}_[a-z0-9_]+$/);
    }
  });

  it('enable RLS on every table they create', () => {
    for (const name of migrations) {
      const sql = readFileSync(join(migrationsDir, name, 'migration.sql'), 'utf8');
      const created = [...sql.matchAll(/CREATE TABLE "(?:public"\.")?(\w+)"/g)].map((m) => m[1]);
      for (const table of created) {
        expect(sql, `${name} must enable RLS on ${table!}`).toContain(
          `ALTER TABLE "${table!}" ENABLE ROW LEVEL SECURITY`,
        );
      }
    }
  });
});
