'use client';

import { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import AuthBanner from './AuthBanner';

export default function AuthLayout() {
  const [isMounted, setIsMounted] = useState(false);

  // Fix hydration mismatch (đảm bảo render client khớp server)
  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 transition-all duration-700"
      style={{
        backgroundImage: 'url(/images/BG.png)', // Ảnh nền toàn màn hình
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Main Card Container */}
      <div className="w-full flex bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl min-h-[600px] animate-in fade-in zoom-in duration-500">
        
        {/* --- LEFT SIDE: BANNER (Ẩn trên mobile) --- */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <AuthBanner 
             image="/images/luaxanh.png"
             title="Nông Sản Nam Việt"
             description="Kết nối nông sản sạch từ nông trại đến bàn ăn của mọi gia đình Việt."
          />
        </div>

        {/* --- RIGHT SIDE: LOGIN FORM --- */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white relative">
          <div className="w-full max-w-md">
             <LoginForm />
          </div>
        </div>

      </div>
    </div>
  );
}