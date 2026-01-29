import { supabase } from './supabase';

export const supabaseService = {
  // 1. Đăng nhập Social (Google/Facebook)
  loginSocial: async (provider: 'google' | 'facebook') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        // Redirect về trang hiện tại hoặc trang xử lý login
        redirectTo: typeof window !== 'undefined' ? window.location.origin + '/login' : undefined,
      },
    });
    if (error) throw new Error(error.message);
  },

  // 2. Logout Supabase (Xóa session trên trình duyệt)
  logout: async () => {
    await supabase.auth.signOut();
  },

  // 3. Lấy User hiện tại của Supabase (Dùng để lấy UID gửi xuống Backend)
  getCurrentUser: async () => {
    const { data } = await supabase.auth.getUser();
    return data.user;
  }
};