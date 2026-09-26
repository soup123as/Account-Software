import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const rootEnvFile = fileURLToPath(new URL('../../.env', import.meta.url));
if (!process.env.CI && existsSync(rootEnvFile)) {
  process.loadEnvFile(rootEnvFile);
}

/** Integration suites fail loudly (never silently skip) when infrastructure is missing. */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} must be set to run integration tests (see README "Testing").`);
  }
  return value;
}
