import 'reflect-metadata';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { APP_INFO } from './app-info.js';
import { createApp } from './bootstrap.js';
import { createLogger } from '@gap/logger';
import { loadEnv } from './config/env.schema.js';

// Local development convenience: load the repository-root .env if present.
// Deployed environments inject variables directly and never ship a .env file.
const rootEnvFile = fileURLToPath(new URL('../../../.env', import.meta.url));
if (process.env.NODE_ENV !== 'production' && existsSync(rootEnvFile)) {
  process.loadEnvFile(rootEnvFile);
}

async function main(): Promise<void> {
  const env = loadEnv();
  const logger = createLogger({ level: env.LOG_LEVEL, service: APP_INFO.service });
  const app = await createApp(env, logger);
  await app.listen(env.PORT);
  logger.info(
    { port: env.PORT, prefix: env.API_PREFIX, environment: env.NODE_ENV },
    'API listening',
  );
}

main().catch((error: unknown) => {
  // The structured logger may not exist yet (e.g. invalid env), so write directly.
  process.stderr.write(
    `API failed to start: ${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exit(1);
});
