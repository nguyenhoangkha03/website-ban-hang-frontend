import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google"; 
import "./globals.css";
import QueryProvider from '@/src/providers/QueryProvider';
import SocialAuthListener from '@/src/components/auth/SocialAuthListener';

// 1. Cấu hình Font (Giữ nguyên như bạn làm là chuẩn)
const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const montserrat = Montserrat({ 
  subsets: ["latin"], 
  variable: '--font-montserrat', 
  weight: ['400', '500', '600', '700', '800'] 
});

export const metadata: Metadata = {
  title: "Nam Viet - Đồng hành cùng Nhà Nông",
  description: "Giải pháp nông nghiệp toàn diện",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      {/* 2. SỬA LẠI BODY: 
         - Kết hợp cả inter.variable và montserrat.variable để dùng được trong Tailwind
         - Thêm class nền bg-gray-50 để web không bị trắng toát đau mắt
      */}
      <body className={`${inter.variable} ${montserrat.variable} font-sans bg-gray-50 text-gray-900`}>
        
        <QueryProvider> 
          {/* 👇 Đặt Listener ở đây để nó luôn chạy ngầm */}
          <SocialAuthListener />
          
          {/* ... Header, Children ... */}
          {children}
          
        </QueryProvider>
      </body>
    </html>
  );
}
