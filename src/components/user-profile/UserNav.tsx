'use client';

import Link from 'next/link';
import {
  User,
  ChevronDown,
  ShoppingBag,
  CreditCard,
  LogOut,
  LogIn,
  UserPlus,
  PlayCircle,
} from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
// import { useAuthApi } from '@/hooks/api/useAuthApi'; // No longer needed for demo login
import { toast } from 'sonner';

const UserNav = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const { isAuthenticated, logout, loginDemo } = useAuth(); // Destructure loginDemo
  // const { loginAsDemo } = useAuthApi(); // No longer needed for demo login
  const router = useRouter();

  const handleDemoLogin = () => {
    toast.promise(
      loginDemo(), // Call the new loginDemo function directly
      {
        loading: 'Đang đăng nhập tài khoản demo...',
        success: 'Đăng nhập demo thành công!',
        error: 'Lỗi đăng nhập demo!',
      }
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleDemoLogin}
          className="hidden sm:flex items-center gap-2 px-3 py-2 text-white bg-green-500 hover:bg-green-400 rounded-lg transition-colors text-sm font-medium"
        >
          <PlayCircle className="w-4 h-4" />
          <span>Demo</span>
        </button>
        <Link
          href="/login"
          className="flex items-center gap-2 px-3 py-2 text-white bg-blue-500 hover:bg-blue-400 rounded-lg transition-colors text-sm font-medium"
        >
          <LogIn className="w-4 h-4" />
          <span>Đăng nhập</span>
        </Link>
        <Link
          href="/register"
          className="hidden md:flex items-center gap-2 px-3 py-2 text-blue-600 bg-white hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
        >
          <UserPlus className="w-4 h-4" />
          <span>Đăng ký</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!isDropdownOpen)}
        onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
        className="flex items-center gap-2 px-3 py-2 text-white hover:bg-blue-500 rounded-lg transition-colors"
      >
        <User className="w-5 h-5" />
        <span className="hidden md:inline text-sm font-medium">Tài khoản</span>
        <ChevronDown className="w-4 h-4" />
      </button>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 text-gray-800">
          <Link
            href="/profile"
            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
          >
            <User className="w-4 h-4" />
            <span>Thông tin</span>
          </Link>
          <Link
            href="/orders"
            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Đơn hàng</span>
          </Link>
          <Link
            href="/payment"
            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
          >
            <CreditCard className="w-4 h-4" />
            <span>Thanh toán</span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserNav;