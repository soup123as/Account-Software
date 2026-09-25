import { Inject, Injectable, type OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import { APP_CONFIG } from '../../config/config.module.js';
import { type Env } from '../../config/env.schema.js';
import { withTimeout } from '../database/prisma.service.js';

/**
 * Optional Redis connection (cache, distributed rate limiting and queue
 * producers in later phases). Absent configuration is reported as
 * `not_configured` rather than failing boot.
 */
@Injectable()
export class RedisService implements OnModuleDestroy {
  readonly client: Redis | null;

  constructor(@Inject(APP_CONFIG) env: Env) {
    const common = {
      lazyConnect: true,
      enableOfflineQueue: false,
      maxRetriesPerRequest: 1,
    } as const;
    if (env.REDIS_URL) {
      this.client = new Redis(env.REDIS_URL, common);
    } else if (env.REDIS_HOST) {
      this.client = new Redis({
        ...common,
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
        ...(env.REDIS_USERNAME ? { username: env.REDIS_USERNAME } : {}),
        ...(env.REDIS_PASSWORD ? { password: env.REDIS_PASSWORD } : {}),
      });
    } else {
      this.client = null;
    }
    // Connection errors surface through ping(); avoid unhandled 'error' events.
    this.client?.on('error', () => undefined);
  }

  get isConfigured(): boolean {
    return this.client !== null;
  }

  async ping(timeoutMs = 2000): Promise<boolean> {
    if (!this.client) {
      return false;
    }
    try {
      if (this.client.status === 'wait' || this.client.status === 'end') {
        await withTimeout(this.client.connect(), timeoutMs);
      }
      return (await withTimeout(this.client.ping(), timeoutMs)) === 'PONG';
    } catch {
      return false;
    }
  }

  onModuleDestroy(): void {
    this.client?.disconnect();
  }
}
