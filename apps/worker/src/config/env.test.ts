import { describe, expect, it } from 'vitest';
import { loadWorkerEnv } from './env.js';

describe('loadWorkerEnv', () => {
  it('requires a Redis connection', () => {
    expect(() => loadWorkerEnv({})).toThrow(/REDIS_URL or REDIS_HOST/);
    expect(() => loadWorkerEnv({ REDIS_URL: '', REDIS_HOST: '' })).toThrow(
      /REDIS_URL or REDIS_HOST/,
    );
  });

  it('applies defaults', () => {
    expect(loadWorkerEnv({ REDIS_HOST: 'localhost' })).toMatchObject({
      REDIS_PORT: 6379,
      QUEUE_PREFIX: 'global-accounting',
      WORKER_CONCURRENCY: 5,
    });
  });

  it('validates the queue prefix', () => {
    expect(() => loadWorkerEnv({ REDIS_HOST: 'localhost', QUEUE_PREFIX: 'Bad Prefix!' })).toThrow(
      /QUEUE_PREFIX/,
    );
  });
});
