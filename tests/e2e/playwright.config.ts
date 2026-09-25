import { defineConfig, devices } from '@playwright/test';

const API_PORT = 3100;
const WEB_URL = 'http://localhost:4173';
const isCI = Boolean(process.env.CI);

/**
 * Runs against production builds: `pnpm build` must have been executed first.
 * The web bundle is built with VITE_API_URL pointing at API_PORT (see CI).
 */
export default defineConfig({
  testDir: '.',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: 0,
  reporter: isCI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: WEB_URL,
    trace: 'retain-on-failure',
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
      ? { launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } }
      : {}),
  },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } },
  ],
  webServer: [
    {
      command: 'node ../../apps/api/dist/main.js',
      url: `http://localhost:${String(API_PORT)}/api/v1/health`,
      reuseExistingServer: !isCI,
      timeout: 30_000,
      env: {
        NODE_ENV: 'test',
        PORT: String(API_PORT),
        APP_URL: WEB_URL,
        LOG_LEVEL: 'warn',
        DATABASE_URL: process.env.DATABASE_URL ?? 'postgresql://unused:unused@127.0.0.1:1/unused',
      },
    },
    {
      command: 'pnpm --filter @gap/web preview',
      url: WEB_URL,
      reuseExistingServer: !isCI,
      timeout: 30_000,
    },
  ],
});
