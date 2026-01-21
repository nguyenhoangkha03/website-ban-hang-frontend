"use client";

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { api } from '@/lib/axios'; // ✅ Import 'api' từ file axios.ts mới

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  // Trạng thái loading
  const [isChecking, setIsChecking] = useState(true);
  
  // Lấy user và action từ store
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const { setAccessToken, logout } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      // 1. Tối ưu: Nếu không có User trong LocalStorage (Khách vãng lai) -> Không cần check
      if (!user) {
        setIsChecking(false);
        return;
      }

      // 2. Nếu AccessToken đã có (Access Token trong RAM chưa mất - vd navigate nội bộ) -> Không cần check
      if (accessToken) {
        setIsChecking(false);
        return;
      }

      // 3. Có User (từ persist) nhưng mất Token (do F5) -> Gọi API Refresh
      try {
        // Gọi API Refresh Token
        // Cookie 'c_refresh_token' sẽ tự động được gửi đi nhờ withCredentials: true
        const response = await api.post('/customer/auth/refresh-token');

        if (response.data?.success) {
          const newAccessToken = response.data.data.accessToken;
          
          // Khôi phục Access Token vào RAM (Zustand)
          setAccessToken(newAccessToken);
          
          // [Optional] Nếu cần đồng bộ lại thông tin User mới nhất từ DB
          // const profileRes = await api.get('/customer/auth/profile');
          // useAuthStore.getState().setUser(profileRes.data.data);
        }
      } catch (error) {
        // Nếu lỗi (Cookie hết hạn, hoặc không hợp lệ)
        // -> Xóa sạch thông tin user cũ trong LocalStorage để logout hẳn
        // Chỉ logout nếu trước đó đang có user (tránh loop vô tận)
        console.warn("Phiên đăng nhập hết hạn:", error);
        logout();
      } finally {
        // Dù thành công hay thất bại, cũng tắt trạng thái loading
        setIsChecking(false);
      }
    };

    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Màn hình chờ khi đang khôi phục phiên đăng nhập
  // CHỈ HIỆN khi đang check VÀ có user (để khách vãng lai vào trang web được ngay, không bị màn hình trắng)
  if (isChecking && user) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
        {/* Spinner Loading */}
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-[#009f4d]"></div>
      </div>
    );
  }

  return <>{children}</>;
}