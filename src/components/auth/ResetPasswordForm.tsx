'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { validatePassword } from '@/lib/validations/validation';
import { Loader2, KeyRound, CheckCircle } from 'lucide-react';

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone'); // Lấy sđt từ URL (nếu có truyền qua)

  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 1. Validate mật khẩu
    const passErr = validatePassword(formData.password);
    if (passErr) return setError(passErr);
    
    if (formData.password !== formData.confirmPassword) {
      return setError("Mật khẩu xác nhận không khớp.");
    }

    setIsLoading(true);

    // 2. Giả lập gọi API đặt lại mật khẩu
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Thành công -> Hiển thị trạng thái thành công
      setIsSuccess(true);
      
      // Chuyển hướng sau 2 giây
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (err) {
      setError("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- GIAO DIỆN THÀNH CÔNG ---
  if (isSuccess) {
    return (
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-green-600 w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thành Công!</h2>
        <p className="text-gray-500 mb-6">
          Mật khẩu của bạn đã được đặt lại. <br/> Đang chuyển hướng đến trang đăng nhập...
        </p>
        <Loader2 className="animate-spin mx-auto text-green-600" />
      </div>
    );
  }

  // --- GIAO DIỆN FORM ĐẶT LẠI MẬT KHẨU ---
  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-500 delay-100">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <KeyRound className="text-orange-600 w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Đặt Lại Mật Khẩu</h2>
        <p className="text-gray-500 text-sm mt-2">
          {phone ? `Tài khoản: ${phone}` : 'Nhập mật khẩu mới cho tài khoản của bạn'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
          <input 
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            placeholder="••••••"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
          <input 
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            placeholder="••••••"
            required
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        <button 
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 transition-all shadow-lg shadow-green-100 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : 'Đổi mật khẩu'}
        </button>
      </form>
    </div>
  );
}