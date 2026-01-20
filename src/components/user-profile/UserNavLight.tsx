'use client';

import Link from 'next/link';
import { User, ChevronDown, ShoppingBag, History } from 'lucide-react';
import { useState } from 'react';

const UserNavLight = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!isDropdownOpen)}
        onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
        className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
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
            href="/history"
            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
          >
            <History className="w-4 h-4" />
            <span>Lịch sử</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserNavLight;