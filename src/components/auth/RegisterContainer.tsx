'use client';

import RegisterForm from './RegisterForm';

interface RegisterContainerProps {
  onSwitchToLogin?: () => void;
}

export default function RegisterContainer({ onSwitchToLogin }: RegisterContainerProps) {
  return (
    <div className="w-full max-w-2xl bg-white p-8 lg:p-12 rounded-2xl shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-500 delay-100">
      {/* Welcome Text Section */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Bắt đầu hành trình của bạn</h2>
        <p className="text-lg text-gray-700 mb-8">Đăng ký tài khoản để khám phá những sản phẩm nông sản sạch chất lượng cao</p>
        
        <div className="pt-8 border-t border-green-200">
          <p className="text-gray-700 mb-3">Đã có tài khoản?</p>
          <button
            onClick={onSwitchToLogin}
            className="w-full bg-[#009f4d] hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="my-8 relative">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
        <div className="relative flex justify-center text-sm"><span className="px-3 bg-white text-gray-500">HOẶC</span></div>
      </div>

      {/* Register Form Section */}
      <RegisterForm onSwitchToLogin={onSwitchToLogin} />
    </div>
  );
}
