
'use client';

import React from 'react';
import { MapPin, User } from 'lucide-react';
import type { RecipientInfo } from '@/lib/sample-tracking-data';

const DeliveryAddressCard: React.FC<{ info: RecipientInfo }> = ({ info }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-gray-900">Địa chỉ nhận hàng</h3>
        </div>
        <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-gray-400 mt-1" />
                <div>
                    <p className="font-semibold text-gray-800">{info.name}</p>
                    <p className="text-gray-600">{info.phone}</p>
                </div>
            </div>
             <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                <p className="text-gray-600 leading-relaxed">{info.address}</p>
            </div>
        </div>
    </div>
  );
};

export default DeliveryAddressCard;
