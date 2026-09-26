import { Queue, QueueEvents } from 'bullmq';
import { Redis } from 'ioredis';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createLogger } from '@gap/logger';
import { QueueName } from '@gap/shared';
import { loadWorkerEnv } from '../../apps/worker/src/config/env.ts';
import {
  heartbeatKey,
  HEARTBEAT_JOB_NAME,
} from '../../apps/worker/src/jobs/scheduled-tasks/heartbeat.job.ts';
import { startWorker, type RunningWorker } from '../../apps/worker/src/worker.ts';
import '../support/env.ts';

const prefix = `gap-it-${Date.now().toString(36)}`;
let connection: Redis;
let worker: RunningWorker;

beforeAll(async () => {
  const env = loadWorkerEnv({
    ...process.env,
    QUEUE_PREFIX: prefix,
    HEARTBEAT_INTERVAL_MS: '600000',
  });
  connection = env.REDIS_URL
    ? new Redis(env.REDIS_URL, { maxRetriesPerRequest: null })
    : new Redis({ host: env.REDIS_HOST, port: env.REDIS_PORT, maxRetriesPerRequest: null });
  worker = await startWorker(
    env,
    connection,
    createLogger({ level: 'silent', service: 'worker-it' }),
  );
});

afterAll(async () => {
  await worker.close();
  const keys = await connection.keys(`${prefix}:*`);
  if (keys.length > 0) await connection.del(...keys);
  await connection.quit();
});

describe('worker (BullMQ + Redis)', () => {
  it('processes a system heartbeat job and records liveness', async () => {
    const queue = new Queue(QueueName.SYSTEM, { connection, prefix });
    const events = new QueueEvents(QueueName.SYSTEM, {
      connection: connection.duplicate(),
      prefix,
    });
    await events.waitUntilReady();

    const job = await queue.add(HEARTBEAT_JOB_NAME, {});
    const result = (await job.waitUntilFinished(events, 10_000)) as { processedAt: string };

    expect(await connection.get(heartbeatKey(prefix))).toBe(result.processedAt);
    expect(await connection.ttl(heartbeatKey(prefix))).toBeGreaterThan(0);

    await events.close();
    await queue.close();
  });

  it('registers exactly one heartbeat scheduler, even when started twice', async () => {
    const env = loadWorkerEnv({
      ...process.env,
      QUEUE_PREFIX: prefix,
      HEARTBEAT_INTERVAL_MS: '600000',
    });
    const second = await startWorker(
      env,
      connection,
      createLogger({ level: 'silent', service: 'worker-it' }),
    );
    const queue = new Queue(QueueName.SYSTEM, { connection, prefix });
    const schedulers = await queue.getJobSchedulers();
    expect(schedulers.filter((s) => s.key === HEARTBEAT_JOB_NAME)).toHaveLength(1);
    await second.close();
    await queue.close();
  });

  it('fails unknown jobs without retrying', async () => {
    const queue = new Queue(QueueName.SYSTEM, { connection, prefix });
    const events = new QueueEvents(QueueName.SYSTEM, {
      connection: connection.duplicate(),
      prefix,
    });
    await events.waitUntilReady();
    const job = await queue.add('system.does_not_exist', {}, { attempts: 5 });
    await expect(job.waitUntilFinished(events, 10_000)).rejects.toThrow(/No handler registered/);
    const reloaded = await queue.getJob(job.id!);
    expect(reloaded?.attemptsMade).toBe(1);
    await events.close();
    await queue.close();
  });
});
