import { useQuery } from '@tanstack/react-query';
import type { LivenessReport } from '@gap/shared';
import { apiRequest } from '@/lib/api-client';

export const healthQueryKey = ['system', 'health'] as const;

export function useApiHealth() {
  return useQuery({
    queryKey: healthQueryKey,
    queryFn: ({ signal }) => apiRequest<LivenessReport>('/health', { signal }),
    retry: false,
  });
}
