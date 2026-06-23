'use client';

import { cn } from '@/lib/cn';
import { useTranslation } from '@/hooks/useTranslation';
import type { AuthModalStep } from '@/stores/uiStore';

const SIGNUP_STEPS: AuthModalStep[] = ['wallet', 'kyc', 'done'];

export function AuthModalStepper({ current }: { current: AuthModalStep }) {
  const { t } = useTranslation();
  const currentIndex = SIGNUP_STEPS.indexOf(current);

  const labels: Record<AuthModalStep, string> = {
    wallet: t('auth.stepWallet'),
    kyc: t('auth.stepKyc'),
    done: t('auth.stepDone'),
  };

  return (
    <div className="mb-6 flex items-center justify-center gap-2">
      {SIGNUP_STEPS.map((step, index) => {
        const active = index === currentIndex;
        const completed = index < currentIndex;
        return (
          <div key={step} className="flex items-center gap-2">
            {index > 0 && (
              <div
                className={cn(
                  'h-px w-6 sm:w-10',
                  completed || active ? 'bg-brand-blue' : 'bg-border',
                )}
              />
            )}
            <div className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold',
                  active && 'bg-brand-blue text-white',
                  completed && !active && 'bg-brand-blue/15 text-brand-blue',
                  !active && !completed && 'bg-background text-text-secondary',
                )}
              >
                {index + 1}
              </span>
              <span
                className={cn(
                  'hidden text-[10px] font-medium sm:block',
                  active ? 'text-brand-blue' : 'text-text-secondary',
                )}
              >
                {labels[step]}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
