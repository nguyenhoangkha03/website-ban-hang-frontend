import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Cho phép ảnh từ Unsplash
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',   // Một số ảnh Unsplash dùng domain này
      },
      // Nếu sau này dùng ảnh từ nơi khác (VD: supabase), thêm vào đây
    ],
  },
};

export default nextConfig;
