import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { findDisallowedPublicEnvKeys, PUBLIC_ENV_KEYS } from '../../apps/web/config/public-env.ts';

const repoRoot = fileURLToPath(new URL('../..', import.meta.url));
const trackedFiles = execFileSync(
  'git',
  ['ls-files', '--cached', '--others', '--exclude-standard'],
  {
    cwd: repoRoot,
    encoding: 'utf8',
  },
)
  .split('\n')
  .filter(Boolean);

const read = (file: string) => readFileSync(`${repoRoot}/${file}`, 'utf8');

/** Source/config files that end up in builds or runtime configuration (docs excluded). */
const codeFiles = trackedFiles.filter(
  (file) =>
    /\.(ts|tsx|js|mjs|cjs|json|ya?ml|html|toml)$|(^|\/)\.env\.example$|Dockerfile$/.test(file) &&
    !file.startsWith('tests/security/') &&
    !file.endsWith('pnpm-lock.yaml') &&
    !file.endsWith('public-env.test.ts'),
);

describe('secrets never reach the repository', () => {
  it('does not track any .env file other than .env.example', () => {
    const envFiles = trackedFiles.filter((file) => /(^|\/)\.env(\..+)?$/.test(file));
    expect(envFiles).toEqual(['.env.example']);
  });

  it('ignores .env files in git', () => {
    const ignored = execFileSync(
      'git',
      ['check-ignore', '.env', 'apps/api/.env', '.env.production'],
      {
        cwd: repoRoot,
        encoding: 'utf8',
      },
    );
    expect(ignored.trim().split('\n')).toHaveLength(3);
  });

  it('ships .env.example with every secret left blank', () => {
    const secretKeys =
      /(SECRET|PASSWORD|SERVICE_ROLE|API_KEY|ENCRYPTION_KEY|_DSN|DATABASE_URL|ANON_KEY)$/;
    const offenders = read('.env.example')
      .split('\n')
      .filter((line) => /^[A-Z0-9_]+=/.test(line))
      .map((line) => line.split('=', 2) as [string, string])
      .filter(([key, value]) => secretKeys.test(key) && value.trim() !== '');
    expect(offenders).toEqual([]);
  });

  it.each([
    ['private keys', /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/],
    [
      'JWTs (e.g. Supabase keys)',
      /eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/,
    ],
    ['live payment keys', /\b(sk|rk)_live_[A-Za-z0-9]{10,}/],
    ['Resend API keys', /\bre_[A-Za-z0-9]{20,}/],
    [
      'database URLs with passwords',
      /postgres(ql)?:\/\/[^:\s/]+:[^@\s]{6,}@(?!localhost|127\.0\.0\.1|postgres[:/])/,
    ],
  ])('contains no hard-coded %s', (_, pattern) => {
    const offenders = codeFiles.filter((file) => pattern.test(read(file)));
    expect(offenders).toEqual([]);
  });
});

describe('browser bundle exposure', () => {
  it('only uses allowlisted VITE_ variables anywhere in code or config', () => {
    const used = new Set<string>();
    for (const file of codeFiles) {
      for (const match of read(file).matchAll(/\bVITE_[A-Z0-9_]+/g)) {
        used.add(match[0]);
      }
    }
    expect(
      findDisallowedPublicEnvKeys(Object.fromEntries([...used].map((key) => [key, '']))),
    ).toEqual([]);
  });

  it('declares every allowlisted public variable in .env.example', () => {
    const example = read('.env.example');
    for (const key of PUBLIC_ENV_KEYS) {
      expect(example).toMatch(new RegExp(`^${key}=`, 'm'));
    }
  });

  it('never references server-only secrets from web source', () => {
    const webSource = codeFiles.filter((file) => file.startsWith('apps/web/src/'));
    expect(webSource.length).toBeGreaterThan(0);
    const serverOnly =
      /\b(SUPABASE_SERVICE_ROLE_KEY|DATABASE_URL|DIRECT_DATABASE_URL|SESSION_SECRET|ENCRYPTION_KEY|INTERNAL_API_KEY|WEBHOOK_SECRET|SMTP_PASSWORD|RESEND_API_KEY|REDIS_PASSWORD)\b/;
    expect(webSource.filter((file) => serverOnly.test(read(file)))).toEqual([]);
  });

  it('does not let the web app import server-side workspaces', () => {
    const webPackage = JSON.parse(read('apps/web/package.json')) as {
      dependencies: Record<string, string>;
    };
    const forbidden = [
      '@gap/database',
      '@gap/logger',
      '@prisma/client',
      'pino',
      'ioredis',
      'bullmq',
    ];
    expect(Object.keys(webPackage.dependencies).filter((dep) => forbidden.includes(dep))).toEqual(
      [],
    );
  });
});

describe('financial data types', () => {
  it('never declares Float columns in the Prisma schema', () => {
    const schema = read('packages/database/prisma/schema.prisma').replace(/\/\/.*$/gm, '');
    expect(schema).not.toMatch(/\bFloat\b/);
  });
});
