'use client';

import ForgotPasswordForm from './ForgotPasswordForm';

export default function ForgotPasswordSection() {
  return (
    <div className="w-full max-w-2xl bg-white p-8 lg:p-12 rounded-2xl shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-500 delay-100">
      
      {/* Không cần tiêu đề ở đây vì ForgotPasswordForm đã tự render tiêu đề thay đổi theo từng bước (SĐT / OTP / Password) */}
      
      {/* Form xử lý chính */}
      <ForgotPasswordForm />
      
    </div>
  );
}