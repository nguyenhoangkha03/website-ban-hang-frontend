// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google"; 
import "./globals.css";
import QueryProvider from '@/providers/QueryProvider';
import { Toaster } from "react-hot-toast";
import SocialAuthListener from '@/components/auth/SocialAuthListener';
import AuthProvider from "@/providers/AuthProvider";

// ❌ ĐÃ XÓA: Import Header, Footer, MissingInfoBanner

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
      <body className={`${inter.variable} ${montserrat.variable} font-sans bg-gray-50 text-gray-900`}>
        <AuthProvider>
          <QueryProvider> 
            <SocialAuthListener />
            
            {/* ✅ CHỈ GIỮ LẠI CHILDREN (Nội dung của (auth) hoặc (main) sẽ hiện ở đây) */}
            {children} 

          </QueryProvider>
          <Toaster position="top-center" reverseOrder={false} />
        </AuthProvider>
      </body>
    </html>
  );
}