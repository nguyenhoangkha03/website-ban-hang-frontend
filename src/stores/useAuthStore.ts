import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 1. Định nghĩa Interface User (Cập nhật theo logic mới)
interface User {
  id: number;
  customerName: string;
  customerCode: string; // Nên lưu thêm mã KH để hiển thị
  
  phone: string | null; 
  cccd?: string | null;
  
  avatarUrl?: string | null;
  email?: string | null;
  
  // Các trường khác...
  [key: string]: any; 
}

interface AuthState {
  // --- STATE ---
  user: User | null;
  accessToken: string | null; // 🔒 RAM ONLY
  isAuthenticated: boolean;   // RAM ONLY

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

      // 1. LOGIN
      login: (user, accessToken) => {
        set({ 
          user, 
          accessToken, 
          isAuthenticated: true 
        });
      },

      // 2. REFRESH TOKEN
      setAccessToken: (accessToken) => {
        set({ 
          accessToken, 
          isAuthenticated: true 
        });
      },

      // 3. LOGOUT
      logout: () => {
        set({ 
          user: null, 
          accessToken: null, 
          isAuthenticated: false 
        });
        // Xóa key trong localStorage
        localStorage.removeItem('auth-storage');
      },

      // 4. UPDATE PROFILE
      setUser: (user) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage', // Key trong LocalStorage
      storage: createJSONStorage(() => localStorage),

      // 🛡️ BẢO MẬT: CHỈ LƯU USER INFO, KHÔNG LƯU TOKEN
      partialize: (state) => {
        // Nếu chưa đăng nhập -> Không lưu gì
        if (!state.user) {
            return { user: null } as any; // Trick typescript nếu cần
        }

        // ✅ WHITELIST: Chỉ lưu các trường thông tin cơ bản
        return {
          user: {
            id: state.user.id,
            customerCode: state.user.customerCode,
            customerName: state.user.customerName,
            
            phone: state.user.phone, // Lưu lại (có thể null)
            cccd: state.user.cccd,   // ✅ Lưu thêm CCCD
            
            email: state.user.email,
            avatarUrl: state.user.avatarUrl,
            // ❌ KHÔNG LƯU accessToken ở đây
          }
        };
      },
    }
  )
);