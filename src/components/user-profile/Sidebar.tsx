
'use client';

import type { FC } from 'react';
import Link from 'next/link';
import {
  Bell,
  LogOut,
  User,
  CreditCard,
  ClipboardList,
  Smartphone
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth'; // Assuming a simple auth hook exists or will be created

interface SidebarProps {
  active: 'profile' | 'orders' | 'addresses' | 'payment' | 'notifications';
  userName?: string;
}

const Sidebar: FC<SidebarProps> = ({ active, userName }) => {
    const { logout } = useAuth();

    const menuItems = [
        { id: 'profile', label: 'Tài khoản của tôi', icon: User, href: '/profile' },
        { id: 'orders', label: 'Đơn mua', icon: ClipboardList, href: '/orders' },
        { id: 'addresses', label: 'Số địa chỉ', icon: Smartphone, href: '/addresses' }, // Placeholder
        { id: 'payment', label: 'Phương thức thanh toán', icon: CreditCard, href: '/payment' },
        { id: 'notifications', label: 'Thông báo', icon: Bell, href: '#' }, // Placeholder
    ];

    const isActive = (id: string) => id === active;

    const handleLogout = () => {
        logout();
        // The useAuth hook should handle the redirect
    };

    return (
        <aside className="w-64 flex-shrink-0 bg-white p-6 hidden lg:block rounded-lg shadow-sm">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center shadow-md">
                    <User className="w-8 h-8 text-white" />
                </div>
                <div>
                    <p className="font-bold text-lg">{userName || 'Loading...'}</p>
                    <Link href="/profile" className="text-sm text-blue-600 hover:underline">Edit Profile</Link>
                </div>
            </div>
            <nav className="space-y-2">
                {menuItems.map(item => (
                     <Link key={item.id} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive(item.id) 
                        ? 'bg-blue-50 text-blue-600 font-semibold' 
                        : 'text-gray-700 hover:bg-gray-100'
                     }`}>
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>
            <div className="mt-8 pt-4 border-t border-gray-200">
                 <button onClick={handleLogout} className="flex items-center w-full gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600">
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
