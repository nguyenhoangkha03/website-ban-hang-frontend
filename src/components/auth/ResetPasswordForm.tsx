'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, KeyRound, CheckCircle, AlertCircle } from 'lucide-react';

// Validate & Hooks
import { NewPasswordSchema, NewPasswordType } from '@/lib/validations/auth.validation';
import { useSetPassword } from '@/hooks/api/useAuthApi';

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Lấy params từ URL
  const phone = searchParams.get('phone');
  const uid = searchParams.get('uid');

  const [isSuccess, setIsSuccess] = useState(false);

  // 1. Setup Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPasswordType>({
    resolver: zodResolver(NewPasswordSchema),
  });

  // 2. Hook API
  const { mutate: setPassword, isPending, error: apiError } = useSetPassword();

  // 3. Xử lý Submit
  const onSubmit = (data: NewPasswordType) => {
    if (!phone || !uid) {
      alert("Thiếu thông tin xác thực (UID/Phone). Vui lòng thử lại quy trình quên mật khẩu.");
      return;
    }

    setPassword({
      phone,
      uid,
      password: data.password
    }, {
      onSuccess: () => {
        setIsSuccess(true);
        // Chuyển hướng sau 2 giây
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    });
  };

  // --- GIAO DIỆN THÀNH CÔNG ---
  if (isSuccess) {
    return (
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-[#009f4d] w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Đổi Mật Khẩu Thành Công!</h2>
        <p className="text-gray-500 mb-6">
          Mật khẩu của bạn đã được cập nhật. <br/> Đang chuyển hướng đến trang đăng nhập...
        </p>
        <Loader2 className="animate-spin mx-auto text-[#009f4d]" />
      </div>
    );
  }

  // --- GIAO DIỆN FORM ---
  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-500 delay-100">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <KeyRound className="text-[#009f4d] w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Đặt Lại Mật Khẩu</h2>
        <p className="text-gray-500 text-sm mt-2">
          {phone ? `Tài khoản: ${phone}` : 'Nhập mật khẩu mới cho tài khoản của bạn'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        {/* Mật khẩu mới */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
          <input 
            type="password"
            {...register('password')}
            className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all ${
              errors.password 
               ? 'border-red-500 bg-red-50' 
               : 'border-gray-200 focus:border-[#009f4d] focus:ring-4 focus:ring-green-500/10'
            }`}
            placeholder="••••••••••••"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>
        
        {/* Xác nhận mật khẩu */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
          <input 
            type="password"
            {...register('confirmPassword')}
            className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all ${
              errors.confirmPassword
               ? 'border-red-500 bg-red-50' 
               : 'border-gray-200 focus:border-[#009f4d] focus:ring-4 focus:ring-green-500/10'
            }`}
            placeholder="••••••••••••"
          />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>

        {/* Lỗi API */}
        {apiError && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 border border-red-100">
            <AlertCircle size={16} className="shrink-0" />
            <span>{(apiError as any)?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.'}</span>
          </div>
        )}

        {/* Nút Submit */}
        <button 
          disabled={isPending}
          type="submit"
          className="w-full bg-[#009f4d] hover:bg-green-700 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 transition-all shadow-lg shadow-green-600/20 disabled:opacity-70"
        >
          {isPending ? <Loader2 className="animate-spin" /> : 'Đổi mật khẩu'}
        </button>
      </form>
    </div>
  );
}