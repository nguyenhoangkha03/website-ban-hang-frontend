import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: number;
  customerName: string; // Hoặc 'name' tùy API trả về
  phone: string;
  avatarUrl?: string;
  email?: string;
  // ... thêm các field khác nếu cần
}

interface AuthState {
  // State
  user: User | null;
  accessToken: string | null; // ⚠️ QUAN TRỌNG: Chỉ lưu trong RAM
  isAuthenticated: boolean;
  
  // Actions
  // Login: Nhận user & accessToken (Refresh token đã tự vào Cookie)
  login: (user: User, accessToken: string) => void;
  
  // setAccessToken: Dùng khi Silent Refresh (F5 trang)
  setAccessToken: (accessToken: string) => void;
  
  // Logout: Xóa sạch state
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      // 1. Khi đăng nhập thành công
      login: (user, accessToken) => {
        // ❌ KHÔNG lưu vào localStorage thủ công nữa
        set({ 
            user, 
            accessToken, 
            isAuthenticated: true 
        });
      },

      // 2. Khi refresh token thành công (Interceptor/AuthProvider gọi)
      setAccessToken: (accessToken) => {
        set({ 
            accessToken, 
            isAuthenticated: true 
        });
      },

      // 3. Khi đăng xuất
      logout: () => {
        // ❌ KHÔNG cần removeItem thủ công vì persist sẽ tự xử lý state
        set({ 
            user: null, 
            accessToken: null, 
            isAuthenticated: false 
        });
      },
    }),
    {
      name: 'auth-storage', // Tên key trong LocalStorage
      storage: createJSONStorage(() => localStorage),
      
      // ⚠️ CẤU HÌNH QUAN TRỌNG NHẤT:
      // Chỉ lưu 'user' để hiển thị UI. 
      // KHÔNG lưu 'accessToken' (để bảo mật).
      // KHÔNG lưu 'isAuthenticated' (để tránh trạng thái giả khi token hết hạn).
      partialize: (state) => ({ 
          user: state.user 
      }), 
    }
  )
);