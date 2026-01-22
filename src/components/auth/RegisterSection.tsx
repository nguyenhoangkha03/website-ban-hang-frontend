'use client';

import RegisterForm from './RegisterForm';

interface RegisterSectionProps {
  onSwitchToLogin?: () => void;
}

export default function RegisterSection({ onSwitchToLogin }: RegisterSectionProps) {
  return (
    <div className="w-full max-w-2xl bg-white p-8 lg:p-12 rounded-2xl shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-500 delay-100">
      {/* 1. Phần Tiêu đề chào mừng */}
      <div className="text-center mb-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
          Bắt đầu hành trình
        </h2>
        <p className="text-base lg:text-lg text-gray-600">
          Đăng ký tài khoản để khám phá những sản phẩm nông sản sạch chất lượng cao cùng Nam Việt.
        </p>
      </div>

      {/* 2. Form Đăng ký (Đã bao gồm Input, Button, Social, và Link chuyển login) */}
      <RegisterForm onSwitchToLogin={onSwitchToLogin} />
      
    </div>
  );
}