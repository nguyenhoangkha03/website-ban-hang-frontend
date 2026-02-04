// src/app/(auth)/login/page.tsx
import { Metadata } from 'next';
import AuthLayout from '@/components/auth/AuthLayout';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Đăng nhập | Nông Sản Nam Việt',
  description: 'Đăng nhập để quản lý đơn hàng và công nợ.',
};

export default function LoginPage() {

  // Ẩn chức năng đăng nhập
  // return <AuthLayout />;

  redirect('/');  
}