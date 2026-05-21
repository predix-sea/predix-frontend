'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

const PUBLIC_PATHS = ['/login', '/compliance-blocked'];

export function useAuthGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, compliance } = useAuthStore();

  useEffect(() => {
    if (compliance === 'CN_BLOCKED') {
      if (pathname !== '/compliance-blocked') {
        router.replace('/compliance-blocked');
      }
      return;
    }

    const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
    if (!isPublic && !isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [compliance, isAuthenticated, pathname, router]);
}
