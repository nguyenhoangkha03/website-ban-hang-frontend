import { useQuery, keepPreviousData } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { 
  StoreProductParams, 
  ProductListResponse, 
  ProductDetailResponse 
} from '@/types/cs-products.type';
import { useHistoryProductStore } from '@/stores/useHistoryProduct';

export function useProducts(filter: StoreProductParams) {
  const historySearch = useHistoryProductStore(state => state.historyProducts);
  return useQuery({
    queryKey: ['cs-products', filter],
    queryFn: async () => {
      const response = await api.get<ProductListResponse>("/cs/products",{ params: { ...filter, historySearch } });
      return response.data;
    }
  })
}

export function useProductDetail(productSlug: string, enabled = true) {
  return useQuery({
    queryKey: ['cs-product', productSlug],
    queryFn: async () => {
      const response = await api.get<ProductDetailResponse>(`/cs/products/${productSlug}`);
      return response.data;
    },
    enabled: enabled && !!productSlug,
  })
}

