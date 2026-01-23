'use client';

import { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import AuthBanner from './AuthBanner';

type AuthMode = 'login' | 'register';

interface AuthLayoutProps {
  initialMode?: AuthMode;
}

export default function AuthLayout({ initialMode = 'login' }: AuthLayoutProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Fix hydration mismatch
  useEffect(() => setIsMounted(true), []);

  // Hàm chuyển đổi chế độ chung
  const switchMode = (newMode: AuthMode) => {
    if (mode === newMode || isAnimating) return;
    
    setIsAnimating(true);
    // Thời gian timeout phải khớp với duration của CSS animation (ví dụ 500ms)
    setTimeout(() => {
      setMode(newMode);
      setIsAnimating(false);
    }, 500);
  };

  if (!isMounted) return null;

  const isLogin = mode === 'login';

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 transition-all duration-700"
      style={{
        backgroundImage: 'url(/images/BG.png)', // Đảm bảo ảnh này tồn tại
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Main Card Container */}
      <div className="w-full flex bg-white rounded-3xl shadow-2xl overflow-hidden max-w-6xl min-h-[600px]">
        
        {/* --- LEFT SIDE --- */}
        {isLogin ? (
          // LOGIN MODE: Banner bên Trái
          <AuthBanner
            position="left"
            isAnimating={isAnimating}
            image="/images/luaxanh.png"
            title="Chào mừng trở lại!"
            description="Đăng nhập để tiếp tục hành trình cùng nông sản sạch Nam Việt."
            promptText="Chưa có tài khoản?"
            buttonText="Đăng ký ngay"
            onSwitch={() => switchMode('register')}
          />
        ) : (
          // REGISTER MODE: Form bên Trái
          <div className={`w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white ${isAnimating ? 'form-exit' : 'form-enter'}`}>
            <div className="w-full max-w-md">
              {/* Truyền callback để nút "Đăng nhập ngay" trong form mobile hoạt động */}
              <RegisterForm onSwitchToLogin={() => switchMode('login')} />
            </div>
          </div>
        )}

        {/* --- RIGHT SIDE --- */}
        {isLogin ? (
          // LOGIN MODE: Form bên Phải
          <div className={`w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white ${isAnimating ? 'form-exit' : 'form-enter'}`}>
            <div className="w-full max-w-md">
               {/* Truyền callback để nút "Đăng ký ngay" trong form mobile hoạt động */}
              <LoginForm onSwitchToRegister={() => switchMode('register')} />
            </div>
          </div>
        ) : (
          // REGISTER MODE: Banner bên Phải
          <AuthBanner
            position="right"
            isAnimating={isAnimating}
            image="/images/luachinh.png"
            title="Bắt đầu hành trình"
            description="Đăng ký tài khoản để khám phá những sản phẩm chất lượng cao."
            promptText="Đã có tài khoản?"
            buttonText="Đăng nhập ngay"
            onSwitch={() => switchMode('login')}
          />
        )}

      </div>
    </div>
  );
}