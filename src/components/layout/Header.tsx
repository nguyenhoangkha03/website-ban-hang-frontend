'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, ShoppingCart, Menu, Sun, Moon, X } from 'lucide-react';
import Container from './Container';
import { useThemeStore } from '@/stores/useThemeStore';

const MENU_ITEMS = [
  { name: "Trang chủ", href: "/" },
  { name: "Giới thiệu", href: "/about" },
  { name: "Sản phẩm", href: "/products" },
  { name: "Tin tức", href: "/news" },
  { name: "Liên hệ", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname(); 
  const { theme, toggleTheme } = useThemeStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800 transition-colors">
      <Container>
        <div className="h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 relative transition-transform group-hover:scale-105">
               <img src="/images/logo.gif" alt="Logo" className="w-full h-full object-contain" />
            </div>
            {/* Giữ nguyên text-primary để đồng bộ màu */}
            <span className="font-display font-bold text-2xl text-primary dark:text-green-400 tracking-tight">NAM VIET</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {MENU_ITEMS.map((link) => {
              const isActive = link.href === '/' 
                ? pathname === '/' 
                : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-bold uppercase tracking-wide transition-all duration-200 border-b-2 ${
                    isActive 
                      ? 'text-primary dark:text-green-400 border-primary dark:border-green-400' 
                      : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-primary dark:hover:text-green-400 hover:border-green-100'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            
            {/* ✅ NÚT HOTLINE (STYLE GỐC CỦA BẠN) */}
            <a 
              href="tel:0886357788"
              className="flex items-center gap-2 bg-primary dark:bg-green-700 text-white px-4 py-2 rounded-full shadow-md hover:bg-primary-dark dark:hover:bg-green-600 transition-colors cursor-pointer active:scale-95"
            >
              <Phone size={16} className="animate-pulse" />
              <span className="font-bold text-sm">088 635 7788</span>
            </a>

            {/* Giỏ hàng */}
            {/* <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-green-400 transition-colors relative">
              <ShoppingCart size={22} />
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                0
              </span>
            </button> */}

            {/* Đổi Theme */}
            <button 
              onClick={toggleTheme}
              className="hidden sm:block p-2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-green-400 transition-all hover:rotate-180 duration-500"
            >
              {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Menu Mobile */}
            <button 
              className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-[80px] left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-lg animate-in slide-in-from-top-5 z-30">
            <div className="flex flex-col p-4 space-y-2">
              {MENU_ITEMS.map((link) => {
                const isActive = link.href === '/' 
                  ? pathname === '/' 
                  : pathname.startsWith(link.href);
                
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl font-bold transition-colors ${
                      isActive
                        ? 'bg-green-50 dark:bg-green-900/20 text-primary dark:text-green-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              
              <button 
                onClick={toggleTheme}
                className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-medium"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                <span>{theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}</span>
              </button>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}