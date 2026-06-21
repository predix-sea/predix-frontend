'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

/** Only enforce compliance routing — browsing does not require login. */
export function useAuthGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const { compliance } = useAuthStore();

  useEffect(() => {
    if (compliance === 'CN_BLOCKED' && pathname !== '/compliance-blocked') {
      router.replace('/compliance-blocked');
    }
  }, [compliance, pathname, router]);
}
