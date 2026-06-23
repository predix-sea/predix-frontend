'use client';

import { useEffect } from 'react';
import { shouldAutoShowHowItWorks } from '@/components/onboarding/HowItWorksModal';
import { isAuthWelcomeOnlyMode } from '@/lib/authWelcome';
import { useUiStore } from '@/stores/uiStore';

export function HowItWorksAutoOpen() {
  const openHowItWorks = useUiStore((s) => s.openHowItWorks);

  useEffect(() => {
    if (isAuthWelcomeOnlyMode()) return;
    if (shouldAutoShowHowItWorks()) {
      openHowItWorks(1);
    }
  }, [openHowItWorks]);

  return null;
}
