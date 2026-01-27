'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, X, AlertCircle } from 'lucide-react';
import { GoogleLogo, FacebookLogo } from '@/icons/SocialIcons';

// Import Validation & Hooks
import { RegisterSchema, RegisterFormType } from '@/lib/validations/auth.validation';
import { 
  useCheckPhone, 
  useSendOtp, 
  useVerifyAndSync,
  useSocialLogin 
} from '@/hooks/api/useAuthApi';

import OtpForm from './OtpForm';

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
}

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<'INPUT' | 'OTP'>('INPUT');
  const [showExistModal, setShowExistModal] = useState(false);
  const [registerData, setRegisterData] = useState<{ phone: string; password?: string } | null>(null);

  // Form Hook
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormType>({
    resolver: zodResolver(RegisterSchema),
  });

  // API Hooks
  const checkPhoneMutation = useCheckPhone();
  const sendOtpMutation = useSendOtp();
  const verifyRegisterMutation = useVerifyAndSync(); // Sử dụng hook verify mới
  const { mutate: loginSocial } = useSocialLogin();

  // 1. Xử lý Submit Bước 1 (Nhập Phone + Pass)
  const onCheckInfo = (data: RegisterFormType) => {
    // ✅ FIX: Lưu dữ liệu ngay lập tức để Modal hiển thị được SĐT
    setRegisterData({ phone: data.phone, password: data.password });

    checkPhoneMutation.mutate(data.phone, {
      onSuccess: (response) => {
        if (response.data.exists) {
          // Nếu đã tồn tại -> Hiện Modal
          setShowExistModal(true);
        } else {
          // Nếu chưa tồn tại -> Gửi OTP
          sendOtpMutation.mutate(data.phone, {
            onSuccess: () => {
              setStep('OTP'); // Chuyển sang bước nhập OTP
            },
            onError: (err: any) => alert("Lỗi gửi OTP: " + err.message)
          });
        }
      },
      onError: (err: any) => {
        setError('root', { message: err?.response?.data?.message || 'Lỗi kết nối máy chủ' });
      }
    });
  };

  // 2. Xử lý Verify OTP thành công (Callback từ OtpForm)
  const onVerifySuccess = (otpCode: string) => {
    if (!registerData) return;

    // Gọi API Verify & Sync
    verifyRegisterMutation.mutate(
      {
        phone: registerData.phone,
        otp: otpCode,
        password: registerData.password // Gửi kèm password để backend tạo account luôn
      },
      {
        onSuccess: (data) => {
           // Hook api/useAuth đã tự động redirect và lưu token
           // Ở đây không cần làm gì thêm hoặc hiện thông báo thêm nếu muốn
        },
        onError: (err: any) => {
          // alert("Lỗi xác thực: " + err.message); // Hook đã handle alert rồi
        }
      }
    );
  };

  // --- GIAO DIỆN ---

  // Nếu đang ở bước OTP
  if (step === 'OTP') {
    return (
      <OtpForm
        phone={registerData?.phone || ''}
        onVerifySuccess={onVerifySuccess}
        isLoading={verifyRegisterMutation.isPending}
        onGoBack={() => setStep('INPUT')}
      />
    );
  }

  // Nếu đang ở bước INPUT
  return (
    <>
      <div className="w-full max-w-md p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Đăng Ký Tài Khoản</h2>

        <form onSubmit={handleSubmit(onCheckInfo)} className="space-y-4">
          
          {/* Input Phone */}
          <div>
            <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
            <input
              {...register('phone')}
              className={`w-full px-4 py-3 rounded-lg border-2 outline-none mt-1 transition-all ${
                errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/10'
              }`}
              placeholder="09xxxxxxxx"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>

          {/* Input Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">Mật khẩu</label>
            <input
              type="password"
              {...register('password')}
              className={`w-full px-4 py-3 rounded-lg border-2 outline-none mt-1 transition-all ${
                errors.password ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/10'
              }`}
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
              className={`w-full px-4 py-3 rounded-lg border-2 outline-none mt-1 transition-all ${
                errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/10'
              }`}
              placeholder="••••••••••••"
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>

          {/* Root Error */}
          {errors.root && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
              <AlertCircle size={16} /> {errors.root.message}
            </div>
          )}

          {/* Submit Button */}
          <button
            disabled={checkPhoneMutation.isPending || sendOtpMutation.isPending}
            type="submit"
            className="w-full bg-[#009f4d] hover:bg-green-700 text-white font-bold py-3 rounded-lg border-2 border-[#009f4d] flex justify-center items-center gap-2 disabled:opacity-70 transition-all shadow-lg shadow-green-500/20"
          >
            {(checkPhoneMutation.isPending || sendOtpMutation.isPending) ? (
              <Loader2 className="animate-spin" /> 
            ) : (
              'Tiếp tục'
            )}
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

        {/* Switch to Login */}
        <div className="mt-6 text-center text-sm text-gray-500 lg:hidden">
            Đã có tài khoản? <button onClick={onSwitchToLogin} className="text-green-600 font-bold hover:underline">Đăng nhập ngay</button>
        </div>
      </div>

      {/* Modal User Exist */}
      {showExistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowExistModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-black"><X size={20} /></button>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4"><AlertCircle /></div>
              <h3 className="text-lg font-bold text-gray-900">Số điện thoại đã tồn tại!</h3>
              <p className="text-gray-500 my-4 text-sm">
                Số <b>{registerData?.phone}</b> đã được đăng ký. <br/>Bạn có muốn đăng nhập không?
              </p>
              <button onClick={() => router.push('/login')} className="w-full bg-green-600 text-white py-2.5 rounded-lg font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-600/20">
                Đăng nhập ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}