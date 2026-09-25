import { describe, expect, it } from 'vitest';
import { findDisallowedPublicEnvKeys } from './public-env';

describe('findDisallowedPublicEnvKeys', () => {
  it('allows only the reviewed public keys', () => {
    expect(
      findDisallowedPublicEnvKeys({
        VITE_APP_NAME: 'x',
        VITE_API_URL: 'x',
        VITE_SUPABASE_URL: 'x',
        VITE_SUPABASE_ANON_KEY: 'x',
        DATABASE_URL: 'server-only, not prefixed',
      }),
    ).toEqual([]);
  });

  it.each([
    'VITE_DATABASE_URL',
    'VITE_SUPABASE_SERVICE_ROLE_KEY',
    'VITE_SESSION_SECRET',
    'VITE_ENCRYPTION_KEY',
    'VITE_PRIVATE_API_KEY',
    'VITE_ANYTHING_NEW',
  ])('rejects %s', (key) => {
    expect(findDisallowedPublicEnvKeys({ [key]: 'value' })).toEqual([key]);
  });
});
