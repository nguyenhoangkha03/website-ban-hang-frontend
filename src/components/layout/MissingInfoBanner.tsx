'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function MissingInfoBanner() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  if (!isMounted || isLoading || !isAuthenticated || !user) return null;

  // --- KIỂM TRA TỪNG TRƯỜNG ---
  // 1. Check Phone (Rỗng hoặc null là thiếu)
  const isMissingPhone = !user.phone || user.phone.trim() === '';
  
  // 2. Check CCCD (Rỗng hoặc null là thiếu)
  const isMissingCCCD = !user.cccd || user.cccd.trim() === '';
  
  // 3. Check Address (Thiếu 1 trong 3 phần chính: Đường, Tỉnh, Huyện là tính thiếu)
  const isMissingAddress = !user.address || !user.province || !user.district;

  // Nếu đủ hết thì ẩn banner đi
  if (!isMissingPhone && !isMissingCCCD && !isMissingAddress) return null;

  // --- TẠO NỘI DUNG THÔNG BÁO ---
  const missingItems: string[] = [];
  
  if (isMissingPhone) missingItems.push('Số điện thoại');
  if (isMissingCCCD) missingItems.push('CCCD');
  if (isMissingAddress) missingItems.push('Địa chỉ');

  const messageList = missingItems.join(', ');

  return (
    <div className="bg-orange-50 border-b border-orange-100 relative overflow-hidden animate-in slide-in-from-top-2">
      <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        
        {/* Nội dung cảnh báo */}
        <div className="flex items-center gap-3 text-orange-800">
          <div className="bg-orange-100 p-2 rounded-full shrink-0 animate-pulse">
             <AlertTriangle size={18} className="text-orange-600" />
          </div>
          <span className="font-medium">
             Bạn chưa cập nhật: <strong className="text-orange-700 uppercase">{messageList}</strong>. 
             Vui lòng bổ sung để bảo vệ tài khoản.
          </span>
        </div>

        {/* Nút hành động */}
        <Link 
          href="/profile?action=update_info" 
          className="group flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-full font-semibold transition-all shadow-sm shadow-orange-200 text-xs sm:text-sm whitespace-nowrap"
        >
          Cập nhật ngay
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}