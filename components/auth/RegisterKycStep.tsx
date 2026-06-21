'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';
import { useTranslation } from '@/hooks/useTranslation';
import { submitKyc } from '@/services/kycService';
import { SEA_COUNTRIES, ID_TYPES } from '@/lib/seaCountries';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { cn } from '@/lib/cn';

interface RegisterKycStepProps {
  onSubmitted: () => void;
}

export function RegisterKycStep({ onSubmitted }: RegisterKycStepProps) {
  const { t } = useTranslation();
  const { walletAddress, user, setUserKycStatus, setRegisterKycSubmitted, setCompliance } =
    useAuthStore();
  const setToast = useUiStore((s) => s.setToast);

  const [country, setCountry] = useState('');
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [idType, setIdType] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const address = walletAddress ?? user?.walletAddress ?? '';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileName(file?.name ?? null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!country || !idType) {
      setError(t('kyc.requiredFields'));
      return;
    }
    if (!address) {
      setError(t('kyc.walletRequired'));
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await submitKyc({
        country,
        fullName: fullName || undefined,
        dateOfBirth: dateOfBirth || undefined,
        idType,
        walletAddress: address,
      });

      setUserKycStatus('PENDING');
      setCompliance('KYC_REQUIRED');
      setRegisterKycSubmitted(true);
      setToast({ message: t('kyc.submitSuccess'), type: 'success' });
      onSubmitted();
    } catch {
      setError(t('kyc.submitError'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-bold text-text-primary">{t('auth.kycTitle')}</h2>
        <p className="mt-1 text-sm text-text-secondary">{t('kyc.tradeAfterVerify')}</p>
      </div>

      <div>
        <label htmlFor="kyc-country" className="mb-1 block text-xs font-medium text-text-secondary">
          {t('kyc.countryLabel')}
        </label>
        <select
          id="kyc-country"
          required
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-text-primary"
        >
          <option value="">{t('kyc.selectCountry')}</option>
          {SEA_COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {t(c.labelKey)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="kyc-name" className="mb-1 block text-xs font-medium text-text-secondary">
          {t('kyc.fullName')} <span className="text-text-secondary/60">({t('kyc.optional')})</span>
        </label>
        <input
          id="kyc-name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder={t('kyc.fullNamePlaceholder')}
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary"
        />
      </div>

      <div>
        <label htmlFor="kyc-dob" className="mb-1 block text-xs font-medium text-text-secondary">
          {t('kyc.dateOfBirth')} <span className="text-text-secondary/60">({t('kyc.optional')})</span>
        </label>
        <input
          id="kyc-dob"
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-text-primary"
        />
      </div>

      <div>
        <label htmlFor="kyc-id-type" className="mb-1 block text-xs font-medium text-text-secondary">
          {t('kyc.idTypeLabel')}
        </label>
        <select
          id="kyc-id-type"
          required
          value={idType}
          onChange={(e) => setIdType(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-text-primary"
        >
          <option value="">{t('kyc.selectIdType')}</option>
          {ID_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {t(type.labelKey)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-text-secondary">
          {t('kyc.uploadDocument')}
        </label>
        <label
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-background px-4 py-6 transition hover:border-brand-blue/40',
            fileName && 'border-brand-blue/30',
          )}
        >
          <Upload className="mb-2 h-6 w-6 text-text-secondary" aria-hidden />
          <span className="text-sm text-text-secondary">
            {fileName ?? t('kyc.uploadHint')}
          </span>
          <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileChange} />
        </label>
      </div>

      {error && <p className="text-sm text-no">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-blue py-2.5 text-sm font-semibold text-white transition hover:bg-brand-blue/90 disabled:opacity-50"
      >
        {submitting ? (
          <>
            <LoadingSpinner className="h-4 w-4" />
            {t('kyc.submitting')}
          </>
        ) : (
          t('kyc.submitContinue')
        )}
      </button>
    </form>
  );
}
