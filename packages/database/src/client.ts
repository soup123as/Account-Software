import { PrismaClient } from '@prisma/client';

export interface CreatePrismaClientOptions {
  /** Overrides DATABASE_URL (e.g. for tests against a dedicated database). */
  readonly databaseUrl?: string;
  /** Log slow/verbose query events. Never enable query logging in production: parameters may contain PII. */
  readonly logQueries?: boolean;
}

/**
 * Creates a Prisma client. Apps own the client lifecycle (connect on start,
 * disconnect on shutdown) — there is deliberately no module-level singleton so
 * tests and workers can manage isolated instances.
 */
export function createPrismaClient(options: CreatePrismaClientOptions = {}): PrismaClient {
  return new PrismaClient({
    ...(options.databaseUrl ? { datasources: { db: { url: options.databaseUrl } } } : {}),
    log: options.logQueries ? ['query', 'warn', 'error'] : ['warn', 'error'],
    errorFormat: 'minimal',
  });
}
