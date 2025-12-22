'use client';

import { useEffect } from 'react';
import { supabase } from '@/src/lib/supabase/supabase'; // Import client supabase
import { useSyncSocialAccount } from '@/src/hooks/api/useAuth';
import { useAuthStore } from '@/src/stores/useAuthStore';

export default function SocialAuthListener() {
  const syncSocialMutation = useSyncSocialAccount();
  const { isAuthenticated } = useAuthStore();

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

  return null; // Component này không render gì cả
}