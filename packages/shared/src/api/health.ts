export type HealthStatus = 'ok' | 'degraded' | 'down';

export type DependencyStatus = 'up' | 'down' | 'not_configured';

export interface LivenessReport {
  readonly status: 'ok';
  readonly service: string;
  readonly version: string;
  readonly environment: string;
  readonly uptimeSeconds: number;
  readonly timestamp: string;
}

export interface ReadinessReport {
  readonly status: HealthStatus;
  readonly checks: Readonly<Record<string, DependencyStatus>>;
  readonly timestamp: string;
}
