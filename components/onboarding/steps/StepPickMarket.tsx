'use client';

import { PickMarketIllustration } from '../HowItWorksIllustrations';
import { useTranslation } from '@/hooks/useTranslation';

export function StepPickMarket() {
  const { t } = useTranslation();

  return (
    <div className="text-center">
      <div className="h-64 rounded-xl bg-gradient-to-b from-brand-blue/10 to-brand-blue/5">
        <PickMarketIllustration />
      </div>
      <h3 className="mt-6 text-lg font-bold text-text-primary">{t('howItWorks.step1.title')}</h3>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{t('howItWorks.step1.body')}</p>
    </div>
  );
}
