import { useState } from 'react';
import { LoginFormData, RegisterFormData } from '@/types/auth.schema';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const useAuthApi = () => {
  const [error, setError] = useState<string | null>(null);

  const login = async ({ email, password }: LoginFormData) => {
    setError(null);

    try {
      const response = await fetch(`${API_URL}/accounts/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier: email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', data.data.tokens.accessToken);
        localStorage.setItem('refreshToken', data.data.tokens.refreshToken);
        localStorage.setItem('isAuthenticated', 'true');
      }

      return data;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
      if (typeof window !== 'undefined') {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
      throw err;
    }
  };

  const register = async (userData: RegisterFormData) => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      toast.success('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
      return data;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
      throw err;
    }
  };

  const loginAsDemo = () => {
    return login({ email: 'customer@example.com', password: 'password' });
  };

  return { login, register, loginAsDemo, error };
};
