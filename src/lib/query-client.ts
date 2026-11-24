import { QueryClient } from '@tanstack/react-query';

/**
 * Default QueryClient configuration for server state management.
 * Prevents excessive refetching and provides sensible defaults.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
