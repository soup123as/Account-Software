import { z } from 'zod';

const optionalString = z.preprocess(
  (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
  z.string().optional(),
);

export const workerEnvSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    REDIS_URL: optionalString.pipe(z.url().optional()),
    REDIS_HOST: optionalString,
    REDIS_PORT: z.coerce.number().int().min(1).max(65535).default(6379),
    REDIS_USERNAME: optionalString,
    REDIS_PASSWORD: optionalString,
    QUEUE_PREFIX: z
      .string()
      .regex(/^[a-z0-9-]+$/, 'QUEUE_PREFIX may only contain lowercase letters, digits and "-".')
      .default('global-accounting'),
    WORKER_CONCURRENCY: z.coerce.number().int().min(1).max(100).default(5),
    HEARTBEAT_INTERVAL_MS: z.coerce.number().int().min(5_000).default(60_000),
    LOG_LEVEL: z
      .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
      .default('info'),
  })
  .refine((env) => env.REDIS_URL !== undefined || env.REDIS_HOST !== undefined, {
    message: 'Either REDIS_URL or REDIS_HOST must be set for the worker.',
    path: ['REDIS_URL'],
  });

export type WorkerEnv = z.infer<typeof workerEnvSchema>;

export function loadWorkerEnv(source: NodeJS.ProcessEnv = process.env): WorkerEnv {
  const result = workerEnvSchema.safeParse(source);
  if (!result.success) {
    const problems = result.error.issues
      .map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('\n');
    throw new Error(`Invalid worker environment configuration:\n${problems}`);
  }
  return Object.freeze(result.data);
}
