import { Module, type DynamicModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import type { Logger } from 'pino';
import { LoggerModule } from './common/logging/logger.module.js';
import { ConfigModule } from './config/config.module.js';
import { type Env } from './config/env.schema.js';
import { CacheModule } from './infrastructure/cache/cache.module.js';
import { DatabaseModule } from './infrastructure/database/database.module.js';
import { SupabaseModule } from './infrastructure/supabase/supabase.module.js';
import { HealthModule } from './modules/health/health.module.js';

@Module({})
export class AppModule {
  static forRoot(env: Env, logger: Logger): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.forRoot(env),
        LoggerModule.forRoot(logger),
        // In-memory throttling per instance. A Redis-backed store for
        // multi-instance deployments is part of Phase 19 hardening.
        ThrottlerModule.forRoot([
          { ttl: env.RATE_LIMIT_WINDOW_MS, limit: env.RATE_LIMIT_MAX_REQUESTS },
        ]),
        DatabaseModule,
        CacheModule,
        SupabaseModule,
        HealthModule,
      ],
      providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
    };
  }
}
