import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { Product } from '@/types'; // Assuming full Product type is needed
import { toast } from 'sonner';
import { useCartStore } from '@/stores/cartStore';
import {
  mockGetCart,
  mockAddItemToCart,
  mockUpdateCartItem,
  mockRemoveCartItem,
} from '@/lib/mock-api';

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

// Define the shape of the cart data returned from the backend
export interface CartItemAPI {
  id: number;
  productId: number;
  quantity: number;
  product: Product;
}

export interface CartAPI {
  id: number;
  userId: number;
  items: CartItemAPI[];
}

// API Functions
const getCart = async (): Promise<CartAPI> => {
  if (USE_MOCK_API) {
    return mockGetCart();
  }
  const response = await axiosInstance.get('/cart');
  return response.data.data;
};

const addItem = async ({ productId, quantity }: { productId: number; quantity: number }): Promise<CartAPI> => {
  if (USE_MOCK_API) {
    return mockAddItemToCart({ productId, quantity });
  }
  const response = await axiosInstance.post('/cart/items', { productId, quantity });
  return response.data.data;
};

const updateItem = async ({ itemId, quantity }: { itemId: number; quantity: number }): Promise<CartAPI> => {
  if (USE_MOCK_API) {
    return mockUpdateCartItem({ itemId, quantity });
  }
  const response = await axiosInstance.put(`/cart/items/${itemId}`, { quantity });
  return response.data.data;
};

const removeItem = async (itemId: number): Promise<CartAPI> => {
  if (USE_MOCK_API) {
    return mockRemoveCartItem(itemId);
  }
  const response = await axiosInstance.delete(`/cart/items/${itemId}`);
  return response.data.data;
};


// React Query Hooks
export const useGetCart = (options?: Omit<UseQueryOptions<CartAPI, Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery<CartAPI, Error>({
    queryKey: ['cart'],
    queryFn: getCart,
    staleTime: 300000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    ...options,
  });
};

export const useAddItemToCart = () => {
  const queryClient = useQueryClient();
  const { setServerCart } = useCartStore();
  return useMutation({
    mutationFn: addItem,
    onSuccess: (data) => {
      console.log('Data from server on add item:', data);
      queryClient.setQueryData(['cart'], data);
      setServerCart(data);
      toast.success('Thêm vào giỏ hàng thành công!');
    },
    onError: (error) => {
      console.error('Error adding item to cart:', error);
      toast.error('Thêm vào giỏ hàng thất bại, vui lòng thử lại!');
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  const { setServerCart } = useCartStore();
  return useMutation({
    mutationFn: updateItem,
    onSuccess: (data) => {
      console.log('Data from server on update item:', data);
      queryClient.setQueryData(['cart'], data);
      setServerCart(data);
      toast.success('Cập nhật giỏ hàng thành công!');
    },
    onError: (error) => {
      console.error('Error updating cart item:', error);
      toast.error('Cập nhật giỏ hàng thất bại, vui lòng thử lại!');
    },
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  const { setServerCart } = useCartStore();
  return useMutation({
    mutationFn: removeItem,
    onSuccess: (data) => {
      console.log('Data from server on remove item:', data);
      queryClient.setQueryData(['cart'], data);
      setServerCart(data);
      toast.success('Xóa sản phẩm khỏi giỏ hàng thành công!');
    },
    onError: (error) => {
      console.error('Error removing cart item:', error);
      toast.error('Xóa sản phẩm thất bại, vui lòng thử lại!');
    },
  });
};

export const useSyncCart = () => {
  const { clientCart, clearCart, setServerCart } = useCartStore();
  const addItemMutation = useAddItemToCart();

  const syncCart = async () => {
    if (clientCart.length > 0) {
      let lastCartData: CartAPI | null = null;
      for (const item of clientCart) {
        try {
          const data = await addItemMutation.mutateAsync({ productId: item.productId, quantity: item.quantity });
          lastCartData = data;
        } catch (error) {
          console.error("Failed to sync item:", item, error);
        }
      }
      
      if (lastCartData) {
        setServerCart(lastCartData);
      }
      
      clearCart();
    }
  };

  return { syncCart };
};
