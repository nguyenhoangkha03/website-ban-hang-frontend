'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // 👈 1. Thêm import này để sửa lỗi 'router'
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/supabase';
import { useAuthStore } from '@/stores/useAuthStore';
import { http } from '@/lib/axios';
import VerifyPhoneModal from './VerifyPhoneModal';

export default function SocialAuthListener() {
  // 👇 2. Khai báo router
  const router = useRouter(); 

  // 👇 3. Lấy thêm hàm 'login' từ Store để sửa lỗi 'login'
  const { isAuthenticated, login } = useAuthStore(); 

  // State quản lý Modal
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [currentPhone, setCurrentPhone] = useState('');

  // Mutation gọi API đồng bộ
  const syncMutation = useMutation({
    mutationFn: async (payload: any) => {
       // Gọi API Backend: POST /accounts/social-login
       const res = await http.post('/accounts/social-login', payload);
       return res.data; 
    },
    onSuccess: (data) => {
      if (data.success) {
        // Lưu Token vào Store & LocalStorage
        login(data.data.customer, data.data.tokens.accessToken, data.data.tokens.refreshToken);
        
        // KIỂM TRA CỜ TỪ BACKEND: Có cần verify SĐT không?
        if (data.data.requirePhoneCheck) {
            setCurrentPhone(data.data.customer.phone);
            setShowVerifyModal(true); // Hiện Modal xác thực
        } else {
            router.push('/'); // Chuyển về trang chủ
        }
      }
    },
    onError: (error) => {
        console.error("Lỗi đồng bộ Social:", error);
    }
  });

  useEffect(() => {
    // Lắng nghe sự kiện từ Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      
      // Chỉ xử lý khi SIGNED_IN (Đã đăng nhập GG/FB thành công) và App mình chưa đăng nhập
      if (event === 'SIGNED_IN' && session && !isAuthenticated) {
        
        const user = session.user;
        const provider = user.app_metadata.provider; 

        if (provider === 'google' || provider === 'facebook') {
            console.log("Detect Social Login...", user);
            
            const payload = {
                uid: user.id,
                email: user.email || '',
                name: user.user_metadata.full_name || user.user_metadata.name || 'User',
                avatar: user.user_metadata.avatar_url || '',
                provider: provider.toUpperCase() // 'GOOGLE' | 'FACEBOOK'
            };

            // Gọi API Backend
            syncMutation.mutate(payload);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [isAuthenticated]); 

  return (
      <>
        {/* Render Modal */}
        <VerifyPhoneModal 
            isOpen={showVerifyModal} 
            phone={currentPhone}
            onClose={() => {
                setShowVerifyModal(false);
                router.push('/'); 
            }}
        />
      </>
  );
}