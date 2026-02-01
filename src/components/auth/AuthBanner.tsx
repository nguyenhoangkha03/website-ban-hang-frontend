'use client';

import Image from 'next/image';

// ✅ KHAI BÁO KIỂU DỮ LIỆU (INTERFACE)
// Đây là phần bạn đang thiếu, khiến TypeScript báo lỗi
interface AuthBannerProps {
  image: string;
  title: string;
  description: string;
}

export default function AuthBanner({
  image,
  title,
  description,
}: AuthBannerProps) {
  return (
    <div className="relative w-full h-full bg-[#009f4d] flex items-center justify-center overflow-hidden">
      
      {/* 1. Ảnh nền (Lấy từ props image) */}
      <div className="absolute inset-0 z-0">
        <Image
          src={image}
          alt="Auth Background"
          fill
          priority
          className="object-cover opacity-90 transition-transform duration-[2000ms] hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
      </div>

      {/* 2. Nội dung text (Lấy từ props title & description) */}
      <div className="relative z-10 flex flex-col items-center text-center p-10 max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 drop-shadow-lg tracking-wide">
          {title}
        </h2>
        
        <p className="text-lg text-white/90 font-light leading-relaxed drop-shadow-md">
          {description}
        </p>

        <div className="mt-8 w-24 h-1 bg-white/50 rounded-full" />
      </div>

      {/* 3. Họa tiết trang trí */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#009f4d]/40 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}