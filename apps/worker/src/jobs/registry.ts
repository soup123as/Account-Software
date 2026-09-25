import { UnrecoverableError, type Job } from 'bullmq';
import type { Redis } from 'ioredis';
import type { Logger } from '@gap/logger';
import type { QueueName } from '@gap/shared';

export interface JobContext {
  readonly redis: Redis;
  readonly logger: Logger;
  readonly queuePrefix: string;
}

export interface JobHandler<TData = unknown, TResult = unknown> {
  /** Unique job name, `<area>.<action>` (e.g. `system.heartbeat`). */
  readonly name: string;
  readonly queue: QueueName;
  process(job: Job<TData>, context: JobContext): Promise<TResult>;
}

/**
 * Builds a BullMQ processor that dispatches by job name. Unknown job names
 * fail permanently (no retries) so a mis-routed job cannot loop forever.
 */
export function createProcessor(
  handlers: readonly JobHandler[],
  context: JobContext,
): (job: Job) => Promise<unknown> {
  const byName = new Map<string, JobHandler>();
  for (const handler of handlers) {
    if (byName.has(handler.name)) {
      throw new Error(`Duplicate job handler registered for "${handler.name}".`);
    }
    byName.set(handler.name, handler);
  }

  return async (job: Job) => {
    const handler = byName.get(job.name);
    if (!handler) {
      throw new UnrecoverableError(`No handler registered for job "${job.name}".`);
    }
    const startedAt = Date.now();
    const result = await handler.process(job, context);
    context.logger.info(
      { jobId: job.id, job: job.name, queue: job.queueName, durationMs: Date.now() - startedAt },
      'job completed',
    );
    return result;
  };
}
