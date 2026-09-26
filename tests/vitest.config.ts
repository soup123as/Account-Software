import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Integration suites share one database and Redis; run files sequentially.
    fileParallelism: false,
    projects: [
      {
        test: {
          name: 'integration',
          include: ['integration/**/*.test.ts'],
          environment: 'node',
          testTimeout: 30_000,
          hookTimeout: 30_000,
        },
      },
      {
        test: {
          name: 'security',
          include: ['security/**/*.test.ts'],
          environment: 'node',
        },
      },
    ],
  },
});
