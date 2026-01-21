'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowLeft, KeyRound, AlertCircle, X, Phone } from 'lucide-react';

// Validate & Hooks
import { 
  ForgotPasswordPhoneSchema, 
  ForgotPasswordPhoneType, 
  NewPasswordSchema, 
  NewPasswordType 
} from '@/lib/validations/auth.validation';
import { useCheckPhone, useSendOtp, useSetPassword } from '@/hooks/api/useAuth';
import { supabaseService } from '@/lib/supabase/supabaseService';
import OtpForm from './OtpForm'; 

export default function ForgotPasswordForm() {
  const router = useRouter();
  
  // State quản lý luồng
  const [step, setStep] = useState<'PHONE' | 'OTP' | 'PASSWORD'>('PHONE');
  
  // Data tạm
  const [phoneData, setPhoneData] = useState<string>('');
  const [verifiedUid, setVerifiedUid] = useState<string>('');
  const [showNotRegModal, setShowNotRegModal] = useState(false);
  
  // State loading riêng cho bước verify OTP (vì gọi Supabase trực tiếp)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // --- HOOKS ---
  const checkPhoneMutation = useCheckPhone();
  const sendOtpMutation = useSendOtp();
  const setPasswordMutation = useSetPassword();

  // --- FORMS ---
  const phoneForm = useForm<ForgotPasswordPhoneType>({
    resolver: zodResolver(ForgotPasswordPhoneSchema),
  });

  const passwordForm = useForm<NewPasswordType>({
    resolver: zodResolver(NewPasswordSchema),
  });

  // 1. XỬ LÝ: CHECK SĐT & GỬI OTP
  const onCheckPhone = (data: ForgotPasswordPhoneType) => {
    checkPhoneMutation.mutate(data.phone, {
      onSuccess: (res) => {
        // Backend trả về: exists: true/false
        // Logic ngược lại với Register: Phải tồn tại mới cho reset pass
        if (!res.data.exists) {
          setPhoneData(data.phone);
          setShowNotRegModal(true); // Chưa đăng ký -> Báo lỗi
        } else {
          // Đã đăng ký -> Gửi OTP
          sendOtpMutation.mutate(data.phone, {
            onSuccess: () => {
               setPhoneData(data.phone);
               setStep('OTP'); 
            },
            onError: (err: any) => alert("Lỗi gửi OTP: " + err.message)
          });
        }
      },
      onError: (err: any) => {
          alert("Lỗi kiểm tra số điện thoại: " + (err?.response?.data?.message || err.message));
      }
    });
  };

  // 2. XỬ LÝ: VERIFY OTP
  const onOtpVerifySuccess = async (otpCode: string) => {
    setIsVerifyingOtp(true);
    try {
        // Xác thực OTP với Supabase để lấy UID
        const { uid } = await supabaseService.verifyOtp(phoneData, otpCode);
        if (uid) {
            setVerifiedUid(uid);
            setStep('PASSWORD'); // Thành công -> Chuyển bước
        } else {
            alert("Không lấy được thông tin người dùng. Vui lòng thử lại.");
        }
    } catch (error: any) {
        alert("Mã OTP không đúng hoặc đã hết hạn.");
    } finally {
        setIsVerifyingOtp(false);
    }
  };

  // 3. XỬ LÝ: ĐỔI MẬT KHẨU
  const onSetNewPassword = (data: NewPasswordType) => {
    if (!verifiedUid || !phoneData) return;

    setPasswordMutation.mutate({
        phone: phoneData,
        uid: verifiedUid,
        password: data.password
    });
    // Hook useSetPassword đã xử lý onSuccess (redirect/alert)
  };

  // ================= RENDER GIAO DIỆN =================

  // MÀN HÌNH 2: OTP
  if (step === 'OTP') {
    return (
        <OtpForm 
            phone={phoneData} 
            type="forgot_password"
            onVerifySuccess={onOtpVerifySuccess} 
            isLoading={isVerifyingOtp} // ✅ Truyền loading state
            onGoBack={() => setStep('PHONE')} // ✅ Truyền hàm quay lại
        />
    );
  }

  // MÀN HÌNH 3: ĐẶT MẬT KHẨU MỚI
  if (step === 'PASSWORD') {
    return (
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-300">
         <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <KeyRound size={28} className="text-[#009f4d]" />
         </div>
         <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">Đặt Lại Mật Khẩu</h2>
         <p className="text-center text-gray-500 text-sm mb-6">Nhập mật khẩu mới cho tài khoản <br/><b>{phoneData}</b></p>

         <form onSubmit={passwordForm.handleSubmit(onSetNewPassword)} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Mật khẩu mới</label>
              <input 
                type="password" {...passwordForm.register('password')}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#009f4d] focus:ring-4 focus:ring-green-500/10 outline-none mt-1 transition-all"
                placeholder="••••••••••••"
              />
              {passwordForm.formState.errors.password && <p className="text-red-500 text-xs mt-1">{passwordForm.formState.errors.password.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
              <input 
                type="password" {...passwordForm.register('confirmPassword')}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#009f4d] focus:ring-4 focus:ring-green-500/10 outline-none mt-1 transition-all"
                placeholder="••••••••••••"
              />
              {passwordForm.formState.errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{passwordForm.formState.errors.confirmPassword.message}</p>}
            </div>

            <button 
                disabled={setPasswordMutation.isPending} 
                className="w-full bg-[#009f4d] hover:bg-green-700 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 mt-4 shadow-lg shadow-green-600/20 disabled:opacity-70 transition-all"
            >
               {setPasswordMutation.isPending ? <Loader2 className="animate-spin" /> : 'Đổi mật khẩu'}
            </button>
         </form>
      </div>
    );
  }

  // MÀN HÌNH 1: NHẬP SĐT (Mặc định)
  return (
    <>
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone size={28} className="text-[#009f4d]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Quên Mật Khẩu?</h2>
            <p className="text-gray-500 text-sm mt-2">Đừng lo! Nhập số điện thoại để lấy lại mật khẩu.</p>
        </div>

        <form onSubmit={phoneForm.handleSubmit(onCheckPhone)} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
              <input
                {...phoneForm.register('phone')}
                className={`w-full px-4 py-3 rounded-lg border-2 outline-none mt-1 transition-all ${
                   phoneForm.formState.errors.phone 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-200 focus:border-[#009f4d] focus:ring-4 focus:ring-green-500/10'
                }`}
                placeholder="09xxxxxxxx"
              />
              {phoneForm.formState.errors.phone && <p className="text-red-500 text-xs mt-1">{phoneForm.formState.errors.phone.message}</p>}
            </div>

            <button
              disabled={checkPhoneMutation.isPending || sendOtpMutation.isPending}
              type="submit"
              className="w-full bg-[#009f4d] hover:bg-green-700 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 disabled:opacity-70 transition-all shadow-lg shadow-green-600/20"
            >
              {(checkPhoneMutation.isPending || sendOtpMutation.isPending) ? <Loader2 className="animate-spin" /> : 'Tiếp tục'}
            </button>
        </form>

        <div className="mt-6 text-center border-t border-gray-100 pt-6">
            <Link href="/login" className="flex items-center justify-center gap-2 text-gray-500 hover:text-[#009f4d] text-sm font-medium transition-colors">
                <ArrowLeft size={16} /> Quay lại Đăng nhập
            </Link>
        </div>
      </div>

      {/* MODAL: SĐT CHƯA ĐĂNG KÝ */}
      {showNotRegModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative shadow-2xl scale-100 animate-in zoom-in-95">
              <button onClick={() => setShowNotRegModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-black"><X size={20}/></button>
              <div className="text-center">
                <div className="w-14 h-14 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4"><AlertCircle size={28}/></div>
                <h3 className="text-lg font-bold text-gray-900">Số chưa đăng ký!</h3>
                <p className="text-gray-500 my-4 text-sm">Số điện thoại <b>{phoneData}</b> chưa có tài khoản tại hệ thống.</p>
                <div className="flex flex-col gap-2">
                    <button onClick={() => router.push('/register')} className="w-full bg-[#009f4d] text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-all">Đăng ký tài khoản mới</button>
                    <button onClick={() => setShowNotRegModal(false)} className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-50">Nhập số khác</button>
                </div>
              </div>
            </div>
          </div>
        )}
    </>
  );
}