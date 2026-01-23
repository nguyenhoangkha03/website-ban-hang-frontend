'use client';

import { useState } from 'react';
import { Phone, CheckCircle, Edit, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios'; // ✅ FIX: Dùng 'api' thay vì 'http'

interface VerifyPhoneModalProps {
  isOpen: boolean;
  phone: string;
  onClose: () => void;
}

export default function VerifyPhoneModal({ isOpen, phone, onClose }: VerifyPhoneModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Nếu không mở thì không render gì cả
  if (!isOpen) return null;

  // 1. Xử lý: "Tôi vẫn dùng số này"
  const handleConfirm = async () => {
    setLoading(true);
    try {
        // ✅ FIX: Đường dẫn API chuẩn theo convention
        // Backend: POST /api/customer/account/confirm-phone
        await api.post('/customer/account/confirm-phone'); 
        
        onClose(); // Đóng modal
    } catch (error: any) {
        console.error("Lỗi xác nhận số điện thoại:", error);
        const msg = error?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
        alert(msg);
    } finally {
        setLoading(false);
    }
  };

  // 2. Xử lý: "Đổi số khác"
  const handleChange = () => {
    onClose();
    // Chuyển hướng sang trang Profile (hoặc trang settings)
    router.push('/profile?tab=security'); 
  };

  return (
    // z-[9999] để đảm bảo nó đè lên tất cả các thành phần khác (kể cả Header)
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      
      {/* Modal Content */}
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-gray-100 scale-100 animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center">
            
            {/* Icon Warning */}
            <div className="w-14 h-14 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center mb-4 ring-4 ring-yellow-50/50">
                <AlertTriangle size={28} />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">Xác thực liên lạc</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Đã một thời gian trôi qua. Để đảm bảo đơn hàng được giao chính xác, bạn vui lòng xác nhận vẫn đang sử dụng số điện thoại này.
            </p>
            
            {/* Phone Display */}
            <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 mb-6 flex items-center justify-center gap-3 w-full">
                <Phone size={18} className="text-[#009f4d]"/>
                <span className="text-lg font-bold text-gray-800 tracking-wide">{phone}</span>
            </div>

            {/* Actions */}
            <div className="space-y-3 w-full">
                {/* Nút xác nhận (Primary) */}
                <button 
                    onClick={handleConfirm}
                    disabled={loading}
                    className="w-full bg-[#009f4d] hover:bg-green-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-600/20 disabled:opacity-70"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">Đang xử lý...</span>
                    ) : (
                        <><CheckCircle size={18} /> Vẫn dùng số này</>
                    )}
                </button>
                
                {/* Nút đổi số (Secondary) */}
                <button 
                    onClick={handleChange}
                    className="w-full bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
                >
                    <Edit size={18} /> Đổi số điện thoại
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}