import { readFileSync } from 'node:fs';

interface PackageJson {
  readonly name: string;
  readonly version: string;
}

// Resolves to apps/api/package.json from both src/ (tests) and dist/ (runtime).
const pkg = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
) as PackageJson;

export const APP_INFO = Object.freeze({ service: pkg.name, version: pkg.version });
