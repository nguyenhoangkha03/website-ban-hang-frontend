'use client';

import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google"; 
import "./globals.css";
import QueryProvider from '@/src/providers/QueryProvider';
import SocialAuthListener from '@/src/components/auth/SocialAuthListener';
import Header from '@/src/components/layout/Header';
import Footer from '@/src/components/layout/Footer';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const montserrat = Montserrat({ 
  subsets: ["latin"], 
  variable: '--font-montserrat', 
  weight: ['400', '500', '600', '700', '800'] 
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Các trang auth không cần header/footer
  const isAuthPage = pathname.startsWith('/login') || 
                     pathname.startsWith('/register') || 
                     pathname.startsWith('/forgot-password') ||
                     pathname.startsWith('/reset-password') ||
                     pathname.startsWith('/verify-otp');
  
  return (
    <html lang="vi">
      <body className={`${inter.variable} ${montserrat.variable} font-sans bg-gray-50 text-gray-900`}>
        
        <QueryProvider> 
          <SocialAuthListener />
          
          {!isAuthPage && <Header />}

          <main className="min-h-screen">
             {children}
          </main>
          
          {!isAuthPage && <Footer />}
          
        </QueryProvider>
      </body>
    </html>
  );
}