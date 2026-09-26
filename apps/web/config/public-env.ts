/**
 * The ONLY environment variables that may be exposed to the browser bundle.
 *
 * Vite inlines every `VITE_*` variable into client JavaScript, where anyone
 * can read it. Server secrets (database URLs, service-role keys, session or
 * encryption secrets, private API keys) must never use the `VITE_` prefix.
 * Adding a key here is a security-reviewed change.
 */
export const PUBLIC_ENV_KEYS = [
  'VITE_APP_NAME',
  'VITE_API_URL',
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
] as const;

export type PublicEnvKey = (typeof PUBLIC_ENV_KEYS)[number];

/** Keys Vite itself derives (e.g. from NODE_ENV in .env files); not secrets. */
const FRAMEWORK_INTERNAL_KEYS = ['VITE_USER_NODE_ENV'] as const;

const allowed = new Set<string>([...PUBLIC_ENV_KEYS, ...FRAMEWORK_INTERNAL_KEYS]);

/** Returns every `VITE_*` key present in `env` that is not explicitly allowed. */
export function findDisallowedPublicEnvKeys(env: Record<string, unknown>): string[] {
  return Object.keys(env)
    .filter((key) => key.startsWith('VITE_') && !allowed.has(key))
    .sort();
}
