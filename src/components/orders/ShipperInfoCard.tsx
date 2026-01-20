
'use client';

import React from 'react';
import { User, Phone, MapPin } from 'lucide-react';
import type { ShippingInfo } from '@/lib/sample-tracking-data';

const ShipperInfoCard: React.FC<{ info: ShippingInfo }> = ({ info }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-xl p-6">
        <div className="flex items-center justify-between">
            {/* Driver Info */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                    <User className="w-6 h-6 text-white" />
                </div>
                <div>
                    <p className="font-bold text-gray-900">{info.driverName}</p>
                    <p className="text-sm text-gray-600">Tài xế giao hàng</p>
                </div>
            </div>

            {/* Call Button */}
            <a 
                href={`tel:${info.driverPhone}`}
                className="flex items-center gap-2 px-4 py-2 bg-white text-green-600 rounded-lg font-semibold shadow-md hover:bg-gray-50 transition-colors"
            >
                <Phone className="w-4 h-4" />
                <span>Gọi điện</span>
            </a>
        </div>
        {/* Location Status */}
        <div className="mt-4 flex items-center gap-2 bg-white/60 px-4 py-2 rounded-lg">
            <MapPin className="w-4 h-4 text-red-500" />
            <span className="text-sm text-gray-700">Đang trên đường giao hàng đến bạn</span>
        </div>
    </div>
  );
};

export default ShipperInfoCard;
