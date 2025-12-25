'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock } from 'lucide-react';
import { LoginInput } from '@/src/components/form/LoginInput';
import { LoginButton } from '@/src/components/form/LoginButton';
import { useLoginForm } from '@/src/hooks/useLoginForm';
import { authApi } from '@/src/lib/authApi';

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>('');
  
  const { formData, errors, validateForm, handleChange, reset } = useLoginForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setApiError('');

    try {
      // Gọi API login
      const response = await authApi.login({
        email: formData.email,
        password: formData.password,
      });

      // Lưu token vào localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      // Reset form
      reset();

      // Redirect đến trang cần đến hoặc home
      const from = searchParams.get('from') || '/';
      router.push(from);
    } catch (error: any) {
      const errorMsg = error?.message || error?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      setApiError(errorMsg);
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-6">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Đăng Nhập
            </h1>
            <p className="text-gray-600">
              Chào mừng bạn quay lại
            </p>
          </div>

          {/* API Error */}
          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-medium">{apiError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                <Mail size={20} />
              </div>
              <LoginInput
                label="Email"
                placeholder="example@email.com"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
                disabled={isLoading}
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                <Lock size={20} />
              </div>
              <LoginInput
                label="Mật Khẩu"
                placeholder="Nhập mật khẩu của bạn"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
                disabled={isLoading}
                showPasswordToggle
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {/* Submit Button */}
            <LoginButton
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={isLoading}
              loading={isLoading}
              className="mt-6"
            >
              Đăng Nhập
            </LoginButton>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-3 text-gray-600 text-sm">hoặc</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button
              type="button"
              className="w-full py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
              disabled={isLoading}
            >
              Đăng nhập với Google
            </button>
            <button
              type="button"
              className="w-full py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
              disabled={isLoading}
            >
              Đăng nhập với Facebook
            </button>
          </div>

          {/* Register Link */}
          <p className="text-center mt-6 text-gray-600">
            Chưa có tài khoản?{' '}
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Đăng Ký
            </Link>
          </p>
        </div>

        {/* Footer Text */}
        <p className="text-center mt-6 text-gray-600 text-sm">
          Bằng cách đăng nhập, bạn đồng ý với{' '}
          <Link href="/terms" className="text-blue-600 hover:underline">
            Điều khoản sử dụng
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
