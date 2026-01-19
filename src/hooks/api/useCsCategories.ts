import { useQuery, keepPreviousData } from '@tanstack/react-query';
import axios from 'axios';
import type {
  CategoryQueryParams,
  CategoryListResponse,
  CategoryTreeResponse,
  CategoryDetailResponse
} from '@/types/cs-category.type';

// ⚠️ Đảm bảo URL này khớp với port Backend của bạn (thường là 5000)
const API_URL = 'http://localhost:5000/api/cs/categories';

// ==========================================
// 1. Hook lấy danh sách danh mục (Dạng phẳng - Có phân trang)
// ==========================================
export const useCsCategories = (params: CategoryQueryParams) => {
  return useQuery({
    // Cache Key: Bao gồm cả params, nếu params đổi (ví dụ next trang), query chạy lại
    queryKey: ['cs-categories', params],
    
    queryFn: async () => {
      const { data } = await axios.get<CategoryListResponse>(API_URL, { 
        params: {
          ...params,
          // Xử lý logic tìm kiếm: Nếu chuỗi rỗng thì bỏ qua để Backend không lọc sai
          search: params.search || undefined, 
        }
      });
      return data;
    },

    // Giữ dữ liệu cũ hiển thị trong khi đang tải trang mới (tránh nháy màn hình)
    placeholderData: keepPreviousData,
    
    // Cache trong 5 phút (Vì danh mục ít khi thay đổi liên tục)
    staleTime: 5 * 60 * 1000, 
  });
};

// ==========================================
// 2. Hook lấy Cây danh mục (Tree - Dùng cho Sidebar/Menu)
// ==========================================
export const useCsCategoryTree = () => {
  return useQuery({
    queryKey: ['cs-categories-tree'], // Key cố định vì cây danh mục không có params phân trang
    
    queryFn: async () => {
      const { data } = await axios.get<CategoryTreeResponse>(`${API_URL}/tree`);
      return data.data; // Trả về mảng cây (PublicCategoryTree[])
    },

    // Cache lâu hơn (30 phút) vì cấu trúc Menu rất ổn định
    staleTime: 30 * 60 * 1000, 
    
    // Không fetch lại khi focus cửa sổ (tránh spam API không cần thiết)
    refetchOnWindowFocus: false,
  });
};

// ==========================================
// 3. Hook lấy chi tiết 1 danh mục (Dùng cho trang danh sách sản phẩm theo danh mục)
// ==========================================
export const useCsCategoryDetail = (id: number) => {
  return useQuery({
    queryKey: ['cs-category-detail', id],
    
    queryFn: async () => {
      const { data } = await axios.get<CategoryDetailResponse>(`${API_URL}/${id}`);
      return data.data;
    },

    // Chỉ chạy query khi có ID hợp lệ (tránh lỗi gọi API với id=0 hoặc null)
    enabled: !!id && !isNaN(id),
    
    staleTime: 10 * 60 * 1000,
  });
};