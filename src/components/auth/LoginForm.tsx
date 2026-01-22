'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, AlertCircle } from 'lucide-react';
import { GoogleLogo, FacebookLogo } from '@/icons/SocialIcons';

// Import Logic
import { LoginSchema, LoginFormType } from '@/lib/validations/auth.validation';
import { useLogin, useSocialLogin } from '@/hooks/api/useAuthApi';

interface LoginFormProps {
  onSwitchToRegister?: () => void;
}

export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  // 1. Setup Form
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

  // 2. API Hooks
  const { mutate: login, isPending, error: apiError } = useLogin();
  const { mutate: loginSocial } = useSocialLogin();

  // 3. Handlers
  const onSubmit = (data: LoginFormType) => {
    login(data);
  };

  return (
    <div className="w-full max-w-md p-8 animate-in fade-in zoom-in duration-500 delay-100">

      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Đăng Nhập</h2>
        <p className="text-gray-500 text-sm mt-2">Chào mừng bạn quay trở lại với Nam Việt</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Input Phone */}
        <div>
          <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
          <input
            {...register('phone')}
            className={`w-full px-4 py-3 rounded-lg border-2 outline-none mt-1 transition-all ${
              errors.phone 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-200 focus:border-[#009f4d] focus:ring-4 focus:ring-green-500/10'
            }`}
            placeholder="09xxxxxxxx"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>

        {/* Input Password */}
        <div>
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700">Mật khẩu</label>
            <Link 
              href="/forgot-password" 
              className="text-xs text-[#009f4d] font-semibold hover:underline"
              tabIndex={-1} // Tránh tab vào link này khi đang điền form
            >
              Quên mật khẩu?
            </Link>
          </div>
          <input
            type="password"
            {...register('password')}
            className={`w-full px-4 py-3 rounded-lg border-2 outline-none mt-1 transition-all ${
              errors.password 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-200 focus:border-[#009f4d] focus:ring-4 focus:ring-green-500/10'
            }`}
            placeholder="••••••••••••"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        {/* API Error Message */}
        {apiError && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 border border-red-100">
            <AlertCircle size={16} className="shrink-0" />
            {/* Ép kiểu lỗi an toàn hơn */}
            <span>{(apiError as any)?.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.'}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          disabled={isPending}
          type="submit"
          className="w-full bg-[#009f4d] hover:bg-green-700 text-white font-bold py-3 rounded-lg border-2 border-[#009f4d] flex justify-center items-center gap-2 disabled:opacity-70 transition-all shadow-lg shadow-green-600/20"
        >
          {isPending ? <Loader2 className="animate-spin" /> : 'Đăng Nhập'}
        </button>
      </form>

      {/* Social Login */}
      <div className="mt-8">
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-3 bg-white text-gray-500">HOẶC</span></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => loginSocial('google')}
            className="flex items-center justify-center gap-3 px-4 py-2.5 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
          >
            <GoogleLogo /> <span className="text-sm font-semibold text-gray-700">Google</span>
          </button>

          <button
            type="button"
            onClick={() => loginSocial('facebook')}
            className="flex items-center justify-center gap-3 px-4 py-2.5 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
          >
            <FacebookLogo /> <span className="text-sm font-semibold text-gray-700">Facebook</span>
          </button>
        </div>
      </div>

      {/* Mobile Footer: Switch to Register */}
      <div className="mt-6 text-center text-sm text-gray-500 lg:hidden">
        Chưa có tài khoản? <button onClick={onSwitchToRegister} className="text-[#009f4d] font-bold hover:underline">Đăng ký ngay</button>
      </div>
    </div>
  );
}