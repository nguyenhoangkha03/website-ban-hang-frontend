'use client';

import { useAuth } from '@/hooks/useAuth';
import { GoogleLogo, FacebookLogo } from '@/icons/SocialIcons';

export default function LoginForm() {
  const { loginZalo, loginSocial, isLoading } = useAuth(); // Dùng hook Facade mới

  const handleZaloLogin = () => {
    // Logic redirect sang Zalo (như đã bàn ở các bước trước)
    const ZALO_APP_ID = process.env.NEXT_PUBLIC_ZALO_APP_ID;
    const CALLBACK_URL = process.env.NEXT_PUBLIC_ZALO_CALLBACK_URL;
    const STATE = "auth_zalo_state";

    if (!ZALO_APP_ID || !CALLBACK_URL) {
      alert("Chưa cấu hình Zalo ENV!");
      return;
    }

    const zaloUrl = `https://oauth.zalo.me/v4/permission?app_id=${ZALO_APP_ID}&redirect_uri=${encodeURIComponent(CALLBACK_URL)}&state=${STATE}`;
    window.location.href = zaloUrl;
  };

  return (
    <div className="w-full max-w-md p-8 animate-in fade-in zoom-in duration-500 delay-100 flex flex-col justify-center min-h-[400px]">

      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-gray-900">Chào mừng trở lại!</h2>
        <p className="text-gray-500 text-sm mt-3">
            Đăng nhập nhanh chóng để quản lý đơn hàng & công nợ
        </p>
      </div>

      {/* Social Buttons */}
      <div className="space-y-4">
        
        {/* 1. ZALO (Nổi bật nhất - Primary Action) */}
        <button
          onClick={handleZaloLogin}
          disabled={isLoading}
          className="w-full h-14 bg-[#0068FF] hover:bg-[#0054cc] text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70"
        >
          {/* Icon Zalo (Dùng ảnh hoặc SVG) */}
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#0068FF] font-black text-xs">Z</div>
          <span className="text-lg">Đăng nhập bằng Zalo</span>
        </button>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-gray-400 font-medium">Hoặc tiếp tục với</span>
          </div>
        </div>

        {/* 2. GOOGLE & FACEBOOK (Secondary Actions) */}
        <div className="grid grid-cols-2 gap-4">
          {/* ✅ Nút Google: Dùng Component GoogleLogo */}
          <button
            onClick={() => loginSocial('google')}
            disabled={isLoading}
            className="h-12 border-2 border-gray-100 hover:border-gray-300 hover:bg-gray-50 rounded-xl flex items-center justify-center gap-2 transition-all font-medium text-gray-700"
          >
            <GoogleLogo className="w-5 h-5" />
            <span>Google</span>
          </button>

          {/* ✅ Nút Facebook: Dùng Component FacebookLogo */}
          <button
            onClick={() => loginSocial('facebook')}
            disabled={isLoading}
            className="h-12 border-2 border-gray-100 hover:border-blue-100 hover:bg-blue-50 hover:text-blue-700 rounded-xl flex items-center justify-center gap-2 transition-all font-medium text-gray-700"
          >
            <FacebookLogo className="w-5 h-5" />
            <span>Facebook</span>
          </button>
        </div>
      </div>

      {/* Footer Text */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-400 px-8">
          Bằng việc đăng nhập, bạn đồng ý với <a href="#" className="underline hover:text-gray-600">Điều khoản dịch vụ</a> và <a href="#" className="underline hover:text-gray-600">Chính sách bảo mật</a> của chúng tôi.
        </p>
      </div>

    </div>
  );
}