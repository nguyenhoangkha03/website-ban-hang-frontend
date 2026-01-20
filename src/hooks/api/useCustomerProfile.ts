import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CustomerProfile, UpdateCustomerRequest } from '@/types';
import axiosInstance from '@/lib/axios';

// API Functions
const fetchCustomerProfile = async (): Promise<CustomerProfile> => {
    const response = await axiosInstance.get('/accounts/profile');
    return response.data.data;
};

const updateCustomerProfile = async (profileData: Partial<UpdateCustomerRequest>): Promise<CustomerProfile> => {
    const response = await axiosInstance.put('/accounts/profile', profileData);
    return response.data.data;
};

// React Query Hooks
export const useCustomerProfile = () => {
    return useQuery<CustomerProfile, Error>({
        queryKey: ['customerProfile'],
        queryFn: fetchCustomerProfile,
    });
};

export const useUpdateCustomerProfile = () => {
    const queryClient = useQueryClient();

    return useMutation<CustomerProfile, Error, Partial<UpdateCustomerRequest>>({
        mutationFn: updateCustomerProfile,
        onSuccess: (data) => {
            queryClient.setQueryData(['customerProfile'], data);
        },
    });
};
