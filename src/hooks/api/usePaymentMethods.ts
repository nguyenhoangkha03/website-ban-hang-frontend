import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';

// This type should ideally be in a central types file
export interface PaymentMethod {
  id: number;
  userId: number;
  type: 'bank' | 'card';
  provider: string;
  accountNumber?: string | null;
  cardNumber?: string | null;
  isDefault: boolean;
}

// Type for the creation payload
export interface CreatePaymentMethodPayload {
  type: 'bank' | 'card';
  provider: string;
  accountNumber?: string;
  cardNumber?: string;
  isDefault?: boolean;
}


// API Functions
const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  const response = await axiosInstance.get('/user-payment-methods');
  return response.data.data;
};

const addPaymentMethod = async (payload: CreatePaymentMethodPayload): Promise<PaymentMethod> => {
  const response = await axiosInstance.post('/user-payment-methods', payload);
  return response.data.data;
};

const deletePaymentMethod = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/user-payment-methods/${id}`);
};


// React Query Hooks
export const useGetPaymentMethods = () => {
  return useQuery<PaymentMethod[], Error>({
    queryKey: ['paymentMethods'],
    queryFn: getPaymentMethods,
  });
};

export const useAddPaymentMethod = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addPaymentMethod,
    onSuccess: () => {
      // Invalidate and refetch the payment methods query
      queryClient.invalidateQueries({ queryKey: ['paymentMethods'] });
    },
  });
};

export const useDeletePaymentMethod = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePaymentMethod,
    onSuccess: () => {
      // Invalidate and refetch the payment methods query
      queryClient.invalidateQueries({ queryKey: ['paymentMethods'] });
    },
  });
};
