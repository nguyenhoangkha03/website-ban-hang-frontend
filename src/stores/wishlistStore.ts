
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/types';

interface WishlistState {
  items: Product[];
  addItem: (item: Product) => void;
  removeItem: (id: number) => void;
  isInWishlist: (id: number) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const { items } = get();
        const existingItem = items.find((i) => i.id === item.id);
        if (!existingItem) {
          const updatedItems = [...items, item];
          set({ items: updatedItems });
        }
      },
      removeItem: (id) => {
        const { items } = get();
        const updatedItems = items.filter((i) => i.id !== id);
        set({ items: updatedItems });
      },
      isInWishlist: (id) => {
        const { items } = get();
        return items.some((i) => i.id === id);
      },
    }),
    {
      name: 'wishlist-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
