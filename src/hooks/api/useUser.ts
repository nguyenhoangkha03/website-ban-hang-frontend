import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios'; // ✅ Dùng instance 'api' mới
import { UserProfile, UpdateProfileType } from '@/lib/validations/user.validation'; // ✅ Import đúng file validation
import { useAuthStore } from '@/stores/useAuthStore'; // ✅ Import store để check token

// Key quản lý Cache
export const userKeys = {
  profile: ['user-profile'] as const,
};

// 1. Hook Lấy thông tin Profile
export const useUserProfile = () => {
  // Lấy accessToken từ Store để kiểm tra
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: userKeys.profile,
    queryFn: async () => {
      // Gọi API: GET /customer/account/profile
      const res = await api.get('/customer/account/profile');
      return res.data.data as UserProfile;
    },
    // ✅ QUAN TRỌNG: Chỉ fetch khi đã đăng nhập (có token)
    enabled: !!accessToken, 
    // Cache 5 phút
    staleTime: 1000 * 60 * 5, 
    // Không tự fetch lại khi click sang tab khác (đỡ tốn request)
    refetchOnWindowFocus: false,
  });
};

// 2. Hook Cập nhật Profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  // Lấy hàm login để update ngược lại vào Store (RAM)
  const { login, accessToken } = useAuthStore(); 

  return useMutation({
    mutationFn: async (data: UpdateProfileType) => {
      // Gọi API: PUT /customer/account/profile
      const res = await api.put('/customer/account/profile', data);
      return res.data;
    },
    onSuccess: (response) => {
      // 1. Làm mới Cache của React Query
      queryClient.invalidateQueries({ queryKey: userKeys.profile });
      
      // 2. ✅ Cập nhật ngay vào Store (Zustand) để Header đổi tên/avatar liền
      // Backend thường trả về data user mới nhất trong response.data
      if (response.data && accessToken) {
         login(response.data, accessToken);
      }

      alert('✅ Cập nhật hồ sơ thành công!');
    },
    onError: (err: any) => {
      console.error(err);
      const msg = err?.response?.data?.message || err.message || 'Có lỗi xảy ra';
      alert('❌ ' + msg);
    }
  });
};