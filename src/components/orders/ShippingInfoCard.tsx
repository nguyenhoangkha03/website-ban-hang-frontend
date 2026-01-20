
'use client';

import React from 'react';
import { Truck, Copy } from 'lucide-react';
import type { ShippingInfo } from '@/lib/sample-tracking-data';
import { toast } from 'react-hot-toast';

const ShippingInfoCard: React.FC<{ info: ShippingInfo }> = ({ info }) => {

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Đã sao chép!');
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
            <Truck className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-gray-900">Thông tin vận chuyển</h3>
        </div>
        <div className="space-y-2 text-sm">
            <div className="flex justify-between">
                <span className="text-gray-600">Đơn vị vận chuyển</span>
                <span className="font-semibold text-gray-900">{info.courier}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-600">Mã vận đơn</span>
                <button 
                    onClick={() => copyToClipboard(info.trackingNumber)}
                    className="font-semibold text-green-600 hover:text-green-700 flex items-center gap-1.5 group"
                >
                    <span>{info.trackingNumber}</span>
                    <Copy className="w-3 h-3 text-gray-400 group-hover:text-green-600 transition-colors" />
                </button>
            </div>
        </div>
    </div>
  );
};

export default ShippingInfoCard;
