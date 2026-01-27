import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios'; // Import 'api' có interceptor
import { LoginFormType } from '@/lib/validations/auth.validation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';
import { supabaseService } from '@/lib/supabase/supabaseService';
import { supabase } from '@/lib/supabase/supabase';


// =============================================================================
// 1. Hook Kiểm tra SĐT (Bước 1 Đăng ký/Quên MK)
// =============================================================================
export const useCheckPhone = () => {
    return useMutation({
        mutationFn: async (phone: string) => {
            // ✅ ĐÚNG: /cs/accounts/check-phone
            const res = await api.post('/cs/accounts/check-phone', { phone });
            return res.data; 
        },
    });
};

// =============================================================================
// 2. Hook Đăng nhập bằng Mật khẩu
// =============================================================================
export const useLogin = () => {
    const { login } = useAuthStore(); 
    const router = useRouter();

    return useMutation({
        mutationFn: async (data: LoginFormType) => {
            // ✅ ĐÚNG: /cs/accounts/login
            const res = await api.post('/cs/accounts/login', data);
            return res.data;
        },
        onSuccess: (data) => {
            if (data.success) {
                // Backend trả: { success: true, data: { customer, tokens } }
                login(data.data.customer, data.data.tokens.accessToken);
                router.push('/');
            }
        },
        onError: (error: any) => {
            const msg = error?.response?.data?.message || 'Lỗi đăng nhập';
            alert(`Đăng nhập thất bại: ${msg}`);
        }
    });
};

// =============================================================================
// 3. Hook Gửi OTP (Supabase - Không đổi vì gọi bên thứ 3)
// =============================================================================
export const useSendOtp = () => {
    return useMutation({
        mutationFn: async (phone: string) => {
            return await supabaseService.sendOtp(phone);
        },
        onError: (error: any) => {
             alert(`Lỗi gửi OTP: ${error.message}`);
        }
    });
};

// =============================================================================
// 4. Hook Verify OTP & Đồng bộ tài khoản (Bước 2 Đăng ký/Login OTP)
// =============================================================================
export const useVerifyAndSync = () => {
    const router = useRouter();
    const { login } = useAuthStore(); 

    return useMutation({
        mutationFn: async ({ phone, otp, password }: { phone: string; otp: string; password?: string }) => {
            // 1. Verify với Supabase -> Lấy UID
            const { uid } = await supabaseService.verifyOtp(phone, otp);
            if (!uid) throw new Error("Mã OTP không đúng hoặc đã hết hạn");

            // 2. Sync Backend
            // ✅ ĐÚNG: /cs/accounts/sync-phone-account
            const res = await api.post('/cs/accounts/sync-phone-account', {
                uid,
                phone,
                password 
            });
            return res.data;
        },
        onSuccess: (data) => {
            if (data.success) {
                // Auto Login
                login(data.data.customer, data.data.tokens.accessToken);
                
                if (data.data.requirePasswordSet) {
                    router.push('/'); // Hoặc chuyển sang trang đặt pass nếu muốn
                } else {
                    router.push('/');
                }
            }
        },
        onError: (error: any) => {
            console.error("Sync error:", error);
            const msg = error?.response?.data?.message || error.message || 'Lỗi xác thực';
            alert(`Lỗi: ${msg}`);
        }
    });
};

// =============================================================================
// 5. Hook Social Login (Bước 1: Redirect Supabase - Không đổi)
// =============================================================================
export const useSocialLogin = () => {
  return useMutation({
    mutationFn: async (provider: 'google' | 'facebook') => {
      return await supabaseService.loginSocial(provider);
    },
    onError: (error: any) => {
        alert(`Lỗi kết nối mạng xã hội: ${error.message}`);
    }
  });
};

// =============================================================================
// 6. Hook Sync Social Account (Dùng trong SocialAuthListener)
// =============================================================================
export const useSyncSocialAccount = () => {
  const { login } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: any) => {
      // ✅ ĐÚNG: /cs/accounts/social-login
      const res = await api.post('/cs/accounts/social-login', payload);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        login(data.data.customer, data.data.tokens.accessToken);
        router.push('/');
      }
    },
    onError: (error: any) => {
        console.error("Social Sync Error:", error);
    }
  });
};

// =============================================================================
// 7. Hook Đặt mật khẩu
// =============================================================================
export const useSetPassword = () => {
  const router = useRouter();
  
  return useMutation({
    mutationFn: async (payload: { phone: string; uid: string; password: string }) => {
       // ✅ ĐÚNG: /cs/accounts/set-password
       const res = await api.post('/cs/accounts/set-password', payload);
       return res.data;
    },
    onSuccess: (data) => {
       if (data.success) {
          alert("Đặt mật khẩu thành công!");
          router.push('/login'); 
       }
    },
    onError: (error: any) => {
        const msg = error?.response?.data?.message || 'Lỗi đặt mật khẩu';
        alert(`Lỗi: ${msg}`);
    }
  });
};

// =============================================================================
// 8. Hook Đăng xuất
// =============================================================================
export const useLogout = () => {
    // Không dùng router.push, dùng window.location để force reload
    const { logout } = useAuthStore();
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async () => {
        // 1. Gọi Backend Logout (BẮT BUỘC LÀ POST)
        // Dùng try-catch để dù API lỗi thì các bước sau vẫn chạy
        try {
            await api.post('/cs/accounts/logout');
        } catch (error) {
            console.error("API Logout Error (Ignored):", error);
        }
        
        // 2. Logout Supabase (Quan trọng để không bị tự login lại)
        try {
            await supabase.auth.signOut();
        } catch (error) {
             console.error("Supabase SignOut Error (Ignored):", error);
        }
      },
      // Dùng onSettled: Chạy bất kể thành công hay thất bại
      onSettled: () => {
        console.log("🧹 Cleaning up client session...");
        
        // 3. Xóa Store Zustand
        logout(); 

        // 4. Xóa Cache React Query (để dữ liệu Profile cũ không hiện lại)
        queryClient.clear();

        // 5. Xóa thủ công LocalStorage cho chắc ăn 100%
        localStorage.removeItem('auth-storage');
        localStorage.removeItem('sb-vnvodtioquonmqghwusy-auth-token'); // Xóa token supabase (tùy chọn)

        // 6. Chuyển trang cứng về Login
        window.location.href = '/login';
      }
    });
};
