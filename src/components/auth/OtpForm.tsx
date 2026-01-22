'use client';

import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react';
import { Loader2, ArrowLeft, ShieldCheck, RefreshCw } from 'lucide-react'; // Thêm icon Refresh
import { useSendOtp } from '@/hooks/api/useAuthApi'; // Import hook gửi lại OTP

interface OtpFormProps {
  phone: string;
  type?: 'register' | 'forgot_password';
  onVerifySuccess: (otp: string) => void;
  isLoading?: boolean;
  onGoBack: () => void;
}

export default function OtpForm({ 
  phone, 
  onVerifySuccess, 
  isLoading = false, 
  onGoBack 
}: OtpFormProps) {
  
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // Logic đếm ngược gửi lại mã
  const [countdown, setCountdown] = useState(60); 
  const { mutate: resendOtp, isPending: isResending } = useSendOtp();

  useEffect(() => {
    // Focus ô đầu tiên khi mount
    if (inputRefs.current[0]) inputRefs.current[0].focus();

    // Timer đếm ngược
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Handle Input Change
  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    // Lấy ký tự cuối cùng nhập vào
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace
  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle Paste
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
    if (pastedData.every(char => /^\d$/.test(char))) {
      const newOtp = [...otp];
      pastedData.forEach((char, index) => { if (index < 6) newOtp[index] = char; });
      setOtp(newOtp);
      const focusIndex = Math.min(pastedData.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  // Handle Resend
  const handleResend = () => {
    if (countdown > 0 || isResending) return;
    
    resendOtp(phone, {
      onSuccess: () => {
        setCountdown(60);
        // Có thể thêm toast thông báo ở đây nếu muốn
        alert("Đã gửi lại mã xác thực!");
      }
    });
  };

  // Handle Verify
  const handleVerify = () => {
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      alert("Vui lòng nhập đủ 6 số OTP");
      return;
    }
    onVerifySuccess(otpCode);
  };

  return (
    <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center animate-in fade-in zoom-in duration-500">
      
      {/* Icon */}
      <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <ShieldCheck className="text-[#009f4d] w-8 h-8" />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">Xác Minh OTP</h2>
      <p className="text-gray-500 text-sm mb-8">
        Mã xác thực đã được gửi đến số <span className="font-bold text-gray-800">{phone}</span>
      </p>

      {/* Input OTP */}
      <div className="flex justify-center gap-2 sm:gap-3 mb-8">
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
            placeholder="•"
            className={`w-10 h-12 sm:w-12 sm:h-14 border rounded-lg text-center text-2xl font-bold outline-none transition-all ${
                digit 
                ? 'border-[#009f4d] text-gray-800 ring-1 ring-[#009f4d]/30' 
                : 'border-gray-300 text-gray-400 focus:border-[#009f4d]'
            }`}
          />
        ))}
      </div>

      {/* Button Verify */}
      <button
        onClick={handleVerify}
        disabled={isLoading || otp.join('').length < 6}
        className="w-full bg-[#009f4d] hover:bg-green-700 text-white font-bold py-3.5 rounded-lg flex justify-center items-center gap-2 transition-all disabled:opacity-70 shadow-lg shadow-green-600/20"
      >
        {isLoading ? <Loader2 className="animate-spin" /> : 'Xác thực ngay'}
      </button>

      {/* Resend Logic */}
      <div className="mt-6 text-sm text-gray-600">
        Bạn chưa nhận được mã?{' '}
        {countdown > 0 ? (
          <span className="text-gray-400 font-medium">Gửi lại sau {countdown}s</span>
        ) : (
          <button 
            onClick={handleResend}
            disabled={isResending}
            className="text-[#009f4d] font-bold hover:underline inline-flex items-center gap-1"
          >
            {isResending && <Loader2 className="w-3 h-3 animate-spin" />}
            Gửi lại mã
          </button>
        )}
      </div>

      {/* Back Button */}
      <div className="mt-8 border-t border-gray-100 pt-4">
        <button 
          onClick={onGoBack} 
          className="flex items-center justify-center gap-2 mx-auto text-gray-500 text-sm hover:text-[#009f4d] transition-colors"
        >
          <ArrowLeft size={16} /> Quay lại
        </button>
      </div>
    </div>
  );
}