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
  const { setAccessToken, setUser, logout } = useAuthStore(); // Lấy thêm setUser để update profile nếu cần

  useEffect(() => {
    const initializeAuth = async () => {
      // 1. Tối ưu: Nếu không có User trong Persist Store (Khách vãng lai) -> Không cần check
      if (!user) {
        setIsChecking(false);
        return;
      }

      // 2. Nếu AccessToken đã có (RAM chưa mất - vd navigate nội bộ) -> Không cần check
      if (accessToken) {
        setIsChecking(false);
        return;
      }

      // 3. Có User (từ persist) nhưng mất Token (do F5) -> Gọi API Refresh
      try {
        // ✅ SỬA ĐƯỜNG DẪN: /cs/accounts/refresh-token
        // Cookie 'c_refresh_token' sẽ tự động được gửi đi nhờ withCredentials: true
        const response = await api.post('/cs/accounts/refresh-token');

        if (response.data?.success) {
          const newAccessToken = response.data.data.accessToken;
          
          // Khôi phục Access Token vào RAM (Zustand)
          setAccessToken(newAccessToken);
          
          // 💡 [Khuyên dùng] Nên gọi thêm API lấy Profile mới nhất
          // Lý do: LocalStorage có thể lưu tên/avatar cũ. Khi F5 ta nên lấy lại data mới nhất.
          try {
             // ✅ SỬA ĐƯỜNG DẪN: /cs/customers/profile (theo useUser hook)
             const profileRes = await api.get('/cs/customers/profile');
             if(profileRes.data?.data) {
                setUser(profileRes.data.data);
             }
          } catch (err) {
             console.log("Không thể đồng bộ profile mới nhất, dùng tạm cache cũ");
          }
        }
      } catch (error) {
        // Nếu lỗi (Cookie hết hạn, hoặc không hợp lệ)
        // -> Xóa sạch thông tin user cũ để logout hẳn
        console.warn("Phiên đăng nhập hết hạn hoặc lỗi kết nối:", error);
        logout();
      } finally {
        // Dù thành công hay thất bại, cũng tắt trạng thái loading để vào App
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
        <div className="flex flex-col items-center gap-4">
             <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-100 border-t-[#009f4d]"></div>
             <p className="text-gray-500 text-sm font-medium animate-pulse">Đang khôi phục phiên đăng nhập...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}