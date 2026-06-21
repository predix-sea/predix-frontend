'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';
import { shouldAutoShowHowItWorks } from '@/components/onboarding/HowItWorksModal';
import {
  AUTH_WELCOME_DELAY_MS,
  isAuthWelcomeOnlyMode,
  shouldAutoShowAuthWelcome,
} from '@/lib/authWelcome';

export function AuthWelcomeAutoOpen() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const activeModal = useUiStore((s) => s.activeModal);
  const openAuthWelcomeModal = useUiStore((s) => s.openAuthWelcomeModal);
  const prevActiveModal = useRef(activeModal);
  const delayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tryOpenAuthWelcome = () => {
    if (isAuthenticated) return;
    if (!shouldAutoShowAuthWelcome()) return;
    if (useUiStore.getState().activeModal !== 'none') return;
    openAuthWelcomeModal();
  };

  useEffect(() => {
    if (isAuthenticated) return;
    if (!shouldAutoShowAuthWelcome()) return;

    if (isAuthWelcomeOnlyMode()) {
      if (activeModal === 'none') {
        tryOpenAuthWelcome();
      }
      return;
    }

    if (shouldAutoShowHowItWorks()) return;

    if (activeModal === 'none') {
      tryOpenAuthWelcome();
    }
  }, [activeModal, isAuthenticated, openAuthWelcomeModal]);

  useEffect(() => {
    const previous = prevActiveModal.current;
    prevActiveModal.current = activeModal;

    if (isAuthWelcomeOnlyMode()) return;
    if (isAuthenticated) return;
    if (!shouldAutoShowAuthWelcome()) return;

    if (previous === 'howItWorks' && activeModal === 'none') {
      if (delayTimer.current) clearTimeout(delayTimer.current);
      delayTimer.current = setTimeout(() => {
        delayTimer.current = null;
        tryOpenAuthWelcome();
      }, AUTH_WELCOME_DELAY_MS);
    }

    return () => {
      if (delayTimer.current) {
        clearTimeout(delayTimer.current);
        delayTimer.current = null;
      }
    };
  }, [activeModal, isAuthenticated, openAuthWelcomeModal]);

  return null;
}
