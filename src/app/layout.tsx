import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google"; 
import "./globals.css";
import QueryProvider from '@/providers/QueryProvider';
import SocialAuthListener from '@/components/auth/SocialAuthListener';

// 👇 1. IMPORT HEADER VÀ FOOTER VÀO ĐÂY
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

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
        
        <QueryProvider> 
          <SocialAuthListener />
          
          {/* 👇 2. ĐẶT HEADER Ở ĐÂY (Nó sẽ hiện trên mọi trang) */}
          <Header />

          {/* Đây là nơi nội dung các trang (Home, About, Login...) được thay thế vào */}
          <main className="min-h-screen">
             {children}
          </main>
          
          {/* 👇 3. ĐẶT FOOTER Ở ĐÂY */}
          <Footer />
          
        </QueryProvider>
      </body>
    </html>
  );
}