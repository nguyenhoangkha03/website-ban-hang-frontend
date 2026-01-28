"use client";

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { api } from '@/lib/axios'; // Đảm bảo import đúng file axios bạn vừa sửa

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isChecking, setIsChecking] = useState(true);
  
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const { setAccessToken, setUser, logout } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      // 1. Nếu AccessToken đã có (RAM còn) -> Chắc chắn đã login -> Bỏ qua check
      if (accessToken) {
        setIsChecking(false);
        return;
      }

      // 2. Gọi API Refresh Token
      try {
        // ✅ CẬP NHẬT ĐƯỜNG DẪN MỚI: /cs/auth/...
        const response = await api.post('/cs/auth/refresh-token');

        if (response.data?.success) {
          console.log("♻️ Khôi phục phiên thành công (Self-Healing)");
          const newAccessToken = response.data.data.accessToken;
          setAccessToken(newAccessToken);
          
          // Lấy lại profile mới nhất (Để đảm bảo data ở LocalStorage không bị cũ)
          try {
             // Đường dẫn này ĐÚNG (/cs/customers/profile)
             const profileRes = await api.get('/cs/customers/profile');
             if(profileRes.data?.data) {
                setUser(profileRes.data.data);
             }
          } catch (err) {
             console.log("Sync profile failed - Token valid but get profile error");
          }
        }
      } catch (error: any) {
        // 3. Xử lý lỗi
        
        // Nếu lỗi 401 (Khách vãng lai hoặc Hết hạn cookie) -> Im lặng
        if (error?.response?.status !== 401) {
             console.warn("Lỗi Auth (Provider):", error);
        }

        // Nếu trong LocalStorage đang lưu user mà refresh thất bại -> Xóa đi để tránh lỗi UI
        if (user) {
            logout(); 
        }
      } finally {
        setIsChecking(false);
      }
    };

    initializeAuth();
  }, []); // Chạy 1 lần duy nhất khi Mount

  // =========================================================
  // Màn hình chờ (Loading)
  // =========================================================
  // Logic này rất hay: 
  // - Nếu là khách (user=null) -> Cho vào luôn (không hiện loading)
  // - Nếu là User cũ (user!=null) -> Hiện loading che đi để đợi hồi phục session
  if (isChecking && user) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
         <div className="flex flex-col items-center gap-4">
             {/* Spinner */}
             <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-100 border-t-[#009f4d]"></div>
             <p className="text-gray-500 text-sm font-medium animate-pulse">Đang khôi phục phiên đăng nhập...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}