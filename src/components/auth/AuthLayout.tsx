'use client';

import { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

type AuthMode = 'login' | 'register';

interface AuthLayoutProps {
  initialMode?: AuthMode;
}

export default function AuthLayout({ initialMode = 'login' }: AuthLayoutProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Trigger page enter animation on first load
    setTimeout(() => setIsInitialLoad(false), 50);
  }, []);

  const handleSwitchToRegister = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setMode('register');
      setIsAnimating(false);
    }, 600);
  };

  const handleSwitchToLogin = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setMode('login');
      setIsAnimating(false);
    }, 600);
  };

  const isLogin = mode === 'login';

  return (
    <div className={`min-h-screen bg-white flex items-center justify-center overflow-hidden ${isInitialLoad ? 'page-enter-slide' : ''}`} style={{
      backgroundImage: 'url(/images/image.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      {/* WHITE WRAPPER - Bọc cả 2 phần */}
      <div className="w-full flex lg:mx-auto lg:max-w-6xl bg-zinc-50 rounded-2xl overflow-hidden m-4">
        {/* LEFT SIDE - Welcome/Form (hoán đổi theo mode) */}
        {isLogin ? (
          // Login: LEFT = Image with Text Overlay
          <div className={`hidden lg:flex w-1/2 items-center justify-center p-8 ${
            isAnimating ? 'auth-left-exit-right' : 'form-fade-in'
          }`} key="login-left">
            <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-2xl">
              {/* Background Image */}
              <img 
                src="/images/BG.png" 
                alt="Rice Green" 
                className="w-full h-full object-cover"
              />
              
              {/* Text Overlay */}
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-8">
                <div className="text-center max-w-sm">
                  <img 
                    src="/images/logo.png" 
                    alt="Logo" 
                    className="w-32 h-32 mx-auto mb-4"
                  />
                  <h2 className="text-4xl font-bold text-white mb-4">
                    Chào mừng trở lại!
                  </h2>
                  <p className="text-lg text-white/90 mb-8">
                    Đăng nhập để tiếp tục hành trình mua sắm của bạn
                  </p>
                  <div className="pt-8 border-t border-white/30">
                    <p className="text-white mb-3">Chưa có tài khoản?</p>
                    <button
                      onClick={handleSwitchToRegister}
                      className="w-full bg-white text-green-600 font-bold py-3 rounded-lg hover:bg-gray-100 transition-all"
                    >
                      Đăng ký ngay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Register: LEFT = Form (fade-in after animation)
          <div className={`w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8 ${
            isAnimating ? 'auth-left-exit-right' : 'form-fade-in'
          }`} key="register-left">
            <div className="w-full max-w-md">
              <RegisterForm onSwitchToLogin={handleSwitchToLogin} />
            </div>
          </div>
        )}

        {/* RIGHT SIDE - Form/Welcome (hoán đổi theo mode) */}
        {isLogin ? (
          // Login: RIGHT = Form (fade-in after animation)
          <div className={`w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8 ${
            isAnimating ? 'auth-right-exit-left' : 'form-fade-in'
          }`} key="login-right">
            <div className="w-full max-w-md">
              <LoginForm onSwitchToRegister={handleSwitchToRegister} />
            </div>
          </div>
        ) : (
          // Register: RIGHT = Image with Text Overlay
          <div className={`hidden lg:flex w-1/2 items-center justify-center p-8 ${
            isAnimating ? 'auth-right-exit-left' : 'form-fade-in'
          }`} key="register-right">
            <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-2xl">
              {/* Background Image */}
              <img 
                src="/images/luachinh.png" 
                alt="Rice Gold" 
                className="w-full h-full object-cover"
              />
              
              {/* Text Overlay */}
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-8">
                <div className="text-center max-w-sm">
                  <img 
                    src="/images/logo.png" 
                    alt="Logo" 
                    className="w-32 h-32 mx-auto mb-4"
                  />
                  <h2 className="text-4xl font-bold text-white mb-4">
                    Bắt đầu hành trình của bạn
                  </h2>
                  <p className="text-lg text-white/90 mb-8">
                    Đăng ký tài khoản để khám phá những sản phẩm nông sân sạch chất lượng cao
                  </p>
                  <div className="pt-8 border-t border-white/30">
                    <p className="text-white mb-3">Đã có tài khoản?</p>
                    <button
                      onClick={handleSwitchToLogin}
                      className="w-full bg-white text-green-600 font-bold py-3 rounded-lg hover:bg-gray-200 hover:shadow-lg transition-all border-2 border-white"
                    >
                      Đăng nhập ngay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
