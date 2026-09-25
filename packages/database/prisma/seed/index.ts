/**
 * Development seed runner.
 *
 * Seeders are registered per phase (countries, currencies, permissions, system
 * roles and frameworks arrive in Phases 3-4; demo data is always labelled as
 * demo). Regulatory values (tax rates etc.) are NEVER seeded as real data.
 *
 * Phase 0 registers no seeders.
 */
import { PrismaClient } from '@prisma/client';

interface Seeder {
  readonly name: string;
  run(prisma: PrismaClient): Promise<void>;
}

const seeders: readonly Seeder[] = [];

async function main(): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Refusing to run the development seed with NODE_ENV=production.');
  }
  if (process.env.SEED_DATABASE === 'false') {
    process.stdout.write('SEED_DATABASE=false; skipping seed.\n');
    return;
  }

  const prisma = new PrismaClient();
  try {
    if (seeders.length === 0) {
      process.stdout.write('No seeders are registered yet (Phase 0). Nothing to do.\n');
    }
    for (const seeder of seeders) {
      process.stdout.write(`Seeding ${seeder.name}...\n`);
      await seeder.run(prisma);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  process.stderr.write(`Seed failed: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
