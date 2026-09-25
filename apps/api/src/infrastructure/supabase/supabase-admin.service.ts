import { Inject, Injectable } from '@nestjs/common';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { APP_CONFIG } from '../../config/config.module.js';
import { type Env } from '../../config/env.schema.js';

/**
 * Server-side Supabase client using the SERVICE ROLE key.
 *
 * The service role bypasses RLS, so this client must only be used for
 * privileged platform operations (e.g. verifying sessions, admin user
 * management in Phase 1) — never to read tenant data on behalf of a user.
 * The key is read from server-only environment and never sent to browsers.
 */
@Injectable()
export class SupabaseAdminService {
  private client: SupabaseClient | null = null;

  constructor(@Inject(APP_CONFIG) private readonly env: Env) {}

  get isConfigured(): boolean {
    return Boolean(this.env.SUPABASE_URL && this.env.SUPABASE_SERVICE_ROLE_KEY);
  }

  getClient(): SupabaseClient {
    if (!this.env.SUPABASE_URL || !this.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase is not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).');
    }
    this.client ??= createClient(this.env.SUPABASE_URL, this.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
    return this.client;
  }
}
