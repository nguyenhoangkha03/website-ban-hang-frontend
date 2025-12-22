'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { validatePhone } from '@/src/lib/validations/validation';
import { sendOtp } from '@/src/lib/mockAuth';

export default function ForgotPasswordForm() {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneErr = validatePhone(phone);
    if (phoneErr) return setError(phoneErr);

    setIsLoading(true);
    // Gửi OTP (Giả lập)
    await sendOtp(phone);
    setIsLoading(false);
    
    // Chuyển sang trang OTP
    window.location.href = `/verify-otp?phone=${phone}&type=forgot_password`;
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-2">Quên Mật Khẩu?</h2>
      <p className="text-gray-500 text-sm mb-6">
        Nhập số điện thoại để nhận mã OTP đặt lại mật khẩu.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input 
            type="tel" 
            value={phone}
            onChange={(e) => {
               if (/^\d*$/.test(e.target.value)) setPhone(e.target.value);
            }}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-500 outline-none"
            placeholder="Số điện thoại"
            maxLength={10}
          />
        </div>

        {error && <p className="text-red-500 text-sm text-left">{error}</p>}

        <button 
          disabled={isLoading}
          className="w-full bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold py-3 rounded-lg flex justify-center items-center transition-colors"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : 'Gửi mã OTP'}
        </button>
      </form>

      <div className="mt-6">
        <Link href="/login" className="text-blue-600 text-sm hover:underline font-medium">
          Hủy bỏ
        </Link>
      </div>
    </div>
  );
}