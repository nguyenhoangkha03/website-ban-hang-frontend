'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabase/supabase';
import { useSyncSocialAccount } from '@/src/hooks/api/useAuth';
import { useAuthStore } from '@/src/stores/useAuthStore';
import VerifyPhoneModal from './VerifyPhoneModal';
import { useMutation } from '@tanstack/react-query';
import { http } from '@/src/lib/http';
import { useRouter } from 'next/navigation';

export default function SocialAuthListener() {
  const syncSocialMutation = useSyncSocialAccount();
  // 👇 2. Khai báo router
  const router = useRouter(); 

  // 👇 3. Lấy thêm hàm 'login' từ Store để sửa lỗi 'login'
  const { isAuthenticated, login } = useAuthStore();
  
  // State quản lý Modal
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [currentPhone, setCurrentPhone] = useState('');
  // Sửa mutation để hứng data trả về
  const syncMutation = useMutation({
    mutationFn: async (payload: any) => {
       const res = await http.post('/accounts/social-login', payload);
       return res.data; // Backend trả về: { customer, tokens, requirePhoneCheck }
    },
    onSuccess: (data) => {
      if (data.success) {
        // Login vào Store
        login(data.data.customer, data.data.tokens.accessToken, data.data.tokens.refreshToken);
        
        // KIỂM TRA CỜ TỪ BACKEND
        if (data.data.requirePhoneCheck) {
            setCurrentPhone(data.data.customer.phone);
            setShowVerifyModal(true); // Hiện Modal xác thực
        } else {
            router.push('/');
        }
      }
    }
  });
  

  useEffect(() => {
    // Lắng nghe sự kiện thay đổi trạng thái Auth của Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      
      // Chỉ xử lý khi SIGNED_IN và chưa đăng nhập vào hệ thống Backend của mình
      if (event === 'SIGNED_IN' && session && !isAuthenticated) {
        
        const user = session.user;
        const provider = user.app_metadata.provider; // 'google' hoặc 'facebook'

        // Kiểm tra xem có phải login bằng social không
        if (provider === 'google' || provider === 'facebook') {
            console.log("Detect Social Login, Syncing with Backend...", user);
            
            // Lấy thông tin cần thiết
            const payload = {
                uid: user.id,
                email: user.email || '',
                name: user.user_metadata.full_name || user.user_metadata.name || 'User',
                avatar: user.user_metadata.avatar_url || '',
                provider: provider.toUpperCase() as 'GOOGLE' | 'FACEBOOK'
            };

            // Gọi API Backend để đồng bộ và lấy Token thật
            syncSocialMutation.mutate(payload);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [isAuthenticated]); // Dependency: Nếu đã login rồi thì không chạy nữa

  return (
      <>
        {/* Render Modal */}
        <VerifyPhoneModal 
            isOpen={showVerifyModal} 
            phone={currentPhone}
            onClose={() => {
                setShowVerifyModal(false);
                router.push('/'); // Đóng xong thì về trang chủ
            }}
        />
      </>
  );
}