'use client';

import { useState, useMemo } from 'react';
import type { FC, ReactNode } from 'react';
import {
  Bell,
  ClipboardList,
  LogOut,
  Package,
  RefreshCw,
  ShoppingBag,
  User,
} from 'lucide-react';
import { useOrders, Order } from '@/hooks/api/useOrders';
import OrderHistorySkeleton from '@/components/OrderHistorySkeleton';

type Status = 'all' | 'pending' | 'shipping' | 'delivered' | 'cancelled';

// --- HELPER FUNCTIONS & COMPONENTS ---
const formatPrice = (price: number) => {
  return `${price.toLocaleString('vi-VN')}đ`;
};

const statusInfo = {
  pending: {
    label: 'Chờ xác nhận',
    icon: RefreshCw,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  shipping: {
    label: 'Đang giao',
    icon: Package,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  delivered: {
    label: 'Đã giao',
    icon: Package,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  cancelled: {
    label: 'Đã hủy',
    icon: Package,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
  },
};

import Sidebar from '@/components/user-profile/Sidebar';
import { useUserProfile } from '@/hooks/api/useUserProfile';

const StatusBadge: FC<{ status: Order['status'] }> = ({ status }) => {
  const { label, icon: Icon, color, bgColor, borderColor } = statusInfo[status];
  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium ${bgColor} ${color} border ${borderColor}`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </div>
  );
};

const OrderCard: FC<{ order: Order }> = ({ order }) => (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
        <div className="bg-gray-50 px-6 py-3 flex justify-between items-center rounded-t-lg">
            <StatusBadge status={order.status} />
            <span className="text-sm text-gray-500">Mã đơn hàng: {order.orderNumber}</span>
        </div>
        <div className="p-6 space-y-4">
            {order.items.map(item => (
                <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                        <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            {item.supplier && (
                              <p className="text-sm text-gray-500">
                                Cung cấp bởi: 
                                <a href={`/suppliers/${item.supplier.id}`} className="text-indigo-600 hover:underline ml-1">
                                  {item.supplier.name}
                                </a>
                              </p>
                            )}
                            <p className="text-sm text-gray-500">SL: {item.quantity} x {formatPrice(item.price)}</p>
                        </div>
                    </div>
                    <p className="font-semibold text-gray-900">{formatPrice(item.quantity * item.price)}</p>
                </div>
            ))}
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center rounded-b-lg">
             <div className="text-right">
                <span className="text-sm text-gray-600">Tổng tiền: </span>
                <span className="text-2xl font-bold text-gray-900">{formatPrice(order.total)}</span>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 transition-colors">
                <RefreshCw className="w-4 h-4" />
                Mua lại
            </button>
        </div>
    </div>
);

const EmptyState = () => (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-gray-50 rounded-lg border-2 border-dashed">
        <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-800">Chưa có đơn hàng nào</h3>
        <p className="text-gray-500 mt-2">Bạn chưa có đơn hàng nào trong danh mục này.</p>
    </div>
);

// --- MAIN PAGE COMPONENT ---
const OrderHistoryPage: FC = () => {
  const [activeTab, setActiveTab] = useState<Status>('all');
  const { data: orders, isLoading, isError } = useOrders();
  const { data: userProfileData } = useUserProfile();

  const tabs: { id: Status; label: string }[] = [
    { id: 'all', label: 'Tất cả' },
    { id: 'pending', label: 'Chờ xác nhận' },
    { id: 'shipping', label: 'Đang giao' },
    { id: 'delivered', label: 'Đã giao' },
    { id: 'cancelled', label: 'Đã hủy' },
  ];
  
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter(order => activeTab === 'all' || order.status === activeTab);
  }, [orders, activeTab]);

  if (isLoading) {
    return <OrderHistorySkeleton />;
  }

  if (isError) {
    return <div className="text-center py-20">Có lỗi xảy ra khi tải lịch sử đơn hàng.</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <Sidebar active="orders" userName={userProfileData?.fullName} />
          <main className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Lịch sử mua hàng</h1>
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
            
            <div>
                {filteredOrders.length > 0 ? (
                    filteredOrders.map(order => <OrderCard key={order.id} order={order} />)
                ) : (
                    <EmptyState />
                )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;
