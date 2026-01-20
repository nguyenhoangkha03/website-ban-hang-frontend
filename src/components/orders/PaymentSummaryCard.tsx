
'use client';

import React from 'react';
import type { OrderInfo } from '@/lib/sample-tracking-data';

const PaymentSummaryCard: React.FC<{ info: OrderInfo }> = ({ info }) => {

    const formatPrice = (price: number) => {
        return price.toLocaleString('vi-VN') + '₫';
    }

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Thanh toán</h3>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-600">Tổng tiền hàng</span>
                    <span className="text-gray-900">{formatPrice(info.total - info.shippingFee + info.discount)}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span className="text-gray-900">{formatPrice(info.shippingFee)}</span>
                </div>
                {info.discount > 0 && (
                    <div className="flex justify-between">
                        <span className="text-gray-600">Giảm giá</span>
                        <span className="text-green-600">-{formatPrice(info.discount)}</span>
                    </div>
                )}
                <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">Tổng thanh toán</span>
                        <span className="text-2xl font-bold text-green-600">{formatPrice(info.total)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSummaryCard;
