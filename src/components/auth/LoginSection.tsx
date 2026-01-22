'use client';

import LoginForm from './LoginForm';

interface LoginSectionProps {
  onSwitchToRegister?: () => void;
}

export default function LoginSection({ onSwitchToRegister }: LoginSectionProps) {
  return (
    <div className="w-full max-w-2xl bg-white p-8 lg:p-12 rounded-2xl shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-500 delay-100">
      
      {/* 1. Phần Tiêu đề chào mừng */}
      <div className="text-center mb-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
          Chào mừng trở lại!
        </h2>
        <p className="text-base lg:text-lg text-gray-600">
          Đăng nhập để tiếp tục hành trình mua sắm nông sản sạch cùng Nam Việt.
        </p>
      </div>

      {/* 2. Form Đăng nhập */}
      {/* LoginForm đã bao gồm Input, Button, Social, và Link chuyển Register (mobile) */}
      <LoginForm onSwitchToRegister={onSwitchToRegister} />
      
    </div>
  );
}