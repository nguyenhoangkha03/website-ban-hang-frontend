import { QueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 401 Unauthorized errors
        if (error instanceof AxiosError && error.response?.status === 401) {
          return false;
        }
        // Otherwise, retry up to 1 time
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

