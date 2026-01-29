import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface HistoryProductStateStore{
    historyProducts: string[];
    addHistoryProduct: (nameproduct: string) => void;
    clearHistoryProducts: () => void;
}

export const useHistoryProductStore = create<HistoryProductStateStore>()(
  persist(
    (set) => ({
      historyProducts: [],
      addHistoryProduct: (nameproduct: string) =>
        set((state) => {
          const updatedHistory = [
            nameproduct,
            ...state.historyProducts.filter(item => item !== nameproduct),
          ]
          return { historyProducts: updatedHistory.slice(0, 10) }
        }),
      clearHistoryProducts: () => set({ historyProducts: [] }),
    }),
    {
      name: 'history-product-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

