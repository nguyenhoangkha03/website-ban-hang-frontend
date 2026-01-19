'use client';

import { useState } from 'react';
import { Phone, CheckCircle, Edit, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { http } from '@/lib/http';

interface Props {
  isOpen: boolean;
  phone: string;
  onClose: () => void;
}

export default function VerifyPhoneModal({ isOpen, phone, onClose }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Xử lý: "Tôi vẫn dùng số này"
  const handleConfirm = async () => {
    setLoading(true);
    try {
        await http.post('/cs/customers/confirm-phone');
        onClose(); // Đóng modal
    } catch (error) {
        alert('Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
        setLoading(false);
    }
  };

  // Xử lý: "Đổi số khác"
  const handleChange = () => {
    onClose();
    router.push('/profile'); // Chuyển sang trang Profile để sửa
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-gray-100">
        <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle size={28} />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">Kiểm tra thông tin liên hệ</h3>
            <p className="text-gray-500 text-sm mb-6">
                Đã 3 tháng trôi qua. Để đảm bảo đơn hàng được giao đúng, bạn vẫn đang sử dụng số điện thoại này chứ?
            </p>
            
            <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 mb-6 flex items-center gap-3 w-full justify-center">
                <Phone size={18} className="text-gray-400"/>
                <span className="text-lg font-bold text-gray-800 tracking-wide">{phone}</span>
            </div>

            <div className="space-y-3 w-full">
                <button 
                    onClick={handleConfirm}
                    disabled={loading}
                    className="w-full bg-[#009f4d] hover:bg-green-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
                >
                    {loading ? 'Đang xử lý...' : <><CheckCircle size={18} /> Vẫn dùng số này</>}
                </button>
                
                <button 
                    onClick={handleChange}
                    className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
                >
                    <Edit size={18} /> Đổi số khác
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}