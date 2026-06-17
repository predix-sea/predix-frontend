'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { useSiweLogin } from '@/hooks/useSiweLogin';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useTranslation } from '@/hooks/useTranslation';

function LoginContent() {
  const { connectAndLogin, loading, error, clearError } = useSiweLogin();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/';
  const { t } = useTranslation();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(redirect);
    }
  }, [isAuthenticated, redirect, router]);

  return (
    <div className="mx-auto max-w-md py-16">
      <h1 className="text-2xl font-bold text-text-primary">{t('login.title')}</h1>
      <p className="mt-2 text-text-secondary">{t('login.subtitle')}</p>

      <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-card">
        {error && (
          <div className="mb-4 rounded-md bg-no/10 p-3 text-sm text-no">
            {error}
            <button type="button" className="ml-2 underline" onClick={clearError}>
              {t('common.dismiss')}
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => void connectAndLogin()}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-blue py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? (
            <>
              <LoadingSpinner className="h-4 w-4" />
              {t('login.signingIn')}
            </>
          ) : (
            t('login.connectMetaMask')
          )}
        </button>

        <ol className="mt-6 space-y-2 text-xs text-text-secondary">
          <li>1. {t('login.step1')}</li>
          <li>2. {t('login.step2')}</li>
          <li>3. {t('login.step3')}</li>
        </ol>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <LoadingSpinner />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
