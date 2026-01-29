import { useQuery, keepPreviousData } from '@tanstack/react-query';
import axios from 'axios';
import type {
  CategoryQueryParams,
  CategoryListResponse,
  CategoryTreeResponse,
  CategoryDetailResponse
} from '@/types/cs-category.type';
import api from '@/lib/axios';
export const useCsCategories = (filter?: CategoryQueryParams) => {
  return useQuery({
    queryKey: ['cs-categories', filter],
    queryFn: async () => {
      const { data } = await api.get<CategoryListResponse>("/cs/categories", { 
        params: {
          ...filter,
          search: filter?.search || undefined, 
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
// export const useCsCategoryTree = () => {
//   return useQuery({
//     queryKey: ['cs-categories-tree'], // Key cố định vì cây danh mục không có params phân trang
    
//     queryFn: async () => {
//       const { data } = await axios.get<CategoryTreeResponse>(`${API_URL}/tree`);
//       return data.data; // Trả về mảng cây (PublicCategoryTree[])
//     },

//     // Cache lâu hơn (30 phút) vì cấu trúc Menu rất ổn định
//     staleTime: 30 * 60 * 1000, 
    
//     // Không fetch lại khi focus cửa sổ (tránh spam API không cần thiết)
//     refetchOnWindowFocus: false,
//   });
// };

// // ==========================================
// // 3. Hook lấy chi tiết 1 danh mục (Dùng cho trang danh sách sản phẩm theo danh mục)
// // ==========================================
// export const useCsCategoryDetail = (id: number) => {
//   return useQuery({
//     queryKey: ['cs-category-detail', id],
    
//     queryFn: async () => {
//       const { data } = await axios.get<CategoryDetailResponse>(`${API_URL}/${id}`);
//       return data.data;
//     },

//     // Chỉ chạy query khi có ID hợp lệ (tránh lỗi gọi API với id=0 hoặc null)
//     enabled: !!id && !isNaN(id),
    
//     staleTime: 10 * 60 * 1000,
//   });
// };