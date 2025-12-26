import { supabase } from './supabase';

// Helper chuẩn hóa số điện thoại (từ code cũ)
const formatPhoneForSupabase = (phone: string) => {
  phone = phone.trim();
  if (phone.startsWith('0')) return '+84' + phone.substring(1);
  if (phone.startsWith('84')) return '+' + phone;
  if (phone.startsWith('+84')) return phone;
  return '+84' + phone; // Mặc định thêm +84 nếu thiếu
};

export const supabaseService = {
  // 1. Gửi OTP (Tương ứng: sendSupabaseOtp)
  sendOtp: async (phone: string) => {
    const formattedPhone = formatPhoneForSupabase(phone);
    const { error } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
    });
    if (error) throw new Error(error.message);
    return true;
  },

  // 2. Xác thực OTP (Tương ứng: supabase.auth.verifyOtp)
  verifyOtp: async (phone: string, token: string) => {
    const formattedPhone = formatPhoneForSupabase(phone);
    const { data, error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token,
      type: 'sms',
    });

    if (error) throw new Error(error.message);
    
    // Trả về UID để gửi xuống Backend sync
    return { uid: data.user?.id, session: data.session };
  },

  // 3. Đăng nhập Social (Tương ứng: loginSocial)
  loginSocial: async (provider: 'google' | 'facebook') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        // Chuyển hướng về trang hiện tại sau khi login xong
        redirectTo: typeof window !== 'undefined' ? window.location.origin + '/login' : undefined,
      },
    });
    if (error) throw new Error(error.message);
  },

  // 4. Logout Supabase
  logout: async () => {
    await supabase.auth.signOut();
  }
};