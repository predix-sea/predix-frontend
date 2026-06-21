'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useUiStore } from '@/stores/uiStore';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/cn';
import { StepPickMarket } from './steps/StepPickMarket';
import { StepTrade } from './steps/StepTrade';
import { StepRedeem } from './steps/StepRedeem';

const STEPS = [1, 2, 3] as const;

const HOW_IT_WORKS_DISMISSED_KEY = 'predix-how-it-works-dismissed';

export function markHowItWorksDismissed() {
  if (typeof window !== 'undefined') {
    localStorage.setItem(HOW_IT_WORKS_DISMISSED_KEY, '1');
  }
}

export function shouldAutoShowHowItWorks(): boolean {
  if (typeof window === 'undefined') return false;
  return !localStorage.getItem(HOW_IT_WORKS_DISMISSED_KEY);
}

export function HowItWorksModal() {
  const { t } = useTranslation();
  const {
    howItWorksModal,
    setHowItWorksStep,
    openAuthModal,
    dismissHowItWorks,
  } = useUiStore();
  const { step } = howItWorksModal;

  const handleClose = () => {
    dismissHowItWorks();
  };

  const handleNext = () => {
    if (step < 3) {
      setHowItWorksStep((step + 1) as 1 | 2 | 3);
      return;
    }
    markHowItWorksDismissed();
    openAuthModal('signup');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <StepPickMarket />;
      case 2:
        return <StepTrade />;
      case 3:
        return <StepRedeem />;
      default:
        return <StepPickMarket />;
    }
  };

  return (
    <Dialog.Root open onOpenChange={(v) => !v && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content className="fixed inset-0 z-[101] flex items-center justify-center p-4 outline-none">
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl animate-in fade-in slide-in-from-top-2">
            <Dialog.Close
              className="absolute right-4 top-4 rounded-lg p-1 text-text-secondary transition hover:bg-background hover:text-text-primary"
              aria-label={t('common.dismiss')}
            >
              <X className="h-5 w-5" />
            </Dialog.Close>

            <Dialog.Title className="sr-only">{t('nav.howItWorks')}</Dialog.Title>

            {renderStep()}

            <div className="mt-6 flex justify-center gap-2">
              {STEPS.map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-label={`${t('howItWorks.stepIndicator')} ${s}`}
                  aria-current={s === step ? 'step' : undefined}
                  onClick={() => setHowItWorksStep(s)}
                  className={cn(
                    'h-2 w-2 rounded-full transition',
                    s === step ? 'bg-brand-blue' : 'bg-border',
                  )}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="mt-4 w-full rounded-lg bg-brand-blue py-2.5 text-sm font-semibold text-white transition hover:bg-brand-blue/90"
            >
              {step === 3 ? t('howItWorks.getStarted') : t('howItWorks.next')}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
