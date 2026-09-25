import { QueryClient } from '@tanstack/react-query';
import { ApiRequestError } from '@/lib/api-client';

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        // Never retry client errors (validation, auth, permission): they will not succeed.
        retry: (failureCount, error) =>
          !(error instanceof ApiRequestError && error.status >= 400 && error.status < 500) &&
          failureCount < 2,
      },
      mutations: {
        // Financial mutations must never be retried automatically; idempotency keys arrive with payments.
        retry: false,
      },
    },
  });
}
