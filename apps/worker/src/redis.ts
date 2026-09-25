import { Redis, type RedisOptions } from 'ioredis';
import type { WorkerEnv } from './config/env.js';

/**
 * BullMQ workers require `maxRetriesPerRequest: null` so blocking commands
 * are retried across reconnects instead of failing jobs.
 */
export function createRedisConnection(env: WorkerEnv): Redis {
  const options: RedisOptions = { maxRetriesPerRequest: null, enableReadyCheck: true };
  if (env.REDIS_URL) {
    return new Redis(env.REDIS_URL, options);
  }
  return new Redis({
    ...options,
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    ...(env.REDIS_USERNAME ? { username: env.REDIS_USERNAME } : {}),
    ...(env.REDIS_PASSWORD ? { password: env.REDIS_PASSWORD } : {}),
  });
}
