import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from './env';

let client: SupabaseClient | null | undefined;

/**
 * Browser Supabase client using the PUBLIC anon key only. Row Level Security
 * is what protects data — the anon key is not a secret. Authentication flows
 * (sign-up, sign-in, session refresh) are implemented in Phase 1.
 *
 * Returns null when Supabase is not configured for this environment.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (client === undefined) {
    client =
      env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY
        ? createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, {
            auth: { persistSession: true, autoRefreshToken: true, flowType: 'pkce' },
          })
        : null;
  }
  return client;
}
