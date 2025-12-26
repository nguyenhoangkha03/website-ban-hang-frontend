'use client';

import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';

interface OtpFormProps {
  phone?: string;
  type?: 'register' | 'forgot_password';
  onVerifySuccess?: (otp: string) => void; // Callback khi xác thực thành công
  isLoading?: boolean; // Trạng thái loading từ bên ngoài truyền vào
  onGoBack?: () => void; // Callback quay lại
}

export default function OtpForm({ phone = '09xxxxxxxx', type, onVerifySuccess, isLoading = false, onGoBack }: OtpFormProps) {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(new Array(6).fill('')); // Mảng 6 ký tự rỗng
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [internalLoading, setInternalLoading] = useState(false);

  // Focus ô đầu tiên khi mới vào
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Xử lý khi nhập
  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Chỉ cho phép số

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Tự động nhảy sang ô tiếp theo
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Xử lý xóa (Backspace)
  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Xử lý Paste (Dán cả chuỗi 123456)
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
    if (pastedData.every(char => /^\d$/.test(char))) {
      const newOtp = [...otp];
      pastedData.forEach((char, index) => {
        if (index < 6) newOtp[index] = char;
      });
      setOtp(newOtp);
      const focusIndex = Math.min(pastedData.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      alert("Vui lòng nhập đủ 6 số OTP");
      return;
    }

    // Nếu cha truyền callback xuống -> dùng callback (Logic Đăng ký)
    if (onVerifySuccess) {
      onVerifySuccess(otpCode);
      return;
    }

    // Fallback: Logic tự xử lý (Ví dụ: Quên mật khẩu)
    setInternalLoading(true);
    // Giả lập delay
    setTimeout(() => {
        setInternalLoading(false);
        // Logic điều hướng cũ
        if (type === 'forgot_password') {
            router.push('/reset-password');
        } else {
            alert('Xác thực thành công (Chế độ test)');
        }
    }, 1000);
  };

  const loadingState = isLoading || internalLoading;

  return (
    <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center animate-in fade-in zoom-in duration-500 delay-100">
      
      {/* Icon Khiên xanh */}
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <ShieldCheck className="text-blue-600 w-8 h-8" />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">Xác Minh OTP</h2>
      <p className="text-gray-500 text-sm mb-8">
        Nhập mã xác thực gửi đến <span className="font-bold text-gray-800">{phone}</span>
      </p>

      {/* 👇👇👇 ĐÂY LÀ PHẦN BỊ THIẾU TRONG HÌNH 👇👇👇 */}
      <div className="flex justify-center gap-3 mb-8">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { if (el) inputRefs.current[index] = el }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            placeholder="#"
            className="w-12 h-14 border border-gray-200 rounded-lg text-center text-2xl font-bold text-gray-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder-gray-300"
          />
        ))}
      </div>
      {/* 👆👆👆 KẾT THÚC PHẦN BỊ THIẾU 👆👆👆 */}

      {/* Nút Xác thực */}
      <button
        onClick={handleVerify}
        disabled={loadingState}
        className="w-full bg-[#1A56DB] hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg flex justify-center items-center gap-2 transition-all disabled:opacity-70 shadow-lg shadow-blue-200"
      >
        {loadingState ? <Loader2 className="animate-spin" /> : 'Xác thực'}
      </button>

      {/* Nút Quay lại */}
      <div className="mt-6">
        <button 
          onClick={onGoBack || (() => window.history.back())} 
          className="flex items-center justify-center gap-2 mx-auto text-blue-600 text-sm font-medium hover:underline"
        >
          <ArrowLeft size={16} />
          Quay lại Đăng nhập
        </button>
      </div>
    </div>
  );
}