import { Inject, Injectable } from '@nestjs/common';
import type { DependencyStatus, LivenessReport, ReadinessReport } from '@gap/shared';
import { APP_INFO } from '../../app-info.js';
import { APP_CONFIG } from '../../config/config.module.js';
import { type Env } from '../../config/env.schema.js';
import { RedisService } from '../../infrastructure/cache/redis.service.js';
import { PrismaService } from '../../infrastructure/database/prisma.service.js';

@Injectable()
export class HealthService {
  constructor(
    @Inject(APP_CONFIG) private readonly env: Env,
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  liveness(): LivenessReport {
    return {
      status: 'ok',
      service: APP_INFO.service,
      version: APP_INFO.version,
      environment: this.env.NODE_ENV,
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  }

  async readiness(): Promise<ReadinessReport> {
    const [database, redis] = await Promise.all([
      this.prisma.ping().then(toStatus),
      this.redis.isConfigured
        ? this.redis.ping().then(toStatus)
        : Promise.resolve<DependencyStatus>('not_configured'),
    ]);
    const checks = { database, redis };
    const down = Object.values(checks).includes('down');
    return { status: down ? 'down' : 'ok', checks, timestamp: new Date().toISOString() };
  }
}

function toStatus(healthy: boolean): DependencyStatus {
  return healthy ? 'up' : 'down';
}
