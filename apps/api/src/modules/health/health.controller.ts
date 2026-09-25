import { Controller, Get } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import {
  ok,
  ServiceUnavailableError,
  type ApiSuccess,
  type LivenessReport,
  type ReadinessReport,
} from '@gap/shared';
import { Public } from '../../common/decorators/public.decorator.js';
import { HealthService } from './health.service.js';

/**
 * Health endpoints are intentionally unauthenticated (for load balancers and
 * orchestrators) and expose no tenant, user or configuration data.
 */
@Public()
@SkipThrottle()
@Controller('health')
export class HealthController {
  constructor(private readonly health: HealthService) {}

  /** Liveness: the process is up and serving requests. Never touches dependencies. */
  @Get()
  live(): ApiSuccess<LivenessReport> {
    return ok(this.health.liveness());
  }

  /** Readiness: required dependencies are reachable. Returns 503 when any is down. */
  @Get('ready')
  async ready(): Promise<ApiSuccess<ReadinessReport>> {
    const report = await this.health.readiness();
    if (report.status === 'down') {
      throw new ServiceUnavailableError('One or more dependencies are unavailable.', {
        details: Object.entries(report.checks)
          .filter(([, status]) => status === 'down')
          .map(([name]) => ({ path: name, message: 'down' })),
      });
    }
    return ok(report);
  }
}
