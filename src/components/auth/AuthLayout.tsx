'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import LoginForm from './LoginForm';
import AuthBanner from './AuthBanner';

export default function AuthLayout() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 transition-all duration-700 relative"
      style={{
        backgroundImage: 'url(/images/BG.png)', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Main Card Container */}
      <div className="w-full flex bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl min-h-[600px] animate-in fade-in zoom-in duration-500 relative z-10">
        
        {/* ✅ THAY ĐỔI: Nút đóng giờ nằm TRONG card, ở góc phải */}
        {/* Dùng text-gray-400 để dịu mắt, hover đậm lên */}
        <Link 
          href="/" 
          className="absolute top-4 right-4 z-50 p-2 text-red-500 hover:text-gray-600 hover:bg-red-100 rounded-full transition-all duration-300"
          title="Quay về trang chủ"
        >
          <X size={24} />
        </Link>

        {/* --- LEFT SIDE: BANNER --- */}
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