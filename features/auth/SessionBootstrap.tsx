'use client';

import { useEffect } from 'react';
import { authService } from '@/services/authService';
import { mapApiError } from '@/services/bffClient';
import { complianceFromErrorCode } from '@/lib/compliance';
import { useAuthStore } from '@/stores/authStore';

/** Probe session/compliance on app boot when token exists */
export function SessionBootstrap() {
  const { accessToken, setCompliance, logout } = useAuthStore();

  useEffect(() => {
    if (!accessToken) return;

    authService
      .me()
      .catch((err) => {
        const apiErr = mapApiError(err);
        const state = complianceFromErrorCode(apiErr.code);
        if (state === 'CN_BLOCKED') {
          logout();
        }
      });
  }, [accessToken, logout, setCompliance]);

  return null;
}
