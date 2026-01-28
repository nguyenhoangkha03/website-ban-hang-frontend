// src/app/zalo-callback/page.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function ZaloCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { loginZalo } = useAuth();
  
  // Dùng ref để chặn React Strict Mode gọi API 2 lần
  const hasCalled = useRef(false);

  useEffect(() => {
    // Lấy Authorization Code từ URL (Zalo trả về)
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    // Nếu người dùng hủy hoặc lỗi từ Zalo
    if (error) {
        alert("Đăng nhập Zalo thất bại hoặc bị hủy.");
        router.push('/login');
        return;
    }

    // Nếu có code -> Gọi API Backend để đổi code lấy token
    if (code && !hasCalled.current) {
      hasCalled.current = true;
      console.log("🔹 Nhận được Zalo Code:", code);
      loginZalo(code);
    }
  }, [searchParams, loginZalo, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="p-8 bg-white rounded-2xl shadow-xl flex flex-col items-center gap-4 animate-in fade-in zoom-in">
        <div className="relative">
           <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-25"></div>
           <Loader2 className="h-12 w-12 text-[#0068FF] animate-spin relative z-10" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Đang xử lý đăng nhập Zalo...</h2>
        <p className="text-gray-500 text-sm">Vui lòng không tắt trình duyệt.</p>
      </div>
    </div>
  );
}