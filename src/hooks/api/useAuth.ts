import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios'; // ✅ Import 'api' từ file axios.ts mới
import { LoginFormType } from '@/lib/validations/auth.validation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';
import { supabaseService } from '@/lib/supabase/supabaseService';

// =============================================================================
// 1. Hook Kiểm tra SĐT (Bước 1 Đăng ký)
// =============================================================================
export const useCheckPhone = () => {
    return useMutation({
        mutationFn: async (phone: string) => {
            // POST /customer/auth/check-phone
            const res = await api.post('/customer/auth/check-phone', { phone });
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
            console.log('Calling login API:', data);
            // POST /customer/auth/login
            const res = await api.post('/customer/auth/login', data);
            return res.data;
        },
        onSuccess: (data) => {
            if (data.success) {
                // ✅ CHỈ LƯU VÀO STORE (RAM)
                // Backend trả về: { data: { customer, accessToken } }
                login(data.data.customer, data.data.accessToken);
                
                console.log("Đăng nhập thành công"); 
                router.push('/');
            }
        },
        onError: (error: any) => {
            console.error('Login error: ', error);
            const msg = error?.response?.data?.message || 'Lỗi đăng nhập';
            alert(`Đăng nhập thất bại: ${msg}`);
        }
    });
};

// =============================================================================
// 3. Hook Gửi OTP (Supabase)
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
            // 1. Verify với Supabase để lấy UID
            const { uid } = await supabaseService.verifyOtp(phone, otp);
            if (!uid) throw new Error("Không xác thực được OTP");

            // 2. Sync với Backend: POST /customer/auth/sync-phone-account
            const res = await api.post('/customer/auth/sync-phone-account', {
                uid,
                phone,
                password 
            });
            return res.data;
        },
        onSuccess: (data) => {
            if (data.success) {
                // ✅ Auto Login sau khi verify thành công
                login(data.data.customer, data.data.accessToken);
                
                console.log("Xác thực thành công");
                
                // Nếu backend yêu cầu đặt mật khẩu (trường hợp login lần đầu chưa có pass)
                if (data.data.requirePasswordSet) {
                    // router.push('/set-password'); // Tùy logic, hoặc về trang chủ luôn
                    router.push('/'); 
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
// 5. Hook Social Login (Bước 1: Redirect sang Google/Facebook)
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
// 6. Hook Sync Social Account (Bước 2: Sau khi Redirect về)
// =============================================================================
export const useSyncSocialAccount = () => {
  const { login } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: { 
      uid: string; 
      email: string; 
      name: string; 
      avatar: string; 
      provider: 'GOOGLE' | 'FACEBOOK' 
    }) => {
      // POST /customer/auth/social-login
      const res = await api.post('/customer/auth/social-login', payload);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        // ✅ Auto Login
        login(data.data.customer, data.data.accessToken);
        console.log("Đăng nhập mạng xã hội thành công");
        router.push('/');
      }
    },
    onError: (error: any) => {
        console.error("Social Sync Error:", error);
        const msg = error?.response?.data?.message || 'Lỗi đồng bộ tài khoản';
        alert(`Lỗi: ${msg}`);
    }
  });
};

// =============================================================================
// 7. Hook Đặt mật khẩu (Sau khi đăng ký)
// =============================================================================
export const useSetPassword = () => {
  const router = useRouter();
  // Có thể lấy { setAccessToken } từ store nếu cần update token
  
  return useMutation({
    mutationFn: async (payload: { phone: string; uid: string; password: string }) => {
       // POST /customer/auth/set-password
       const res = await api.post('/customer/auth/set-password', payload);
       return res.data;
    },
    onSuccess: (data) => {
       if (data.success) {
          // Backend trả về accessToken mới
          if (data.data?.accessToken) {
              // Ở đây nếu backend trả về token, nghĩa là session vẫn còn hiệu lực
              // Ta có thể redirect về trang chủ luôn
              alert("Đặt mật khẩu thành công!");
              router.push('/'); 
          } else {
             // Nếu không trả token -> bắt đăng nhập lại
             router.push('/login');
          }
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
        // Gọi API để Backend xóa Cookie & Blacklist Token trong Redis
        await api.post('/customer/auth/logout');
      },
      onSuccess: () => {
        // Xóa state ở Client
        logout(); 
        router.push('/login');
        console.log("Đã đăng xuất");
      },
      onError: (error) => {
          console.error("Logout failed", error);
          // Dù API lỗi (vd mạng rớt, token hết hạn) vẫn phải logout ở client để tránh kẹt
          logout();
          router.push('/login');
      }
    });
};