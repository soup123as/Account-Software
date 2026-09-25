import { QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import i18n from '@/lib/i18n';
import { createQueryClient } from './query-client';

export function AppProviders({ children }: { readonly children: ReactNode }) {
  const [queryClient] = useState(createQueryClient);
  return (
    <I18nextProvider i18n={i18n}>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </ErrorBoundary>
    </I18nextProvider>
  );
}
