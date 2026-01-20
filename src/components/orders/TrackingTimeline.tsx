
'use client';

import React from 'react';
import { Package, CheckCircle, Box, Truck, Home, MapPin, Clock } from 'lucide-react';
import type { TrackingStep } from '@/lib/sample-tracking-data';

const iconMap: { [key: string]: React.ElementType } = {
  "Đã đặt hàng": Package,
  "Đã xác nhận": CheckCircle,
  "Đã đóng gói": Box,
  "Đang vận chuyển": Truck,
  "Giao hàng thành công": Home,
};

const TimelineStep: React.FC<{ step: TrackingStep; isLast: boolean }> = ({ step, isLast }) => {
  const Icon = iconMap[step.status] || Package;
  const isCompleted = step.completed;

  return (
    <div className="flex gap-6">
      {/* Column 1: Icon & Connector Line */}
      <div className="flex flex-col items-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg
          ${isCompleted ? 'bg-gradient-to-br from-green-500 to-emerald-500' : 'bg-gray-200'}`}>
          <Icon className={`w-6 h-6 ${isCompleted ? 'text-white' : 'text-gray-400'}`} />
        </div>
        {!isLast && (
          <div className={`w-0.5 h-16 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`}></div>
        )}
      </div>

      {/* Column 2: Information Card */}
      <div className="flex-1 pb-12">
          <div className={`bg-white rounded-xl p-5 shadow-md hover:shadow-lg border border-gray-100 transition-shadow duration-300 ${!isCompleted ? 'opacity-60' : ''}`}>
              <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900">{step.status}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{step.timestamp}</span>
                  </div>
              </div>
              <p className="text-sm text-gray-600">{step.description}</p>
              {step.location && (
                  <div className="mt-3 inline-flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                      <MapPin className="w-3 h-3 text-red-500" />
                      <span className="text-xs text-gray-600">{step.location}</span>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};


const TrackingTimeline: React.FC<{ steps: TrackingStep[] }> = ({ steps }) => {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-4">Lịch sử vận chuyển</h2>
      <div>
        {steps.map((step, index) => (
          <TimelineStep key={step.id} step={step} isLast={index === steps.length - 1} />
        ))}
      </div>
    </div>
  );
};

export default TrackingTimeline;
