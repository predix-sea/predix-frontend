'use client';

import { AuthModal } from '@/components/auth/AuthModal';
import { HowItWorksModal } from '@/components/onboarding/HowItWorksModal';
import { HowItWorksAutoOpen } from '@/components/onboarding/HowItWorksAutoOpen';
import { AuthWelcomeAutoOpen } from '@/components/auth/AuthWelcomeAutoOpen';
import { ToastHost } from '@/components/ui/ToastHost';
import { useUiStore } from '@/stores/uiStore';

export function GlobalModals() {
  const activeModal = useUiStore((s) => s.activeModal);

  return (
    <>
      {activeModal === 'auth' && <AuthModal />}
      {activeModal === 'howItWorks' && <HowItWorksModal />}
      <HowItWorksAutoOpen />
      <AuthWelcomeAutoOpen />
      <ToastHost />
    </>
  );
}
