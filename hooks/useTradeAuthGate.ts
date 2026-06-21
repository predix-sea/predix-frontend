'use client';

import type { MouseEvent } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';

export function useTradeAuthGate() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openAuthModal = useUiStore((s) => s.openAuthModal);

  const gateTradeNavigation = (e: MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      e.preventDefault();
      openAuthModal('signup');
    }
  };

  return { gateTradeNavigation, isAuthenticated };
}
