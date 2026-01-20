'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only check for redirect when loading is complete
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // If loading, or if not authenticated and we are about to redirect, show loading skeleton.
  if (isLoading || !isAuthenticated) {
    return <Skeleton />;
  }

  // Only render children if authenticated
  return <>{children}</>;
}
