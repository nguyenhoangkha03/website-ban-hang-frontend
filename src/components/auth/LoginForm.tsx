'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { GoogleLogo, FacebookLogo } from '@/src/icons/SocialIcons';

import { LoginSchema, LoginFormType } from '@/lib/validations/auth';
import { useLogin, useSocialLogin } from '@/hooks/api/useAuth';

interface LoginFormProps {
  onSwitchToRegister?: () => void;
}

export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  
  // 1. Setup React Hook Form + Zod Resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      phone: '',
      password: '',
    },
  });

  // 2. Gọi Hook React Query (đã cấu hình ở Giai đoạn 1)
  const { mutate: login, isPending, error: apiError } = useLogin();

  // Hàm xử lý Submit
  const onSubmit = (data: LoginFormType) => {
    console.log("Đang gọi API Login thật với dữ liệu:", data);
    // Gọi hàm login từ hook
    login(data);
  };


  // Hook login social
  const { mutate: loginSocial } = useSocialLogin();
  const handleSocialClick = (provider: 'google' | 'facebook') => {
    loginSocial(provider);
  };

  return (
    <div className="w-full max-w-md p-8 animate-in fade-in zoom-in duration-500 delay-100">

      {/* Header */}
      <div className="text-center mb-8">
      
        <h2 className="text-3xl font-bold text-gray-800">Đăng Nhập</h2>
       
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Input Phone */}
        <div>
          <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
          <input
            {...register('phone')} // Tự động bind state và validation
            className={`w-full px-4 py-3 rounded-lg border-2 outline-none mt-1 transition-all ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-400 focus:ring-2 focus:ring-green-500'
              }`}
            placeholder="09xxxxxxxx"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>

        {/* Input Password */}
        <div>
          <div className="flex justify-between">
            <label className="text-sm font-medium text-gray-700">Mật khẩu</label>
            
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register('password')}
              className={`w-full px-4 py-3 rounded-lg border-2 outline-none mt-1 transition-all ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-400 focus:ring-2 focus:ring-green-500'
                }`}
              placeholder="••••••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 mt-1 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          <div className="flex justify-end">
              <Link href="/forgot-password" className="text-xs text-green-600 hover:underline">Quên mật khẩu?</Link>
          </div>
        </div>

        {/* Hiển thị lỗi từ API (nếu có) */}
        {apiError && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
            <AlertCircle size={16} />
            {/* @ts-ignore: Axios error handling shorthand */}
            <span>{apiError?.response?.data?.message || 'Đăng nhập thất bại'}</span>
          </div>
        )}

        {/* Nút Submit */}
        <button
          disabled={isPending}
          type="submit"
          className="w-full bg-[#009f4d] hover:bg-green-700 text-white font-bold py-3 rounded-lg border-2 border-[#009f4d] flex justify-center items-center gap-2 disabled:opacity-70 transition-all"
        >
          {isPending ? <Loader2 className="animate-spin" /> : 'Đăng Nhập'}
        </button>
      </form>

      {/* Social Login */}
      <div className="mt-8">
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-3 bg-zinc-50 text-gray-500">HOẶC</span></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleSocialClick('google')} // <--- GẮN SỰ KIỆN
            className="flex items-center justify-center gap-3 px-4 py-2.5 border-2 border-gray-400 rounded-lg hover:bg-red-50 transition-all"
          >
            <GoogleLogo /> <span className="text-sm font-semibold text-gray-700">Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialClick('facebook')} // <--- GẮN SỰ KIỆN
            className="flex items-center justify-center gap-3 px-4 py-2.5 border-2 border-gray-400 rounded-lg hover:bg-blue-100 transition-all"
          >
            <FacebookLogo /> <span className="text-sm font-semibold text-gray-700">Facebook</span>
          </button>
        </div>
      </div>

      {/* Footer - Only show on mobile */}
      <div className="mt-6 text-center text-sm text-gray-500 lg:hidden">
        Chưa có tài khoản? <button onClick={onSwitchToRegister} className="text-green-600 font-bold hover:underline">Đăng ký ngay</button>
      </div>
    </div>
  );
}