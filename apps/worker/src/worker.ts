import { Queue, Worker } from 'bullmq';
import type { Redis } from 'ioredis';
import type { Logger } from '@gap/logger';
import { QueueName } from '@gap/shared';
import type { WorkerEnv } from './config/env.js';
import { jobHandlers } from './jobs/index.js';
import { createProcessor, type JobHandler } from './jobs/registry.js';
import { HEARTBEAT_JOB_NAME } from './jobs/scheduled-tasks/heartbeat.job.js';

export interface RunningWorker {
  close(): Promise<void>;
}

export async function startWorker(
  env: WorkerEnv,
  connection: Redis,
  logger: Logger,
  handlers: readonly JobHandler[] = jobHandlers,
): Promise<RunningWorker> {
  const context = { redis: connection, logger, queuePrefix: env.QUEUE_PREFIX };
  const queueNames = [...new Set(handlers.map((handler) => handler.queue))];

  const workers = queueNames.map((queueName) => {
    const worker = new Worker(
      queueName,
      createProcessor(
        handlers.filter((handler) => handler.queue === queueName),
        context,
      ),
      { connection, prefix: env.QUEUE_PREFIX, concurrency: env.WORKER_CONCURRENCY },
    );
    worker.on('failed', (job, error) => {
      logger.error({ jobId: job?.id, job: job?.name, queue: queueName, err: error }, 'job failed');
    });
    worker.on('error', (error) => {
      logger.error({ queue: queueName, err: error }, 'worker error');
    });
    return worker;
  });

  // Upserting a scheduler is idempotent: restarting N workers never creates N schedules.
  const systemQueue = new Queue(QueueName.SYSTEM, { connection, prefix: env.QUEUE_PREFIX });
  await systemQueue.upsertJobScheduler(
    HEARTBEAT_JOB_NAME,
    { every: env.HEARTBEAT_INTERVAL_MS },
    { name: HEARTBEAT_JOB_NAME, opts: { removeOnComplete: 100, removeOnFail: 500 } },
  );

  logger.info({ queues: queueNames, concurrency: env.WORKER_CONCURRENCY }, 'worker started');

  return {
    async close() {
      await Promise.all(workers.map((worker) => worker.close()));
      await systemQueue.close();
    },
  };
}
