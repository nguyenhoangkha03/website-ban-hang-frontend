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
    <div className={`min-h-screen bg-white flex overflow-hidden ${isInitialLoad ? 'page-enter-slide' : ''}`} style={{
      backgroundImage: 'url(/images/BG.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      {/* LEFT SIDE - Welcome/Form (hoán đổi theo mode) */}
      {isLogin ? (
        // Login: LEFT = Welcome message (exit to right when animating)
        <div className={`hidden lg:flex w-1/2 items-center justify-center p-8 ${
          isAnimating ? 'auth-left-exit-right' : 'form-fade-in'
        }`} key="login-left">
          <div className="text-center max-w-md">
            <div className="mb-8">
              <img src="/images/logo.png" alt="Logo" className="w-32 h-32 object-contain mx-auto" />
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Chào mừng trở lại!
            </h2>
            <p className="text-lg text-gray-1000 mb-8">
              Đăng nhập để tiếp tục hành trình mua sắm của bạn
            </p>
            <div className="pt-8 border-t border-green-200">
              <p className="text-gray-1000 mb-3">Chưa có tài khoản?</p>
              <button
                onClick={handleSwitchToRegister}
                className="w-full bg-white text-green-600 font-bold py-3 rounded-lg hover:bg-green-100 transition-all border border-green-200 shadow-md"
              >
                Đăng ký ngay
              </button>
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
        // Register: RIGHT = Welcome message (exit to left when animating)
        <div className={`hidden lg:flex w-1/2 items-center justify-center p-8 ${
          isAnimating ? 'auth-right-exit-left' : 'form-fade-in'
        }`} key="register-right">
          <div className="text-center max-w-md">
           <div className="mb-8">
              <img src="/images/logo.png" alt="Logo" className="w-32 h-32 object-contain mx-auto" />
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Bắt đầu hành trình của bạn
            </h2>
            <p className="text-lg text-gray-1000 mb-8">
              Đăng ký tài khoản để khám phá những sản phẩm nông sân sạch chất lượng cao
            </p>
            <div className="pt-8 border-t border-green-200">
              <p className="text-gray-1000 mb-3">Đã có tài khoản?</p>
              <button
                onClick={handleSwitchToLogin}
                className="w-full bg-white text-green-600 font-bold py-3 rounded-lg hover:bg-green-100 transition-all border border-green-200 shadow-md"
              >
                Đăng nhập ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
