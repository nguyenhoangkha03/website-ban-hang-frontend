'use client';

import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase/supabase';
import { useAuthStore } from '@/stores/useAuthStore';
import { Loader2 } from 'lucide-react'; 
// Import Hook API
import { useSyncSocialAccount } from '@/hooks/api/useAuthApi';
import { toast } from 'sonner';

export default function SocialAuthListener() {
  const { isAuthenticated } = useAuthStore(); 
  const processingSessionId = useRef<string | null>(null);

  // Hook gọi API sync xuống Backend
  const syncMutation = useSyncSocialAccount();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      
      // Chỉ xử lý khi có session và hệ thống của mình chưa nhận diện đăng nhập
      if (event === 'SIGNED_IN' && session && !isAuthenticated) {
        
        // 1. Chặn xử lý lặp lại (Debounce)
        if (processingSessionId.current === session.access_token) return;
        processingSessionId.current = session.access_token;

        const user = session.user;
        // Dùng optional chaining (?.) để tránh crash nếu metadata null
        const provider = user.app_metadata?.provider; 

        // 2. Chỉ xử lý Google/Facebook (Zalo đi đường khác)
        if (provider === 'google' || provider === 'facebook') {
            console.log(`🔄 Phát hiện login ${provider}, đang đồng bộ...`);
            
            const payload = {
                uid: user.id, 
                email: user.email || '',
                // Ưu tiên full_name, fallback sang name, cuối cùng là chuỗi mặc định
                name: user.user_metadata?.full_name || user.user_metadata?.name || 'Khách hàng',
                avatar: user.user_metadata?.avatar_url || '',
                provider: provider.toUpperCase() 
            };
            
            // Gọi API
            syncMutation.mutate(payload);
        }
      }

      // Reset ref khi đăng xuất để lần sau login lại được
      if (event === 'SIGNED_OUT') {
          processingSessionId.current = null;
      }
    });

    return () => subscription.unsubscribe();
  }, [isAuthenticated, syncMutation]);

  // 3. Render Loading Overlay (Che toàn màn hình)
  // Chỉ hiện khi đang gọi API Sync
  if (!syncMutation.isPending) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-300">
            {/* Logo hoặc Spinner */}
            <div className="relative">
                <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-25"></div>
                <div className="relative bg-white p-4 rounded-full shadow-xl">
                    <Loader2 className="h-10 w-10 text-[#009f4d] animate-spin" />
                </div>
            </div>
            
            <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-gray-800">Đang kết nối...</h3>
                <p className="text-gray-500 font-medium">Vui lòng đợi trong giây lát</p>
            </div>
        </div>
    </div>
  );
}