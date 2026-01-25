import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { UserProfile, UpdateProfileType } from '@/lib/validations/user.validation'; 
import { useAuthStore } from '@/stores/useAuthStore'; 

export const userKeys = {
  profile: ['user-profile'] as const,
};

// 1. Hook Lấy thông tin Profile
export const useUserProfile = () => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: userKeys.profile,
    queryFn: async () => {
      // ✅ ROUTE CHUẨN: /cs/customers/profile
      const res = await api.get('/cs/customers/profile');
      // 🔥 DEBUG LOG: Xem cấu trúc API trả về là gì
      // console.log("🔥 API Profile Response:", res.data);
      return res.data.data as UserProfile;
    },
    enabled: !!accessToken, 
    staleTime: 1000 * 60 * 5, 
    refetchOnWindowFocus: false,
  });
};

// 2. Hook Cập nhật Profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  // ✅ Dùng setUser thay vì login (để update state mà không cần touch vào token)
  const { setUser } = useAuthStore(); 

  return useMutation({
    mutationFn: async (data: UpdateProfileType) => {
      // ✅ ROUTE CHUẨN: /cs/customers/profile
      const res = await api.put('/cs/customers/profile', data);
      return res.data;
    },
    onSuccess: (response) => {
      // 1. Làm mới Cache React Query
      queryClient.invalidateQueries({ queryKey: userKeys.profile });
      
      // 2. Cập nhật Store Client ngay lập tức
      // response.data thường chứa object User mới nhất từ Backend
      if (response.data) {
         setUser(response.data); 
      }

      // alert('✅ Cập nhật hồ sơ thành công!');
    },
    // 
  });
};