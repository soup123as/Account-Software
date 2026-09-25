import { Inject, Injectable, type OnModuleDestroy } from '@nestjs/common';
import { createPrismaClient, type PrismaClient } from '@gap/database';
import { APP_CONFIG } from '../../config/config.module.js';
import { type Env } from '../../config/env.schema.js';

/**
 * Owns the API's Prisma client. Prisma connects lazily on first query, so the
 * API can boot (and report liveness) while the database is unavailable;
 * readiness reports the database state separately.
 */
@Injectable()
export class PrismaService implements OnModuleDestroy {
  readonly client: PrismaClient;

  constructor(@Inject(APP_CONFIG) env: Env) {
    this.client = createPrismaClient({ databaseUrl: env.DATABASE_URL });
  }

  async ping(timeoutMs = 2000): Promise<boolean> {
    try {
      await withTimeout(this.client.$queryRaw`SELECT 1`, timeoutMs);
      return true;
    } catch {
      return false;
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.$disconnect();
  }
}

export async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error(`Timed out after ${String(timeoutMs)}ms`)),
          timeoutMs,
        );
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}
