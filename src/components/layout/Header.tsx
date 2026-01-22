'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
// 👇 1. Import usePathname để lấy đường dẫn hiện tại
import { usePathname, useRouter } from 'next/navigation';
import { Phone, User, ShoppingCart, Menu, Sun, Moon, LogOut, ChevronDown } from 'lucide-react';
import Container from './Container';

// Import Store
import { useAuthStore } from '@/stores/useAuthStore';
import { useThemeStore } from '@/stores/useThemeStore';

// 👇 2. Định nghĩa Menu trực tiếp tại đây (Chuẩn đường dẫn /products)
const MENU_ITEMS = [
  { name: "Trang chủ", href: "/" },
  { name: "Giới thiệu", href: "/about" },
  { name: "Sản phẩm", href: "/products" }, // ✅ Đã sửa đúng folder app/products
  { name: "Tin tức", href: "/news" },
  { name: "Liên hệ", href: "/contact" },
];

export default function Header() {
  const router = useRouter();
  
  // 👇 3. Hook lấy URL hiện tại (VD: /products/15)
  const pathname = usePathname(); 

  // Lấy state từ Auth Store
  const { user, isAuthenticated, logout } = useAuthStore();
  
  // Lấy theme state
  const { theme, toggleTheme } = useThemeStore();
  
  // State dropdown
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Xử lý click outside dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Xử lý logout
  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    router.push('/login');
  };

  // Render User Section
  const renderUserSection = () => {
    if (isAuthenticated && user) {
      return (
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
          >
            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-300 font-bold overflow-hidden border border-green-200 dark:border-green-700">
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
            <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 animate-in fade-in slide-in-from-top-2 z-50">
              <div className="px-4 py-2 border-b border-gray-50 dark:border-gray-700 mb-1">
                 <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">{user.customerName}</p>
                 <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.phone}</p>
              </div>
              
              <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <User size={16} /> Hồ sơ cá nhân
              </Link>
              <Link href="/orders" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <ShoppingCart size={16} /> Đơn mua
              </Link>
              
              <div className="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut size={16} /> Đăng xuất
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        href="/login"
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50 transition-all font-bold text-sm"
      >
        <User size={18} />
        <span>Đăng nhập</span>
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-800 transition-colors">
      <Container>
        <div className="h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-19 h-19 mb-3">
              <img
                src="/images/logo.gif"
                alt="Logo Công ty Nam Việt"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-display font-bold text-2xl text-primary dark:text-green-400 tracking-tight">NAM VIET</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {/* 👇 4. Map qua mảng MENU_ITEMS thay vì mockData */}
            {MENU_ITEMS.map((link) => {
              // 👇 5. Logic kiểm tra Active
              const isActive = link.href === '/' 
                ? pathname === '/' 
                : pathname.startsWith(link.href); // Cho phép /products/123 vẫn sáng menu Sản phẩm

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-semibold uppercase tracking-wide transition-colors duration-200 ${
                    isActive 
                      ? 'text-primary dark:text-green-400 border-b-2 border-primary dark:border-green-400 pb-1' // Style khi Active
                      : 'text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-green-400'            // Style thường
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
              <Phone size={18} />
              <span className="font-bold text-sm">1800 66 25</span>
            </div>

            {renderUserSection()}

            <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-green-400 transition-colors relative">
              <ShoppingCart size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <button 
              onClick={toggleTheme}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-green-400 transition-all hover:rotate-180 duration-500"
              aria-label="Toggle theme"
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