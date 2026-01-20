import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { Product } from '@/types'; // Use the canonical Product type

// Define the shape of the filters
interface ProductFilters {
  sortBy?: string;
  category?: string[] | undefined;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  supplierId?: string;
}

// The function that will fetch the data from the API, now with filtering capabilities
const fetchProducts = async (filters: ProductFilters): Promise<Product[]> => {
  // Use `params` option in Axios to automatically handle query string for a cleaner implementation
  const response = await axiosInstance.get('/products', {
    params: filters,
  });
  return response.data.data;
};

// The custom hook that uses useQuery, now accepting filters
export const useProducts = (filters: ProductFilters = {}) => {
  return useQuery<Product[], Error>({
    // The query key now includes the filters object to ensure queries are refetched when filters change
    queryKey: ['products', filters],
    // The query function now passes the filters to the fetch function
    queryFn: () => fetchProducts(filters),
  });
};

const fetchProductById = async (id: string): Promise<Product> => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data.data;
};

export const useProductById = (id: string) => {
    return useQuery<Product, Error>({
        queryKey: ['product', id],
        queryFn: () => fetchProductById(id),
        enabled: !!id, // Only run the query if the id is not null/undefined
    });
};
