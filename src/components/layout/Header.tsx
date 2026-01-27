'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Phone, User, ShoppingCart, Menu, Sun, Moon, LogOut, ChevronDown } from 'lucide-react';
import Container from './Container';

import { useAuthStore } from '@/stores/useAuthStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { useLogout } from '@/hooks/api/useAuthApi';

const MENU_ITEMS = [
  { name: "Trang chủ", href: "/" },
  { name: "Giới thiệu", href: "/about" },
  { name: "Sản phẩm", href: "/products" },
  { name: "Tin tức", href: "/news" },
  { name: "Liên hệ", href: "/contact" },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname(); 

  const logoutMutation = useLogout();

  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  

  // ✅ 1. Thêm biến isMounted để biết khi nào component đã chạy trên trình duyệt
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Đánh dấu là đã mount xong
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

const handleLogout = () => {
    // Gọi Mutation để: Gọi API BE -> Xóa Cookie -> Xóa Supabase -> Xóa Store -> Redirect
    logoutMutation.mutate();
    setShowDropdown(false);
  };

  const renderUserSection = () => {
    // Nếu chưa mount xong -> Render một cái khung (skeleton) hoặc nút login giả
    if (!isMounted) {
       return <div className="w-24 h-9 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse"></div>;
    }

    // Sau khi mount xong thì mới check state thật
    if (user) {
      return (
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
          >
            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-300 font-bold overflow-hidden border border-green-200 dark:border-green-700 shrink-0">
               {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
               ) : (
                  <span>{user.customerName?.charAt(0).toUpperCase() || 'U'}</span>
               )}
            </div>
            
            <div className="hidden md:block text-left">
               <p className="text-xs font-bold text-gray-700 dark:text-gray-300 max-w-[100px] truncate">{user.customerName}</p>
            </div>
            <ChevronDown size={14} className="text-gray-400 dark:text-gray-500" />
          </button>

          {showDropdown && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 animate-in fade-in slide-in-from-top-2 z-50">
              <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-700 mb-1 bg-gray-50/50 dark:bg-gray-800/50">
                 <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">{user.customerName}</p>
                 <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email || user.phone}</p>
              </div>
              
              <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-400 transition-colors">
                <User size={16} /> Hồ sơ cá nhân
              </Link>
              <Link href="/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-400 transition-colors">
                <ShoppingCart size={16} /> Đơn mua của tôi
              </Link>
              
              <div className="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
              >
                <LogOut size={16} /> Đăng xuất
              </button>
            </div>
          )}
        </div>
      );
    }

    // Nếu chưa đăng nhập
    return (
      <Link
        href="/login"
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50 transition-all font-bold text-sm"
      >
        <User size={18} />
        <span>Đăng nhập</span>
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800 transition-colors">
      <Container>
        <div className="h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 relative transition-transform group-hover:scale-105">
               <img src="/images/logo.gif" alt="Logo" className="w-full h-full object-contain" />
            </div>
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
            <div className="hidden lg:flex items-center gap-2 bg-primary dark:bg-green-700 text-white px-4 py-2 rounded-full shadow-md hover:bg-primary-dark dark:hover:bg-green-600 transition-colors cursor-pointer">
              <Phone size={16} />
              <span className="font-bold text-sm">1800 66 25</span>
            </div>

            {/* Gọi hàm renderUserSection đã sửa */}
            {renderUserSection()}

            <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-green-400 transition-colors relative">
              <ShoppingCart size={22} />
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                0
              </span>
            </button>

            <button 
              onClick={toggleTheme}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-green-400 transition-all hover:rotate-180 duration-500"
            >
              {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button className="md:hidden p-2 text-gray-600 dark:text-gray-400">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </Container>
    </header>
  );
}