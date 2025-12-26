'use client';

import LoginForm from './LoginForm';

interface LoginSectionProps {
  onSwitchToRegister?: () => void;
}

export default function LoginSection({ onSwitchToRegister }: LoginSectionProps) {
  return (
    <div className="w-full max-w-2xl bg-white p-8 lg:p-12 rounded-2xl shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-500 delay-100">
      {/* Welcome Text Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Chào mừng trở lại!
        </h2>
        <p className="text-lg text-gray-700">
          Đăng nhập để tiếp tục hành trình mua sắm của bạn
        </p>
      </div>

      {/* Login Form Section */}
      <div>
        <LoginForm onSwitchToRegister={onSwitchToRegister} />
      </div>

      {/* Switch to Register - Only on mobile */}
      <div className="mt-6 text-center text-sm text-gray-500 lg:hidden">
        Chưa có tài khoản? <button onClick={onSwitchToRegister} className="text-green-600 font-bold hover:underline">Đăng ký ngay</button>
      </div>
    </div>
  );
}
