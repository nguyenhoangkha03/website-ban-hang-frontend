'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowLeft, KeyRound, AlertCircle, X } from 'lucide-react';

// Validate & Hooks
import { ForgotPasswordPhoneSchema, ForgotPasswordPhoneType, NewPasswordSchema, NewPasswordType } from '@/src/lib/validations/auth';
import { useCheckPhone, useSendOtp, useSetPassword } from '@/src/hooks/api/useAuth';
import { supabaseService } from '@/src/lib/supabase/supabaseService';
import OtpForm from './OtpForm'; // Tái sử dụng form OTP

export default function ForgotPasswordForm() {
  const router = useRouter();
  
  // State quản lý luồng: 'PHONE' -> 'OTP' -> 'PASSWORD'
  const [step, setStep] = useState<'PHONE' | 'OTP' | 'PASSWORD'>('PHONE');
  
  // Lưu dữ liệu tạm để truyền giữa các bước
  const [phoneData, setPhoneData] = useState<string>('');
  const [verifiedUid, setVerifiedUid] = useState<string>(''); // UID lấy được sau khi verify OTP
  const [showNotRegModal, setShowNotRegModal] = useState(false); // Modal báo chưa đăng ký

  // --- HOOKS ---
  const checkPhoneMutation = useCheckPhone();
  const sendOtpMutation = useSendOtp();
  const setPasswordMutation = useSetPassword();

  // --- FORM BƯỚC 1: NHẬP SĐT ---
  const phoneForm = useForm<ForgotPasswordPhoneType>({
    resolver: zodResolver(ForgotPasswordPhoneSchema),
  });

  // --- FORM BƯỚC 3: NHẬP PASS MỚI ---
  const passwordForm = useForm<NewPasswordType>({
    resolver: zodResolver(NewPasswordSchema),
  });

  // 1. XỬ LÝ: CHECK SĐT & GỬI OTP
  const onCheckPhone = (data: ForgotPasswordPhoneType) => {
    checkPhoneMutation.mutate(data.phone, {
      onSuccess: (res) => {
        // Backend trả về: exists: true/false
        if (!res.data.exists) {
          // Chưa đăng ký -> Hiện Modal
          setPhoneData(data.phone);
          setShowNotRegModal(true);
        } else {
          // Đã đăng ký -> Gửi OTP qua Supabase
          sendOtpMutation.mutate(data.phone, {
            onSuccess: () => {
               setPhoneData(data.phone);
               setStep('OTP'); // Chuyển sang bước nhập OTP
            },
            onError: (err: any) => alert("Lỗi gửi OTP: " + err.message)
          });
        }
      }
    });
  };

  // 2. XỬ LÝ: VERIFY OTP THÀNH CÔNG
  const onOtpVerifySuccess = async (otpCode: string) => {
    try {
        // Xác thực OTP với Supabase để lấy UID
        const { uid } = await supabaseService.verifyOtp(phoneData, otpCode);
        if (uid) {
            setVerifiedUid(uid); // Lưu UID để dùng cho bước đổi pass
            setStep('PASSWORD'); // Chuyển sang bước nhập pass mới
        }
    } catch (error: any) {
        alert("Mã OTP không đúng hoặc đã hết hạn");
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
  };

  // ================= RENDER GIAO DIỆN =================

  // MÀN HÌNH 2: OTP (Tái sử dụng OtpForm)
  if (step === 'OTP') {
    return (
        <OtpForm 
            phone={phoneData} 
            onVerifySuccess={onOtpVerifySuccess} 
            type="forgot_password"
        />
    );
  }

  // MÀN HÌNH 3: ĐẶT MẬT KHẨU MỚI (Như hình ảnh bạn gửi)
  if (step === 'PASSWORD') {
    return (
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-300">
         <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600">
            <KeyRound size={24} />
         </div>
         <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">Đặt Lại Mật Khẩu</h2>
         <p className="text-center text-gray-500 text-sm mb-6">Nhập mật khẩu mới cho tài khoản {phoneData}</p>

         <form onSubmit={passwordForm.handleSubmit(onSetNewPassword)} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Mật khẩu mới</label>
              <input 
                type="password" {...passwordForm.register('password')}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none mt-1"
                placeholder="••••••"
              />
              {passwordForm.formState.errors.password && <p className="text-red-500 text-xs mt-1">{passwordForm.formState.errors.password.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
              <input 
                type="password" {...passwordForm.register('confirmPassword')}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none mt-1"
                placeholder="••••••"
              />
              {passwordForm.formState.errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{passwordForm.formState.errors.confirmPassword.message}</p>}
            </div>

            <button disabled={setPasswordMutation.isPending} className="w-full bg-[#009f4d] hover:bg-green-700 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 mt-2">
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
            <h2 className="text-2xl font-bold text-gray-800">Quên Mật Khẩu?</h2>
            <p className="text-gray-500 text-sm mt-2">Đừng lo! Nhập số điện thoại để lấy lại mật khẩu.</p>
        </div>

        <form onSubmit={phoneForm.handleSubmit(onCheckPhone)} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
              <input
                {...phoneForm.register('phone')}
                className={`w-full px-4 py-3 rounded-lg border outline-none mt-1 transition-all ${
                   phoneForm.formState.errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:ring-2 focus:ring-green-500'
                }`}
                placeholder="09xxxxxxxx"
              />
              {phoneForm.formState.errors.phone && <p className="text-red-500 text-xs mt-1">{phoneForm.formState.errors.phone.message}</p>}
            </div>

            <button
              disabled={checkPhoneMutation.isPending || sendOtpMutation.isPending}
              type="submit"
              className="w-full bg-[#009f4d] hover:bg-green-700 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 disabled:opacity-70 transition-all"
            >
              {(checkPhoneMutation.isPending || sendOtpMutation.isPending) ? <Loader2 className="animate-spin" /> : 'Tiếp tục'}
            </button>
        </form>

        <div className="mt-6 text-center">
            <Link href="/login" className="flex items-center justify-center gap-2 text-gray-600 hover:text-green-600 text-sm font-medium transition-colors">
                <ArrowLeft size={16} /> Quay lại Đăng nhập
            </Link>
        </div>
      </div>

      {/* MODAL: SĐT CHƯA ĐĂNG KÝ */}
      {showNotRegModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative shadow-2xl">
              <button onClick={() => setShowNotRegModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-black"><X size={20}/></button>
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4"><AlertCircle /></div>
                <h3 className="text-lg font-bold text-gray-900">Số chưa đăng ký!</h3>
                <p className="text-gray-500 my-4 text-sm">Số điện thoại <b>{phoneData}</b> chưa có tài khoản tại hệ thống. Bạn có muốn đăng ký mới không?</p>
                <div className="flex gap-3">
                    <button onClick={() => router.push('/register')} className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-bold hover:bg-green-700 transition-all">Đăng ký ngay</button>
                    <button onClick={() => setShowNotRegModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-bold hover:bg-gray-200">Thử lại</button>
                </div>
              </div>
            </div>
          </div>
        )}
    </>
  );
}