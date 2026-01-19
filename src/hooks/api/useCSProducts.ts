import { useQuery, keepPreviousData } from '@tanstack/react-query';
import axios from 'axios';
import type { 
  StoreProductParams, 
  ProductListResponse, 
  ProductDetailResponse 
} from '@/types/cs-products.type';

// Cấu hình URL gốc
const API_URL = 'http://localhost:5000/api/cs/products';

// 👇 Helper: Lấy Token để gửi kèm request
// (Backend sẽ dựa vào token này để biết khách là Retail, Wholesale hay VIP)
const getAuthHeader = () => {
  if (typeof window === 'undefined') return {};
  
  // 👇 SỬA DÒNG NÀY: Đổi 'accessToken' thành 'ACCESS_TOKEN'
  const token = localStorage.getItem('ACCESS_TOKEN'); 

  console.log("Token from localStorage:", token); // Giờ chắc chắn sẽ log ra chuỗi token
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ==========================================
// 1. Hook lấy danh sách sản phẩm (Có phân trang, lọc & Đa giá)
// ==========================================
export const useStoreProducts = (params: StoreProductParams) => {
  return useQuery({
    // Cache key: Thêm token vào key (nếu cần) hoặc chỉ cần params
    // Nếu user logout/login, queryClient.invalidateQueries sẽ lo việc refresh
    queryKey: ['store-products', params],
    
    queryFn: async () => {
      const { data } = await axios.get<ProductListResponse>(API_URL, { 
        params: {
           ...params,
           // Convert boolean sang string nếu cần (để tránh lỗi query string)
           isFeatured: params.isFeatured?.toString(),
           
           // ⚠️ Lưu ý: Tuyệt đối KHÔNG truyền userType ở đây.
           // Backend sẽ tự giải mã từ Token.
        },
        // 👇 QUAN TRỌNG NHẤT: Gửi kèm Token
        headers: getAuthHeader(),
      });
      return data;
    },

    placeholderData: keepPreviousData, 
    staleTime: 60 * 1000, 
  });
};

// ==========================================
// 2. Hook lấy chi tiết 1 sản phẩm
// ==========================================
export const useStoreProductDetail = (id: number) => {
  return useQuery({
    queryKey: ['store-product-detail', id],
    
    queryFn: async () => {
      const { data } = await axios.get<ProductDetailResponse>(`${API_URL}/${id}`, {
        // 👇 QUAN TRỌNG: Cũng phải gửi Token ở đây để lấy đúng giá chi tiết
        headers: getAuthHeader(),
      });
      return data.data; 
    },

    enabled: !!id && id > 0,
    staleTime: 5 * 60 * 1000, 
  });
};