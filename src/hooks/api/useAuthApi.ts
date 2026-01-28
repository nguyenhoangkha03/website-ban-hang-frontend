import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios'; // Đảm bảo đã import api chuẩn
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';
import { supabaseService } from '@/lib/supabase/supabaseService';
import { supabase } from '@/lib/supabase/supabase';
import { toast } from 'sonner';

// =============================================================================
// 1. Hook Login Zalo
// =============================================================================
export const useLoginZalo = () => {
    const { login } = useAuthStore();
    const router = useRouter();

    return useMutation({
        mutationFn: async (code: string) => {
            // ✅ Gọi API Login Zalo
            const res = await api.post('/cs/auth/login-zalo', { code });
            return res.data;
        },
        onSuccess: (data) => {
            if (data.success) {
                // data.data gồm: { customer, accessToken, requirePhoneCheck }
                const { customer, accessToken, requirePhoneCheck } = data.data;

                // Lưu vào Store
                login(customer, accessToken);
                
                toast.success('Đăng nhập Zalo thành công!');

                // Điều hướng dựa trên việc có cần cập nhật SĐT hay không
                if (requirePhoneCheck) {
                    router.push('/profile?action=update_info'); // Sang trang Profile để nhập SĐT
                } else {
                    router.push('/'); // Về trang chủ
                }
            }
        },
        onError: (error: any) => {
            const msg = error?.response?.data?.message || 'Lỗi đăng nhập Zalo';
            toast.error(msg);
            router.push('/login'); // Quay về login nếu lỗi
        }
    });
};

// =============================================================================
// 2. Hook Social Login (Google/Facebook)
// =============================================================================
// Bước 1: Trigger login popup của Supabase
export const useSocialLogin = () => {
  return useMutation({
    mutationFn: async (provider: 'google' | 'facebook') => {
      return await supabaseService.loginSocial(provider);
    },
    onError: (error: any) => {
        toast.error(`Lỗi kết nối mạng xã hội: ${error.message}`);
    }
  });
};

// Bước 2: Đồng bộ xuống Backend (Dùng ở component lắng nghe auth state change)
export const useSyncSocialAccount = () => {
  const { login } = useAuthStore();
  
  return useMutation({
    mutationFn: async (payload: any) => {
      // ✅ Gọi API Backend: /cs/auth/social-login
      const res = await api.post('/cs/auth/social-login', payload);
      return res.data;
    },
    onSuccess: (res) => {
      const { customer, accessToken, requirePhoneCheck } = res.data;
      
      if (customer && accessToken) {
        login(customer, accessToken);
        toast.success("Đăng nhập thành công!");
        
        if (requirePhoneCheck) {
             window.location.href = '/profile?action=update_info';
        } else {
             window.location.href = '/';
        }
      }
    },
    onError: (error: any) => {
        console.error("❌ Lỗi đồng bộ Social:", error);
        supabase.auth.signOut(); // Đăng xuất Supabase để tránh kẹt
        const msg = error?.response?.data?.message || "Đăng nhập thất bại";
        toast.error(msg);
    }
  });
};

// =============================================================================
// 3. Hook Cập nhật Profile (Quan trọng nhất bây giờ)
// =============================================================================
export const useUpdateProfile = () => {
    const { setUser } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { customerName?: string; phone: string; cccd: string; address?: string; email?: any }) => {
            // ✅ Gọi API: PUT /cs/customers/profile
            const res = await api.put('/cs/customers/profile', data);
            return res.data;
        },
        onSuccess: (res) => {
            if (res.success) {
                toast.success('Cập nhật hồ sơ thành công!');
                
                // Cập nhật lại store
                setUser(res.data);
                
                // Refresh lại dữ liệu đang hiển thị (nếu có dùng useQuery)
                queryClient.invalidateQueries({ queryKey: ['profile'] });
            }
        },
        onError: (error: any) => {
            const msg = error?.response?.data?.message || 'Lỗi cập nhật hồ sơ';
            toast.error(msg);
        }
    });
};

// =============================================================================
// 4. Hook Lấy Profile (Dùng useQuery để fetch data)
// =============================================================================
export const useGetProfile = () => {
    return useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const res = await api.get('/cs/customers/profile');
            return res.data?.data;
        },
        staleTime: 5 * 60 * 1000, // Cache 5 phút
        retry: 1
    });
};

// =============================================================================
// 5. Hook Đăng xuất
// =============================================================================
export const useLogout = () => {
    const { logout } = useAuthStore();
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async () => {
        try {
            // 1. Gọi Backend Logout
            await api.post('/cs/auth/logout');
        } catch (error) {
            console.error("API Logout Error (Ignored):", error);
        }
        
        try {
            // 2. Logout Supabase
            await supabase.auth.signOut();
        } catch (error) {
             console.error("Supabase SignOut Error (Ignored):", error);
        }
      },
      onSettled: () => {
        // 3. Dọn dẹp sạch sẽ
        console.log("🧹 Cleaning up client session...");
        logout(); 
        queryClient.clear();
        localStorage.removeItem('auth-storage');
        window.location.href = '/login';
      }
    });
};