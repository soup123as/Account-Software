import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import { findDisallowedPublicEnvKeys } from './config/public-env';

const repoRoot = fileURLToPath(new URL('../..', import.meta.url));

/** Fails dev server start-up and builds if a non-allowlisted VITE_ variable is defined. */
function publicEnvGuard(): Plugin {
  return {
    name: 'gap:public-env-guard',
    config(_, { mode }) {
      const env = { ...loadEnv(mode, repoRoot, 'VITE_'), ...pickViteKeys(process.env) };
      const disallowed = findDisallowedPublicEnvKeys(env);
      if (disallowed.length > 0) {
        throw new Error(
          `Refusing to expose non-allowlisted variables to the browser: ${disallowed.join(', ')}. ` +
            'Server secrets must never use the VITE_ prefix (see apps/web/config/public-env.ts).',
        );
      }
    },
  };
}

function pickViteKeys(env: NodeJS.ProcessEnv): Record<string, string> {
  return Object.fromEntries(
    Object.entries(env).filter(
      (entry): entry is [string, string] => entry[0].startsWith('VITE_') && entry[1] !== undefined,
    ),
  );
}

export default defineConfig({
  envDir: repoRoot,
  plugins: [publicEnvGuard(), react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: { port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true },
  build: {
    sourcemap: true,
    target: 'es2022',
    rollupOptions: {
      output: {
        // Long-lived vendor chunks cache across deployments of application code.
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          data: ['@tanstack/react-query', 'zod'],
          i18n: ['i18next', 'react-i18next'],
        },
      },
    },
  },
});
