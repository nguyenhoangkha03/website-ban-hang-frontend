'use client';

import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

import QueryProvider from '@/providers/QueryProvider';
import SocialAuthListener from '@/components/auth/SocialAuthListener';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useThemeStore } from '@/stores/useThemeStore';

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700', '800']
});

// Theme Initializer Component
function ThemeInitializer() {
  const { theme } = useThemeStore();

  useEffect(() => {
    // Apply theme class to html element on mount
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return null;
}




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
      <body className={`${inter.variable} ${montserrat.variable} font-sans bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors`}>

        <QueryProvider>
          <ThemeInitializer />
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