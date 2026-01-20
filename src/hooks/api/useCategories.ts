import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { Category } from '@/types';

// API function
const fetchCategories = async (): Promise<Category[]> => {
  const response = await axiosInstance.get('/categories');
  return response.data.data;
};

// The query key for categories, can be used for invalidation
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters: string) => [...categoryKeys.lists(), { filters }] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: number) => [...categoryKeys.details(), id] as const,
}

/**
 * Custom hook to fetch categories using react-query.
 * It handles caching, refetching, and state management (isLoading, isError, data).
 * 
 * @returns The result of the useQuery hook.
 */
export const useCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: categoryKeys.lists(),
    queryFn: fetchCategories,
    // Optional: configuration for caching, refetching, etc.
    // staleTime: 5 * 60 * 1000, // 5 minutes
    // refetchOnWindowFocus: false,
  })
}
