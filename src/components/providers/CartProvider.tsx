'use client';

import { useEffect } from 'react';
import { useGetCart } from '@/hooks/api/useCartApi';
import { useCartStore } from '@/stores/cartStore';
import { useAuth } from '@/hooks/useAuth';

// This component fetches the cart data and syncs it with the Zustand store.
// It should wrap the main application layout.
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  // The query will now automatically refetch when `isAuthenticated` changes from `false` to `true`.
  const { data: cartData } = useGetCart({ enabled: isAuthenticated });
  const { setServerCart, clearCart } = useCartStore();

  useEffect(() => {
    // If the user is authenticated and cart data is available, update the store.
    if (isAuthenticated && cartData) {
      setServerCart(cartData);
    } else if (!isAuthenticated) {
      // If the user is not authenticated, ensure the cart is cleared.
      clearCart();
    }
  }, [isAuthenticated, cartData, setServerCart, clearCart]);
  
  // This provider is silent and doesn't render any UI.
  // Components will react to changes in the `useCartStore`.
  return <>{children}</>;
};
