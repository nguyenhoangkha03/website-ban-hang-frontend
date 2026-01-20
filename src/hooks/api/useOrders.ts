import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { Order, OrderItem } from '@/types/order'; // Import new types

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

// API Function
const fetchOrders = async (): Promise<Order[]> => {
    if (USE_MOCK_API) {
        // TODO: Update mockGetOrders to match new Order type, or remove if mock not needed
        return []; 
    }
    const response = await axiosInstance.get('/sales-orders', { withCredentials: true });
    // Assuming the backend returns an array of SalesOrder, which directly maps to our new Order type
    // Ensure the backend includes nested product data if needed for OrderItem
    return response.data.data;
};

// React Query Hook
export const useOrders = () => {
    return useQuery<Order[], Error>({
        queryKey: ['orders'],
        queryFn: fetchOrders,
    });
};

// We could also add hooks for fetching a single order, creating an order, etc.
const fetchOrderById = async (id: string): Promise<Order> => {
    const response = await axiosInstance.get(`/sales-orders/${id}`, { withCredentials: true }); // Corrected endpoint
    return response.data.data;
};

export const useOrderById = (id: string) => {
     return useQuery<Order, Error>({
        queryKey: ['order', id],
        queryFn: () => fetchOrderById(id),
        enabled: !!id,
     });
};