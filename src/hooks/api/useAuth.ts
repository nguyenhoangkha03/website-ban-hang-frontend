import { useMutation } from '@tanstack/react-query';
import { http } from '@/lib/http';
import { LoginFormType, RegisterFormType } from '@/lib/validations/auth';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';
import { supabaseService } from '@/lib/supabase/supabaseService';

// 1. Hook Check Phone
export const useCheckPhone = () => {
    return useMutation({
        mutationFn: async (phone: string) => {
            // Gọi API Backend: POST /check-phone
            const res = await http.post('/accounts/check-phone', { phone });
            return res.data; // { success: true, data: { exists: boolean, ... } }
        },
    });
};

// 2. Hook Đăng nhập (Password)
export const useLogin = () => {
    const login = useAuthStore((state) => state.login);
    const router = useRouter();

    return useMutation({
        mutationFn: async (data: LoginFormType) => {
            console.log('calling login api with data: ', data);
            const res = await http.post('/accounts/login', data);
            return res.data;
        },
        onSuccess: (data) => {
            if (data.success) {
                // Lưu vào Zustand & LocalStorage
                login(data.data.customer, data.data.tokens.accessToken, data.data.tokens.refreshToken);
                // Chuyển trang
                router.push('/');
            }
        },
        onError: (error: any) => {
            console.error('Login error: ', error);
            throw new Error(error?.response?.data?.message || 'Lỗi không xác định từ máy chủ');
        }
    });
};

// [MỚI] Hook Gửi OTP (Gọi Supabase)
export const useSendOtp = () => {
    return useMutation({
        mutationFn: async (phone: string) => {
            return await supabaseService.sendOtp(phone);
        },
    });
};

// [MỚI] Hook Verify OTP & Register (Kết hợp Supabase + Backend)
export const useVerifyAndRegister = () => {
    const router = useRouter();

    return useMutation({
        // 👇 Thêm tham số password?: string vào đây
        mutationFn: async ({ phone, otp, password }: { phone: string; otp: string; password?: string }) => {
            // 1. Verify OTP lấy UID
            const { uid } = await supabaseService.verifyOtp(phone, otp);
            if (!uid) throw new Error("Không lấy được UID từ Supabase");

            // 2. Gửi UID + Phone + PASSWORD xuống Backend
            const res = await http.post('/accounts/sync-phone-account', {
                uid,
                phone,
                password // <--- QUAN TRỌNG: Phải gửi cái này!
            });
            return res.data;
        },
        onSuccess: (data) => {
            if (data.success) {
                alert('Đăng ký thành công! Vui lòng đăng nhập.');
                router.push('/login');
            }
        }
    });
};

// [MỚI] Hook Login Social (Bước 1: Chuyển hướng sang Google/FB)
export const useSocialLogin = () => {
  return useMutation({
    mutationFn: async (provider: 'google' | 'facebook') => {
      // Gọi service supabase để redirect
      return await supabaseService.loginSocial(provider);
    }
  });
};

// [MỚI] Hook Đồng bộ Social với Backend (Bước 2: Sau khi redirect về)
export const useSyncSocialAccount = () => {
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: { 
      uid: string; 
      email: string; 
      name: string; 
      avatar: string; 
      provider: 'GOOGLE' | 'FACEBOOK' 
    }) => {
      // Gọi API Backend: POST /accounts/social-login
      const res = await http.post('/accounts/social-login', payload);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        // Lưu Token của Backend mình cấp vào Store
        login(data.data.customer, data.data.tokens.accessToken, data.data.tokens.refreshToken);
        router.push('/'); // Về trang chủ
      }
    },
    onError: (error) => {
        console.error("Lỗi đồng bộ Social:", error);
        alert("Đăng nhập mạng xã hội thất bại.");
    }
  });
};

export const useSetPassword = () => {
  const router = useRouter();
  
  return useMutation({
    mutationFn: async (payload: { phone: string; uid: string; password: string }) => {
       // Gọi API: POST /accounts/set-password
       const res = await http.post('/accounts/set-password', payload);
       return res.data;
    },
    onSuccess: (data) => {
       if (data.success) {
          alert('✅ Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
          router.push('/login');
       }
    }
  });
};