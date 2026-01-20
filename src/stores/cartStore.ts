import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartAPI, CartItemAPI } from '@/hooks/api/useCartApi';
import { Product } from '@/types';

interface CartState {
  serverCart: CartAPI | null;
  clientCart: CartItemAPI[];
  setServerCart: (cart: CartAPI | null) => void;
  addItemToClientCart: (product: Product, quantity: number) => void;
  updateClientCartItem: (productId: number, quantity: number) => void;
  removeClientCartItem: (productId: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      serverCart: null,
      clientCart: [],
      setServerCart: (cart) => set({ serverCart: cart }),
      addItemToClientCart: (product, quantity) => {
        const { clientCart } = get();
        const existingItem = clientCart.find((item) => item.productId === product.id);

        if (existingItem) {
          const updatedCart = clientCart.map((item) =>
            item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item
          );
          set({ clientCart: updatedCart });
        } else {
          const newItem: CartItemAPI = {
            id: Date.now(), // Temporary ID
            productId: product.id,
            quantity,
            product,
          };
          set({ clientCart: [...clientCart, newItem] });
        }
      },
      updateClientCartItem: (productId, quantity) => {
        const { clientCart } = get();
        const updatedCart = clientCart.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        );
        set({ clientCart: updatedCart });
      },
      removeClientCartItem: (productId) => {
        const { clientCart } = get();
        const updatedCart = clientCart.filter((item) => item.productId !== productId);
        set({ clientCart: updatedCart });
      },
      clearCart: () => set({ clientCart: [], serverCart: null }),
    }),
    {
      name: 'cart-storage', // name of the item in the storage (must be unique)
      partialize: (state) => ({ clientCart: state.clientCart }), // only persist the clientCart
    }
  )
);

export const useCartItems = (): CartItemAPI[] => {
  const { serverCart, clientCart } = useCartStore();
  const isAuthenticated = !!serverCart;

  return isAuthenticated ? serverCart?.items || [] : clientCart;
};

export const useCartTotals = () => {
  const items = useCartItems();
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + (item.product.sellingPriceRetail || 0) * item.quantity, 0);
  return { totalItems, totalPrice };
};
