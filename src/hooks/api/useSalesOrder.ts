import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';


// Type for the payload to be sent to the backend
interface CreateOrderPayload {
  customerId: number;
  paymentMethod: 'cash' | 'transfer' | 'credit';
  shippingFee: number;
  notes?: string;
  items: {
    productId: number;
    quantity: number;
    unitPrice: number;
  }[];
}

// API function to create a sales order
const createSalesOrder = async (payload: CreateOrderPayload) => {
  const response = await axiosInstance.post('/sales-orders', payload);
  return response.data;
};

// React Query mutation hook for creating a sales order
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSalesOrder,
    onSuccess: () => {
      // Invalidate and refetch orders query after a new order is created
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
