import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 1. Định nghĩa Interface User
// Chỉ chứa những thông tin cần thiết để hiển thị trên UI (Header, Profile sơ lược)
interface User {
  id: number;
  customerName: string;
  phone: string;
  avatarUrl?: string | null; // Cho phép null
  email?: string | null;
  // Các trường khác nếu Backend trả về (nhưng ta sẽ lọc khi lưu)
  [key: string]: any; 
}

interface AuthState {
  // --- STATE ---
  user: User | null;
  accessToken: string | null; // 🔒 RAM ONLY: Chìa khóa vào nhà
  isAuthenticated: boolean;   // Trạng thái đăng nhập (dựa trên RAM)

  // --- ACTIONS ---
  login: (user: User, accessToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Giá trị mặc định
      user: null,
      accessToken: null,
      isAuthenticated: false,

      // 1. LOGIN: Lưu cả User và Token vào RAM
      login: (user, accessToken) => {
        set({ 
          user, 
          accessToken, 
          isAuthenticated: true 
        });
      },

      // 2. REFRESH: Chỉ cập nhật Token (giữ nguyên User cũ hoặc User đang có)
      setAccessToken: (accessToken) => {
        set({ 
          accessToken, 
          isAuthenticated: true 
        });
      },

      // 3. LOGOUT: Xóa sạch mọi thứ
      logout: () => {
        set({ 
          user: null, 
          accessToken: null, 
          isAuthenticated: false 
        });
        // (Tùy chọn) Xóa triệt để key trong localStorage để an tâm
        localStorage.removeItem('auth-storage');
      },

      // 4. UPDATE PROFILE: Cập nhật thông tin User (Avatar, Tên...) mà không cần login lại
      setUser: (user) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage', // Tên key trong LocalStorage
      storage: createJSONStorage(() => localStorage),

      // 🛡️ BẢO MẬT CẤP CAO: CHỈ LƯU NHỮNG GÌ AN TOÀN
      partialize: (state) => {
        // Nếu chưa đăng nhập (user null) -> Không lưu gì cả
        if (!state.user) {
            return { user: null };
        }

        // ✅ WHITELIST: Chỉ lưu các trường định danh cơ bản.
        return {
          user: {
            id: state.user.id,
            customerName: state.user.customerName,
            phone: state.user.phone, // Cần thiết để hiển thị
            email: state.user.email,
            avatarUrl: state.user.avatarUrl,
            // ❌ KHÔNG LƯU: accessToken, isAuthenticated, debt, role, v.v.
          }
        };
      },
    }
  )
);