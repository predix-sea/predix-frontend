'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { complianceFromErrorCode } from '@/lib/compliance';
import { trackEvent } from '@/lib/analytics';
import { setComplianceHandler } from '@/services/bffClient';
import { useAuthStore } from '@/stores/authStore';
import type { ApiError } from '@/types';

export function useComplianceGuard() {
  const router = useRouter();
  const { setCompliance, logout } = useAuthStore();

  useEffect(() => {
    setComplianceHandler((error: ApiError) => {
      const state = complianceFromErrorCode(error.code);
      setCompliance(state);

      if (state === 'CN_BLOCKED') {
        trackEvent('compliance_block_redirect', { code: error.code });
        logout();
        router.replace('/compliance-blocked');
      }
    });

    return () => setComplianceHandler(null);
  }, [logout, router, setCompliance]);
}
