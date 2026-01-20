'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, MapPin, ArrowRight, CheckCircle, Package, Home, Truck, LoaderCircle, AlertTriangle } from 'lucide-react';
import { useOrderTracking } from '@/hooks/api/useOrderTracking';
import { OrderTimelineStep } from '@/types';

const iconMap: Record<OrderTimelineStep['iconName'], React.ElementType> = {
  CheckCircle: CheckCircle,
  Package: Package,
  Truck: Truck,
  Home: Home,
};

interface TimelineItemProps {
  step: OrderTimelineStep;
  isCompleted: boolean;
  isActive: boolean;
  isLast: boolean;
}

const TimelineItem = ({ step, isCompleted, isActive, isLast }: TimelineItemProps) => {
  const activeColor = 'bg-gradient-to-br from-indigo-600 to-purple-600';
  const inactiveColor = 'bg-gray-300';
  const IconComponent = iconMap[step.iconName] || Package;

  return (
    <div className="flex">
      <div className="flex flex-col items-center mr-6">
        <div
          className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-white transition-all duration-700
            ${isCompleted ? `${activeColor} shadow-lg scale-110` : inactiveColor}
            ${isActive ? 'animate-ping-slow' : ''}`}
        >
          <IconComponent />
        </div>
        {!isLast && (
          <div
            className={`w-0.5 h-16 transition-all duration-700 ${isCompleted ? activeColor : inactiveColor}`}
          />
        )}
      </div>
      <div className={`pb-16 transition-opacity duration-500 ${isCompleted ? 'opacity-100' : 'opacity-60'}`}>
        <h4 className="text-lg font-bold text-gray-800">{step.title} {isActive && <span className="text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-full px-2 py-0.5 ml-2">Hiện tại</span>}</h4>
        <p className="text-sm text-gray-500">{step.date || 'Chưa cập nhật'}</p>
      </div>
    </div>
  );
};

const TrackingComponent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchParamOrderId = searchParams.get('orderId');
  const orderId = searchParamOrderId !== 'undefined' ? searchParamOrderId || '' : '';

  const [searchValue, setSearchValue] = useState(orderId);
  const { data: orderDetails, isLoading, error } = useOrderTracking(orderId);

  const formatPrice = (price: number) => price.toLocaleString('vi-VN') + 'đ';

  const handleSearch = () => {
    router.push(`/tracking?orderId=${searchValue}`);
  };

  const renderContent = () => {
    if (!orderId) {
      return (
        <div className="text-center py-20 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800">Tra cứu đơn hàng của bạn</h2>
          <p className="text-gray-600 mt-2">Vui lòng nhập mã đơn hàng vào ô tìm kiếm ở trên để xem chi tiết.</p>
        </div>
      );
    }
    
    if (isLoading) {
      return (
         <div className="text-center py-20 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg flex flex-col items-center">
            <LoaderCircle className="w-12 h-12 text-indigo-600 animate-spin"/>
            <h2 className="text-2xl font-bold text-gray-800 mt-4">Đang tải thông tin đơn hàng...</h2>
            <p className="text-gray-600 mt-2">Vui lòng chờ trong giây lát.</p>
        </div>
      );
    }

    if (error) {
      return (
         <div className="text-center py-20 bg-red-50/70 backdrop-blur-sm rounded-2xl shadow-lg flex flex-col items-center">
            <AlertTriangle className="w-12 h-12 text-red-600"/>
            <h2 className="text-2xl font-bold text-red-800 mt-4">Không thể tìm thấy đơn hàng</h2>
            <p className="text-red-600 mt-2">Mã đơn hàng có thể không đúng hoặc đã xảy ra lỗi. Vui lòng thử lại.</p>
        </div>
      );
    }

    if (orderDetails) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Trạng thái đơn hàng</h3>
              <div>
                {orderDetails.timeline.map((step, index) => (
                  <TimelineItem
                    key={step.id}
                    step={step}
                    isCompleted={step.id <= orderDetails.currentStatusId}
                    isActive={step.id === orderDetails.currentStatusId}
                    isLast={index === orderDetails.timeline.length - 1}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-2xl font-bold text-gray-800">{orderDetails.id}</h4>
                  <p className="text-sm text-gray-500">Dự kiến giao: {orderDetails.estimatedDelivery}</p>
                </div>
                <span className="font-semibold text-green-700 bg-green-100 rounded-full px-3 py-1">{orderDetails.status}</span>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-purple-100 rounded-xl p-4">
                  <div className="flex items-center">
                    <MapPin className="w-6 h-6 text-indigo-600 mr-3" />
                    <div>
                        <h5 className="font-semibold text-gray-800">Địa chỉ giao hàng</h5>
                        <p className="text-sm text-gray-600">{orderDetails.address}</p>
                    </div>
                  </div>
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Chi tiết đơn hàng</h3>
              <div className="space-y-4">
                {orderDetails.products.map((p, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-gray-200 pb-3 last:border-0">
                        <div>
                            <p className="font-semibold text-gray-800">{p.name}</p>
                            <p className="text-sm text-gray-500">Số lượng: {p.quantity}</p>
                        </div>
                        <p className="font-medium">{formatPrice(p.price)}</p>
                    </div>
                ))}
                <div className="flex justify-between items-center border-t-2 border-gray-300 pt-3 mt-4">
                  <p className="text-lg font-bold text-gray-900">Tổng cộng</p>
                  <p className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">{formatPrice(orderDetails.total)}</p>
                </div>
              </div>
            </div>
             <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 flex justify-between items-center group cursor-pointer hover:bg-white transition">
                <p className="font-semibold text-gray-700 group-hover:text-indigo-600">Cần hỗ trợ với đơn hàng?</p>
                <ArrowRight className="text-gray-500 group-hover:text-indigo-600 group-hover:translate-x-1 transition-transform"/>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-down">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
            Theo dõi đơn hàng
          </h1>
          <p className="mt-2 text-lg text-gray-600">Kiểm tra trạng thái và lịch trình đơn hàng của bạn.</p>
        </div>
        <div className="relative mb-12 bg-white rounded-2xl shadow-xl p-2 flex items-center transition-transform duration-300 hover:scale-[1.02]">
          <Search className="absolute left-5 text-gray-400" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Nhập mã đơn hàng của bạn..."
            className="w-full pl-12 pr-4 py-3 border-2 border-transparent focus:outline-none focus:border-indigo-500 rounded-xl transition-colors"
          />
          <button 
            onClick={handleSearch}
            className="ml-2 px-8 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
          >
            Tra cứu
          </button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

// Wrap the component in Suspense because useSearchParams() requires it.
const TrackingPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <TrackingComponent />
  </Suspense>
);

export default TrackingPage;
