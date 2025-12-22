'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Phone, User, ShoppingCart, Menu, Sun, LogOut, ChevronDown } from 'lucide-react';
import { navLinks } from '../../src/lib/mockData';
import Container from './Container';

// 👇 1. Import Store và Hooks
import { useAuthStore } from '@/src/stores/useAuthStore';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  
  // 👇 2. Lấy thông tin User và hàm Logout từ Store
  const { user, isAuthenticated, logout } = useAuthStore();
  
  // State cho dropdown menu (khi click vào avatar)
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Xử lý click outside để đóng dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Hàm xử lý Đăng xuất
  const handleLogout = () => {
    logout(); // Xóa store & localStorage
    setShowDropdown(false);
    router.push('/login'); // Chuyển về trang login (hoặc reload trang chủ)
    // window.location.reload(); // Nếu muốn reload sạch sẽ
  };

  // Hàm render Avatar User
  const renderUserSection = () => {
    if (isAuthenticated && user) {
      return (
        <div className="relative" ref={dropdownRef}>
          {/* Nút Avatar */}
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"
          >
            {/* Avatar Image hoặc Placeholder */}
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold overflow-hidden border border-green-200">
               {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
               ) : (
                  <span>{user.customerName?.charAt(0).toUpperCase() || 'U'}</span>
               )}
            </div>
            
            {/* Tên User (ẩn trên mobile) */}
            <div className="hidden md:block text-left">
               <p className="text-xs font-bold text-gray-700 max-w-[100px] truncate">{user.customerName}</p>
            </div>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 z-50">
              <div className="px-4 py-2 border-b border-gray-50 mb-1">
                 <p className="text-sm font-bold text-gray-800 truncate">{user.customerName}</p>
                 <p className="text-xs text-gray-500 truncate">{user.phone}</p>
              </div>
              
              <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <User size={16} /> Hồ sơ cá nhân
              </Link>
              <Link href="/orders" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <ShoppingCart size={16} /> Đơn mua
              </Link>
              
              <div className="h-px bg-gray-100 my-1"></div>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} /> Đăng xuất
              </button>
            </div>
          )}
        </div>
      );
    }

    // Nếu chưa đăng nhập -> Hiện nút Login cũ
    return (
      <Link
        href="/login"
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-green-50 text-green-700 hover:bg-green-100 transition-all font-bold text-sm"
      >
        <User size={18} />
        <span>Đăng nhập</span>
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
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
            <span className="font-display font-bold text-2xl text-primary tracking-tight">NAM VIET</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-semibold uppercase tracking-wide transition-colors duration-200 ${
                  link.active ? 'text-primary' : 'text-gray-600 hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full shadow-md hover:bg-primary-dark transition-colors cursor-pointer">
              <Phone size={18} />
              <span className="font-bold text-sm">1800 66 25</span>
            </div>

            {/* 👇 3. Thay thế nút Login cũ bằng hàm renderUserSection */}
            {renderUserSection()}

            <button className="p-2 text-gray-500 hover:text-primary transition-colors relative">
              <ShoppingCart size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <button className="p-2 text-gray-500 hover:text-primary transition-colors">
              <Sun size={20} />
            </button>

            <button className="md:hidden p-2 text-gray-600">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </Container>
    </header>
  );
}