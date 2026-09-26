import { UnrecoverableError, type Job } from 'bullmq';
import type { Redis } from 'ioredis';
import { pino } from 'pino';
import { describe, expect, it, vi } from 'vitest';
import { QueueName } from '@gap/shared';
import { createProcessor, type JobHandler } from './registry.js';
import {
  heartbeatJob,
  heartbeatKey,
  HEARTBEAT_TTL_SECONDS,
} from './scheduled-tasks/heartbeat.job.js';

const logger = pino({ level: 'silent' });
const fakeJob = (name: string) => ({ id: '1', name, queueName: QueueName.SYSTEM, data: {} }) as Job;

describe('createProcessor', () => {
  it('dispatches by job name', async () => {
    const handler: JobHandler = {
      name: 'test.echo',
      queue: QueueName.SYSTEM,
      process: () => Promise.resolve('done'),
    };
    const processor = createProcessor([handler], { redis: {} as Redis, logger, queuePrefix: 'p' });
    await expect(processor(fakeJob('test.echo'))).resolves.toBe('done');
  });

  it('fails unknown jobs permanently', async () => {
    const processor = createProcessor([], { redis: {} as Redis, logger, queuePrefix: 'p' });
    await expect(processor(fakeJob('nope'))).rejects.toBeInstanceOf(UnrecoverableError);
  });

  it('rejects duplicate registrations', () => {
    const handler: JobHandler = {
      name: 'x.y',
      queue: QueueName.SYSTEM,
      process: () => Promise.resolve(),
    };
    expect(() =>
      createProcessor([handler, handler], { redis: {} as Redis, logger, queuePrefix: 'p' }),
    ).toThrow(/Duplicate/);
  });
});

describe('heartbeatJob', () => {
  it('writes an expiring heartbeat key', async () => {
    const set = vi.fn().mockResolvedValue('OK');
    const result = await heartbeatJob.process(fakeJob(heartbeatJob.name), {
      redis: { set } as unknown as Redis,
      logger,
      queuePrefix: 'gap-test',
    });
    expect(set).toHaveBeenCalledWith(
      heartbeatKey('gap-test'),
      result.processedAt,
      'EX',
      HEARTBEAT_TTL_SECONDS,
    );
  });
});
