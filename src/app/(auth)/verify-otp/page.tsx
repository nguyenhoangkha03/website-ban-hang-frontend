'use client';

import { Suspense } from 'react';
import Header from '@/src/components/layout/Header';
import OtpForm from '@/src/components/auth/OtpForm';

// Cần bọc trong Suspense vì OtpForm có dùng useSearchParams
export default function VerifyOtpPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <Suspense fallback={<div className="text-center">Đang tải...</div>}>
          <OtpForm />
        </Suspense>
      </div>
    </main>
  );
}