import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { http } from '@/lib/http';
import { UserProfile, UpdateProfileType } from '@/lib/validations/user';

// 1. Hook Lấy thông tin Profile
export const useUserProfile = () => {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      // Gọi vào endpoint CS Customer
      const res = await http.get('/cs/customers/profile');
      return res.data.data as UserProfile;
    },
    staleTime: 1000 * 60 * 5, // Cache trong 5 phút
  });
};

// 2. Hook Cập nhật Profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileType) => {
      const res = await http.put('/cs/customers/profile', data);
      return res.data;
    },
    onSuccess: () => {
      // Cập nhật xong thì làm mới cache để hiển thị dữ liệu mới nhất
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      alert('✅ Cập nhật hồ sơ thành công!');
    },
    onError: (err: any) => {
      alert('❌ Có lỗi xảy ra: ' + (err?.response?.data?.message || err.message));
    }
  });
};