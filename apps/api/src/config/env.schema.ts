import { z } from 'zod';

/** Treat `KEY=` (empty) in .env files as "not set". */
const optionalString = z.preprocess(
  (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
  z.string().optional(),
);

const optionalUrl = z.preprocess(
  (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
  z.url().optional(),
);

export const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    APP_NAME: z.string().min(1).default('Global Accounting Platform'),
    APP_URL: z.url().default('http://localhost:5173'),
    PORT: z.coerce.number().int().min(1).max(65535).default(3000),
    API_PREFIX: z
      .string()
      .regex(/^[a-z0-9/-]+$/, 'API_PREFIX may only contain lowercase letters, digits, "/" and "-".')
      .default('api/v1'),

    DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),

    REDIS_URL: optionalUrl,
    REDIS_HOST: optionalString,
    REDIS_PORT: z.coerce.number().int().min(1).max(65535).default(6379),
    REDIS_USERNAME: optionalString,
    REDIS_PASSWORD: optionalString,

    SUPABASE_URL: optionalUrl,
    SUPABASE_ANON_KEY: optionalString,
    SUPABASE_SERVICE_ROLE_KEY: optionalString,

    RATE_LIMIT_WINDOW_MS: z.coerce.number().int().min(1000).default(60_000),
    RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().min(1).default(100),

    LOG_LEVEL: z
      .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
      .default('info'),
  })
  .superRefine((env, ctx) => {
    if (env.NODE_ENV === 'production' && !env.APP_URL.startsWith('https://')) {
      ctx.addIssue({
        code: 'custom',
        path: ['APP_URL'],
        message: 'APP_URL must use https in production.',
      });
    }
    if (env.SUPABASE_SERVICE_ROLE_KEY && !env.SUPABASE_URL) {
      ctx.addIssue({
        code: 'custom',
        path: ['SUPABASE_URL'],
        message: 'SUPABASE_URL is required when SUPABASE_SERVICE_ROLE_KEY is set.',
      });
    }
  });

export type Env = z.infer<typeof envSchema>;

/**
 * Parses and validates process environment. Fails fast at boot with a list of
 * offending variable NAMES only — values are never echoed, as they may be secrets.
 */
export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const result = envSchema.safeParse(source);
  if (!result.success) {
    const problems = result.error.issues
      .map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('\n');
    throw new Error(`Invalid API environment configuration:\n${problems}`);
  }
  return Object.freeze(result.data);
}
