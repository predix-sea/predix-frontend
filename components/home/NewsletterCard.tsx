'use client';

import { useState } from 'react';
import { useUiStore } from '@/stores/uiStore';
import { useTranslation } from '@/hooks/useTranslation';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterCard() {
  const { t } = useTranslation();
  const setToast = useUiStore((s) => s.setToast);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setError(t('home.newsletter.invalidEmail'));
      return;
    }
    setError(null);
    setEmail('');
    setToast({ message: t('home.newsletter.success'), type: 'success' });
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="text-sm font-semibold text-text-primary">{t('home.newsletter.title')}</h3>
      <p className="mt-1 text-xs text-text-secondary">{t('home.newsletter.subtitle')}</p>

      <form onSubmit={handleSubmit} className="mt-3 space-y-2">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(null);
          }}
          placeholder={t('home.newsletter.placeholder')}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
        />
        {error && <p className="text-xs text-no">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-lg bg-brand-blue py-2 text-sm font-semibold text-white transition hover:bg-brand-blue/90"
        >
          {t('home.newsletter.cta')}
        </button>
      </form>
    </div>
  );
}
