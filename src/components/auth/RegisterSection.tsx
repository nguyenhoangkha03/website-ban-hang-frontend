'use client';

import RegisterForm from './RegisterForm';

interface RegisterSectionProps {
  onSwitchToLogin?: () => void;
}

export default function RegisterSection({ onSwitchToLogin }: RegisterSectionProps) {
  return (
    <div className="w-full max-w-2xl bg-white p-8 lg:p-12 rounded-2xl shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-500 delay-100">
      {/* Welcome Text Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Bắt đầu hành trình của bạn
        </h2>
        <p className="text-lg text-gray-700">
          Đăng ký tài khoản để khám phá những sản phẩm nông sân sạch chất lượng cao
        </p>
      </div>

      {/* Register Form Section */}
      <div>
        <RegisterForm onSwitchToLogin={onSwitchToLogin} />
      </div>

      {/* Switch to Login - Only on mobile */}
      <div className="mt-6 text-center text-sm text-gray-500 lg:hidden">
        Đã có tài khoản? <button onClick={onSwitchToLogin} className="text-green-600 font-bold hover:underline">Đăng nhập ngay</button>
      </div>
    </div>
  );
}
