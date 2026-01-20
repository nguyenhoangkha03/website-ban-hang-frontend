'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(() => {
    if (typeof window !== 'undefined') {
      const authFlag = localStorage.getItem('isAuthenticated');
      setIsAuthenticated(authFlag === 'true');
    }
  }, []);

  useEffect(() => {
    checkAuth();
    setIsLoading(false); // Set loading to false after initial check

    // Listen for storage changes to sync auth state across tabs
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, [checkAuth]);

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Clear client-side auth flag and state
      if (typeof window !== 'undefined') {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('accessToken'); 
        localStorage.removeItem('refreshToken'); 
        document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname;
      }
      setIsAuthenticated(false);
      
      // Redirect to the login page
      router.push('/login');
    }
  };

  const loginDemo = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('accessToken', 'demo_token'); // Set a dummy token
      localStorage.setItem('refreshToken', 'demo_refresh_token'); // Set a dummy refresh token
    }
    setIsAuthenticated(true);
    router.push('/');
  };

  return { isAuthenticated, isLoading, logout, loginDemo };
};
