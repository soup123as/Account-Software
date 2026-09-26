import { z } from 'zod';

const emptyToUndefined = (value: unknown) =>
  typeof value === 'string' && value.trim() === '' ? undefined : value;

const publicEnvSchema = z.object({
  VITE_APP_NAME: z.preprocess(emptyToUndefined, z.string().default('Global Accounting Platform')),
  VITE_API_URL: z.preprocess(emptyToUndefined, z.url().default('http://localhost:3000/api/v1')),
  VITE_SUPABASE_URL: z.preprocess(emptyToUndefined, z.url().optional()),
  VITE_SUPABASE_ANON_KEY: z.preprocess(emptyToUndefined, z.string().optional()),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;

export function parsePublicEnv(source: Record<string, unknown>): PublicEnv {
  return publicEnvSchema.parse(source);
}

/** Browser-safe configuration. Contains only values that are public by design. */
export const env: PublicEnv = parsePublicEnv(import.meta.env);
