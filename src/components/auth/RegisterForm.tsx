'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, X, AlertCircle } from 'lucide-react';
import { GoogleLogo, FacebookLogo } from '@/src/icons/SocialIcons';

// Import Logic Mới
import { RegisterSchema, RegisterFormType } from '@/src/lib/validations/auth';
import { useCheckPhone, useSendOtp, useVerifyAndRegister, useSocialLogin } from '@/src/hooks/api/useAuth';
import OtpForm from './OtpForm';

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
}

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<'INPUT' | 'OTP'>('INPUT');
  const [showExistModal, setShowExistModal] = useState(false);
  const [registerData, setRegisterData] = useState<{ phone: string; password?: string } | null>(null);

  // 1. Setup Form cho Bước 1 (Nhập thông tin)
  const {
    register,
    handleSubmit,
    setError, // Để set lỗi thủ công nếu API trả về
    formState: { errors },
  } = useForm<RegisterFormType>({
    resolver: zodResolver(RegisterSchema),
  });

  // Hooks API
  const checkPhoneMutation = useCheckPhone();
  const sendOtpMutation = useSendOtp();           // Hook gửi OTP
  const verifyRegisterMutation = useVerifyAndRegister(); // Hook Verify & Sync
  const socialLoginMutation = useSocialLogin();



  // 1. Xử lý khi bấm "Tiếp tục" (Bước 1)
  const onCheckInfo = (data: RegisterFormType) => {
    checkPhoneMutation.mutate(data.phone, {
      onSuccess: (response) => {
        if (response.data.exists) {
          setShowExistModal(true);
        } else {
          // Phone chưa tồn tại -> Gửi OTP thật qua Supabase
          sendOtpMutation.mutate(data.phone, {
            onSuccess: () => {
              setRegisterData({ phone: data.phone, password: data.password });
              setStep('OTP');
            },
            onError: (err: any) => alert("Lỗi gửi OTP: " + err.message)
          });
        }
      },
      onError: (err: any) => {
        setError('root', { message: err?.response?.data?.message || 'Lỗi không xác định từ máy chủ' });
      }
    });
  };

  // 2. Xử lý khi nhập xong OTP (Bước 2)
  const onVerifySuccess = (otpCode: string) => {
    if (!registerData) return;

    // Gọi verify thật (Supabase -> Backend)
    verifyRegisterMutation.mutate(
      {
        phone: registerData.phone,
        otp: otpCode,
        password: registerData.password // <--- TRUYỀN PASSWORD VÀO HOOK
      },
      {
        onSuccess: (data) => {
          if (data.success) {
            // Đăng ký thành công, chuyển về trang chủ hoặc trang đăng nhập
            router.push('/login');
          }
        },
        onError: (err: any) => alert("Lỗi: " + err.message)
      }
    );
  };

  // 3. Xử lý Social Click
  const { mutate: loginSocial } = useSocialLogin();
  // Hàm xử lý click
  const handleSocialClick = (provider: 'google' | 'facebook') => {
    loginSocial(provider);
  };

  // --- RENDER BƯỚC 1: NHẬP THÔNG TIN ---
  if (step === 'INPUT') {
    return (
      <>
        <div className="w-full max-w-md p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Đăng Ký Tài Khoản</h2>

          <form onSubmit={handleSubmit(onCheckInfo)} className="space-y-4">

            {/* Phone */}
            <div>
              <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
              <input
                {...register('phone')}
                className={`w-full px-4 py-3 rounded-lg border-2 outline-none mt-1 ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-400 focus:ring-2 focus:ring-green-500'}`}
                placeholder="09xxxxxxxx"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700">Mật khẩu</label>
              <input
                type="password"
                {...register('password')}
                className={`w-full px-4 py-3 rounded-lg border-2 outline-none mt-1 ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-400 focus:ring-2 focus:ring-green-500'}`}
                placeholder="••••••••••••"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-medium text-gray-700">Nhập lại mật khẩu</label>
              <input
                type="password"
                {...register('confirmPassword')}
                className={`w-full px-4 py-3 rounded-lg border-2 outline-none mt-1 ${errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-400 focus:ring-2 focus:ring-green-500'}`}
                placeholder="••••••••••••"
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            {/* Lỗi chung (root error) */}
            {errors.root && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                <AlertCircle size={16} /> {errors.root.message}
              </div>
            )}

            <button
              disabled={checkPhoneMutation.isPending}
              type="submit"
              className="w-full bg-[#009f4d] hover:bg-green-700 text-white font-bold py-3 rounded-lg border-2 border-[#009f4d] flex justify-center items-center gap-2 disabled:opacity-70 transition-all"
            >
              {checkPhoneMutation.isPending ? <Loader2 className="animate-spin" /> : 'Tiếp tục'}
            </button>
          </form>

          {/* Social */}
          <div className="mt-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
              <div className="relative flex justify-center text-sm"><span className="px-3 bg-white text-gray-500">HOẶC</span></div>
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

          <div className="mt-6 text-center text-sm text-gray-500 lg:hidden">
            Đã có tài khoản? <button onClick={onSwitchToLogin} className="text-green-600 font-bold hover:underline">Đăng nhập ngay</button>
          </div>
        </div>

        {/* Modal User Exist */}
        {showExistModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative shadow-2xl">
              <button onClick={() => setShowExistModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-black"><X size={20} /></button>
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4"><AlertCircle /></div>
                <h3 className="text-lg font-bold text-gray-900">Số điện thoại đã tồn tại!</h3>
                <p className="text-gray-500 my-4 text-sm">Số <b>{registerData?.phone}</b> đã được đăng ký. Bạn có muốn đăng nhập không?</p>
                <button onClick={() => router.push('/login')} className="w-full bg-green-600 text-white py-2.5 rounded-lg font-bold hover:bg-green-700 transition-all">Đăng nhập ngay</button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // --- RENDER BƯỚC 2: NHẬP OTP ---
  // Chúng ta tái sử dụng OtpForm, nhưng cần sửa OtpForm một chút để nhận prop callback
  // Tạm thời tôi giả sử OtpForm có thể nhận prop `onVerifySuccess`
  // Nếu OtpForm của bạn chưa hỗ trợ prop này, xem Bước 3 bên dưới để sửa OtpForm.
  return (
    <OtpForm
      phone={registerData?.phone || ''}
      onVerifySuccess={onVerifySuccess}
      isLoading={verifyRegisterMutation.isPending} // Loading thật
      onGoBack={() => setStep('INPUT')}
    />
  );
}