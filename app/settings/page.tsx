'use client';

import { LanguagePicker } from '@/components/settings/LanguagePicker';
import { useTranslation } from '@/hooks/useTranslation';

export default function SettingsPage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">{t('settings.title')}</h1>
      </div>

      <LanguagePicker />
    </div>
  );
}
