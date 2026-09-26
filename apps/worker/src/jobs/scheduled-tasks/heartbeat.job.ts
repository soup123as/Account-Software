import { QueueName } from '@gap/shared';
import type { JobHandler } from '../registry.js';

export const HEARTBEAT_JOB_NAME = 'system.heartbeat';

/** Seconds the heartbeat key survives; a stale key means no worker is processing jobs. */
export const HEARTBEAT_TTL_SECONDS = 180;

export function heartbeatKey(queuePrefix: string): string {
  return `${queuePrefix}:worker:heartbeat`;
}

export interface HeartbeatResult {
  readonly processedAt: string;
}

/**
 * Records that at least one worker is alive and consuming the system queue.
 * Operators (and, from Phase 20, readiness monitoring) read the key to detect
 * a stalled worker fleet.
 */
export const heartbeatJob: JobHandler<unknown, HeartbeatResult> = {
  name: HEARTBEAT_JOB_NAME,
  queue: QueueName.SYSTEM,
  async process(_job, { redis, queuePrefix }) {
    const processedAt = new Date().toISOString();
    await redis.set(heartbeatKey(queuePrefix), processedAt, 'EX', HEARTBEAT_TTL_SECONDS);
    return { processedAt };
  },
};
