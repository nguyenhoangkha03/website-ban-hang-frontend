'use client';

import { Suspense } from 'react'; // Cần thiết nếu component con dùng useSearchParams
import Header from '@/src/components/layout/Header';
import ResetPasswordForm from '@/src/components/auth/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="flex-1 flex items-center justify-center p-4">
        {/* Suspense giúp tránh lỗi hydration khi dùng các hooks liên quan đến URL */}
        <Suspense fallback={<div className="text-center p-4">Đang tải...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}