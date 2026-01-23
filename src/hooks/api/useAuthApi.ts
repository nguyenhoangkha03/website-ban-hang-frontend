import { useMutation, useQuery } from '@tanstack/react-query';
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
    const router = useRouter();
    const { logout } = useAuthStore();
  
    return useMutation({
      mutationFn: async () => {
        // 1. Gọi Backend Logout (Xóa HttpOnly Cookie)
        await api.post('/cs/accounts/logout');
        
        // 2. ✅ QUAN TRỌNG: Logout cả Supabase để xóa session dính ở trình duyệt
        await supabase.auth.signOut();
      },
      onSuccess: () => {
        logout(); // Xóa RAM Store
        router.push('/login');
        router.refresh(); // Refresh để clear cache của Next.js
      },
      onError: async () => {
         // Kể cả API lỗi, vẫn phải clear client state
         await supabase.auth.signOut();
         logout();
         router.push('/login');
      }
    });
};
