import { useQuery } from '@tanstack/react-query';
import { ShippingProvider } from '@/types/shipping';
import axiosInstance from '@/lib/axios'; // Import axiosInstance

const fetchShippingOptions = async (): Promise<ShippingProvider[]> => {
  const response = await axiosInstance.get('/shipping-options'); // Call the backend API
  return response.data.data;
};

export const useShippingOptions = () => {
  return useQuery<ShippingProvider[], Error>({
    queryKey: ['shippingOptions'],
    queryFn: fetchShippingOptions,
  });
};
