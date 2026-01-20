

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Truck, Copy, MessageCircle } from 'lucide-react';
import { sampleOrderDetails } from '@/lib/sample-tracking-data'; // Import mock data

// Import all the new components
import TrackingTimeline from '@/components/orders/TrackingTimeline';
import ShipperInfoCard from '@/components/orders/ShipperInfoCard';
import DeliveryAddressCard from '@/components/orders/DeliveryAddressCard';
import ShippingInfoCard from '@/components/orders/ShippingInfoCard';
import PaymentSummaryCard from '@/components/orders/PaymentSummaryCard';
import type { OrderItem } from '@/lib/sample-tracking-data';


// --- Reusable Components (can be moved to separate files later) ---

const StatusBanner = () => {
    const { orderInfo } = sampleOrderDetails;
    const progressPercentage = '80%'; // Hardcoded for "shipping" status

    return (
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <Truck className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold mb-1">{orderInfo.statusText}</h2>
                    <p className="text-base opacity-90">Dự kiến giao: {orderInfo.estimatedDelivery}</p>
                </div>
            </div>
            <div className="mt-6">
                <div className="h-2 bg-white/30 rounded-full">
                    <div 
                        className="h-2 bg-white rounded-full transition-all duration-500" 
                        style={{ width: progressPercentage }}
                    ></div>
                </div>
                <div className="flex justify-between mt-4 text-sm">
                    <span>Đã đặt hàng</span>
                    <span>Đang vận chuyển</span>
                    <span className="opacity-70">Hoàn thành</span>
                </div>
            </div>
        </div>
    );
};

const ProductList: React.FC<{ items: OrderItem[] }> = ({ items }) => {
    const formatPrice = (price: number) => price.toLocaleString('vi-VN') + '₫';

    return (
        <div className="space-y-4">
            {items.map(item => (
                <div key={item.id} className="bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex gap-4">
                        <Image src={item.image} alt={item.name} width={96} height={96} className="object-cover rounded-xl shadow-md" />
                        <div className="flex-1">
                            <p className="font-semibold text-gray-900 mb-1">{item.name}</p>
                            <p className="text-sm text-gray-600 mb-2">{item.variant}</p>
                            <div className="flex justify-between items-end">
                                <span className="text-sm text-gray-600">x{item.quantity}</span>
                                <span className="text-lg font-bold text-green-600">{formatPrice(item.price)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
             <div className="pt-6 mt-6 border-t">
                <button className="w-full py-3 border-2 border-green-600 text-green-600 rounded-xl font-semibold hover:bg-green-50 flex items-center justify-center gap-2 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span>Liên hệ người bán</span>
                </button>
            </div>
        </div>
    );
};


// --- Main Page Component ---

const OrderTrackingPage = () => {
    const { orderInfo, shippingInfo, recipientInfo, items, trackingSteps } = sampleOrderDetails;
    const [activeTab, setActiveTab] = useState<'tracking' | 'products'>('tracking');

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Đã sao chép!');
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Sticky Header */}
            <header className="sticky top-0 bg-white/80 backdrop-blur-lg z-40 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center gap-4">
                            <Link href="/orders" className="p-2 rounded-lg hover:bg-gray-100">
                                <ChevronLeft className="w-6 h-6 text-gray-700" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Chi tiết đơn hàng</h1>
                                <p className="text-sm text-gray-600">Mã đơn hàng: {orderInfo.orderNumber}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => copyToClipboard(orderInfo.orderNumber)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-green-600 hover:bg-green-50 transition-colors"
                        >
                            <Copy className="w-4 h-4" />
                            <span>Sao chép</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <StatusBanner />
                        
                        <div className="bg-white rounded-xl shadow-md border border-gray-100">
                            {/* Tab Navigation */}
                            <div className="flex border-b border-gray-100">
                                <button 
                                    onClick={() => setActiveTab('tracking')}
                                    className={`flex-1 px-6 py-4 font-semibold transition-colors ${activeTab === 'tracking' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600 hover:text-gray-900'}`}
                                >
                                    Theo dõi đơn hàng
                                </button>
                                <button 
                                    onClick={() => setActiveTab('products')}
                                    className={`flex-1 px-6 py-4 font-semibold transition-colors ${activeTab === 'products' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600 hover:text-gray-900'}`}
                                >
                                    Sản phẩm ({items.length})
                                </button>
                            </div>

                            {/* Tab Content */}
                            <div className="p-6">
                                {activeTab === 'tracking' ? (
                                    <>
                                        <ShipperInfoCard info={shippingInfo} />
                                        <div className="mt-6">
                                            <TrackingTimeline steps={trackingSteps} />
                                        </div>
                                    </>
                                ) : (
                                    <ProductList items={items} />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Sidebar) */}
                    <div className="space-y-6 lg:sticky lg:top-28">
                        <DeliveryAddressCard info={recipientInfo} />
                        <ShippingInfoCard info={shippingInfo} />
                        <PaymentSummaryCard info={orderInfo} />
                        {/* Other sidebar cards like Rating and Help can be added here */}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OrderTrackingPage;
