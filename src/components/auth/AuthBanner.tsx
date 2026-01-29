'use client';

import Image from 'next/image';

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
    // Container chính: Chiếm 100% chiều cao/rộng của cột bên trái
    <div className="relative w-full h-full bg-[#009f4d] flex items-center justify-center overflow-hidden">
      
      {/* 1. Background Image */}
      {/* Dùng next/image với prop 'fill' để ảnh tự co giãn theo khung */}
      <div className="absolute inset-0 z-0">
        <Image
          src={image}
          alt="Auth Background"
          fill
          priority
          className="object-cover opacity-90 transition-transform duration-[2000ms] hover:scale-105"
        />
        {/* Lớp phủ màu đen mờ để chữ dễ đọc hơn */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
      </div>

      {/* 2. Content Text */}
      <div className="relative z-10 flex flex-col items-center text-center p-10 max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
        {/* Logo hoặc Icon trang trí (Optional - Tùy bạn có muốn thêm không) */}
        {/* <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full mb-6 flex items-center justify-center">
            <span className="text-3xl">🌾</span>
        </div> */}

        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 drop-shadow-lg tracking-wide">
          {title}
        </h2>
        
        <p className="text-lg text-white/90 font-light leading-relaxed drop-shadow-md">
          {description}
        </p>

        {/* Decorative Line */}
        <div className="mt-8 w-24 h-1 bg-white/50 rounded-full" />
      </div>

      {/* 3. Họa tiết trang trí nền (Glassmorphism blobs) */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#009f4d]/40 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}