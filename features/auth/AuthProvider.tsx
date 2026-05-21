'use client';

import { useEffect } from 'react';
import { setTokenGetter } from '@/services/bffClient';
import { useAuthStore } from '@/stores/authStore';
import { useComplianceGuard } from '@/hooks/useComplianceGuard';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { authService } from '@/services/authService';
import { mapApiError } from '@/services/bffClient';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { accessToken, setUser, setCompliance, logout } = useAuthStore();

  useComplianceGuard();
  useAuthGuard();

  useEffect(() => {
    setTokenGetter(() => useAuthStore.getState().accessToken);
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    authService
      .me()
      .then((user) => {
        setUser(user);
        if (user.kycStatus !== 'APPROVED') {
          setCompliance('KYC_REQUIRED');
        } else {
          setCompliance('OK');
        }
      })
      .catch((err) => {
        const apiErr = mapApiError(err);
        if (apiErr.code === 'COMPLIANCE_CN_BLOCKED') {
          setCompliance('CN_BLOCKED');
          logout();
          return;
        }
        if (apiErr.status === 401 || apiErr.code === 'AUTH_INVALID_TOKEN') {
          logout();
        }
      });
  }, [accessToken, logout, setCompliance, setUser]);

  return <>{children}</>;
}
