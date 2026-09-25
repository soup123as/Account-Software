import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '@/app/layouts/AppShell';

/**
 * Route modules are lazy-loaded so each feature is code-split. Authenticated
 * route guards are introduced in Phase 1.
 */
export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import('@/features/system-status/SystemStatusPage')).SystemStatusPage,
        }),
      },
      {
        path: '*',
        lazy: async () => ({ Component: (await import('@/app/router/NotFoundPage')).NotFoundPage }),
      },
    ],
  },
]);
