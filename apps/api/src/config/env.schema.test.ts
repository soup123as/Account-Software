import { describe, expect, it } from 'vitest';
import { loadEnv } from './env.schema.js';

const base = { DATABASE_URL: 'postgresql://user:pass@localhost:5432/db' };

describe('loadEnv', () => {
  it('applies safe defaults', () => {
    const env = loadEnv(base);
    expect(env).toMatchObject({
      NODE_ENV: 'development',
      PORT: 3000,
      API_PREFIX: 'api/v1',
      RATE_LIMIT_MAX_REQUESTS: 100,
    });
  });

  it('treats empty values as unset', () => {
    const env = loadEnv({ ...base, SUPABASE_URL: '', REDIS_URL: '  ' });
    expect(env.SUPABASE_URL).toBeUndefined();
    expect(env.REDIS_URL).toBeUndefined();
  });

  it('requires a PostgreSQL DATABASE_URL', () => {
    expect(() => loadEnv({})).toThrow(/DATABASE_URL/);
    expect(() => loadEnv({ DATABASE_URL: 'mysql://localhost/db' })).toThrow(/DATABASE_URL/);
  });

  it('never echoes secret values in errors', () => {
    const secret = 'super-secret-service-role-key';
    try {
      loadEnv({ ...base, SUPABASE_SERVICE_ROLE_KEY: secret });
      expect.unreachable();
    } catch (error) {
      expect((error as Error).message).toContain('SUPABASE_URL');
      expect((error as Error).message).not.toContain(secret);
    }
  });

  it('requires https APP_URL in production', () => {
    expect(() =>
      loadEnv({ ...base, NODE_ENV: 'production', APP_URL: 'http://example.com' }),
    ).toThrow(/https/);
    expect(
      loadEnv({ ...base, NODE_ENV: 'production', APP_URL: 'https://app.example.com' }).NODE_ENV,
    ).toBe('production');
  });

  it('returns a frozen object', () => {
    expect(Object.isFrozen(loadEnv(base))).toBe(true);
  });
});
