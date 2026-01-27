'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/supabase';
import { useAuthStore } from '@/stores/useAuthStore';
import { api } from '@/lib/axios'; 
import { Loader2 } from 'lucide-react'; 

// ❌ Đã xóa VerifyPhoneModal

export default function SocialAuthListener() {
  const { isAuthenticated, login } = useAuthStore(); 
  const processingSessionId = useRef<string | null>(null);

  const syncMutation = useMutation({
    mutationFn: async (payload: any) => {
       const res = await api.post('/cs/accounts/social-login', payload);
       return res.data; 
    },
    onSuccess: (res) => {
      const { customer, accessToken } = res.data;

      if (customer && accessToken) {
        // 1. Lưu vào Store
        login(customer, accessToken);
        
        // 2. ✅ Redirect thẳng về trang chủ
        console.log("🚀 Đăng nhập thành công -> Về trang chủ");
        window.location.href = '/'; 
      }
    },
    onError: (error: any) => {
        console.error("❌ Lỗi đồng bộ Social:", error);
        supabase.auth.signOut();
        processingSessionId.current = null;
        const msg = error?.response?.data?.message || "Đăng nhập thất bại";
        alert(`Lỗi: ${msg}`);
    }
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session && !isAuthenticated) {
        if (processingSessionId.current === session.access_token) return;
        processingSessionId.current = session.access_token;

        const user = session.user;
        const provider = user.app_metadata.provider; 

        if (provider === 'google' || provider === 'facebook') {
            console.log(`🔄 Syncing ${provider}...`);
            const payload = {
                uid: user.id, 
                email: user.email || '',
                name: user.user_metadata.full_name || user.user_metadata.name || 'Khách hàng mới',
                avatar: user.user_metadata.avatar_url || '',
                provider: provider.toUpperCase() 
            };
            syncMutation.mutate(payload);
        }
      }
      if (event === 'SIGNED_OUT') processingSessionId.current = null;
    });
    return () => subscription.unsubscribe();
  }, [isAuthenticated]);

  // Chỉ còn lại cái màn hình Loading thôi
  return (
      <>
        {syncMutation.isPending && (
            <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
                    <Loader2 className="h-12 w-12 text-[#009f4d] animate-spin" />
                    <p className="text-gray-600 font-medium text-lg">Đang kết nối tài khoản...</p>
                </div>
            </div>
        )}
      </>
  );
}