'use client';

import Link from 'next/link';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useEffect, useState } from 'react';

export default function MissingInfoBanner() {
    const { user } = useAuthStore();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => setIsMounted(true), []);

    if (!isMounted || !user) return null;

    // Kiểm tra thiếu thông tin
    const missingPhone = !user.phone || user.phone.trim() === '';
    const missingAddress = !user.address || user.address.trim() === '';

    // Nếu đủ cả 2 thì không hiện gì cả
    if (!missingPhone && !missingAddress) return null;

    return (
        <div className="bg-orange-50 border-b border-orange-100 px-4 py-3">
            <div className="container mx-auto flex items-center justify-between gap-4 max-w-7xl">
                <div className="flex items-center gap-3 text-orange-800">
                    <AlertTriangle size={20} className="shrink-0 animate-pulse" />
                    <p className="text-sm font-medium">
                        {missingPhone && missingAddress 
                            ? "Bạn chưa cập nhật Số điện thoại và Địa chỉ giao hàng."
                            : missingPhone 
                                ? "Bạn chưa cập nhật Số điện thoại liên hệ."
                                : "Bạn chưa cập nhật Địa chỉ giao hàng."
                        }
                    </p>
                </div>
                
                <Link 
                    href="/profile" 
                    className="flex items-center gap-1 text-sm font-bold text-orange-700 hover:text-orange-900 underline decoration-2 underline-offset-2 transition-colors shrink-0"
                >
                    Cập nhật ngay <ArrowRight size={16} />
                </Link>
            </div>
        </div>
    );
}