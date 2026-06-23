'use client';

import { TradeIllustration } from '../HowItWorksIllustrations';
import { useTranslation } from '@/hooks/useTranslation';

export function StepTrade() {
  const { t } = useTranslation();

  return (
    <div className="text-center">
      <div className="h-64 rounded-xl bg-gradient-to-b from-brand-blue/10 to-brand-blue/5">
        <TradeIllustration />
      </div>
      <h3 className="mt-6 text-lg font-bold text-text-primary">{t('howItWorks.step2.title')}</h3>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{t('howItWorks.step2.body')}</p>
    </div>
  );
}
