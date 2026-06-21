'use client';

import type { ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { MetaMaskNotFoundError, useSiweLogin } from '@/hooks/useSiweLogin';
import { OkxWalletNotFoundError } from '@/hooks/useOkxSiweLogin';
import { useTranslation } from '@/hooks/useTranslation';
import { useUiStore } from '@/stores/uiStore';
import { AuthProviderIcon } from './AuthProviderIcons';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { cn } from '@/lib/cn';

export function SimpleWalletConnect() {
  const { t } = useTranslation();
  const setToast = useUiStore((s) => s.setToast);
  const { connectMetaMask, connectOkx, loading, activeWallet, error, clearError } =
    useSiweLogin();

  const handleMetaMask = () => {
    clearError();
    void connectMetaMask().catch((err) => {
      if (err instanceof MetaMaskNotFoundError) {
        setToast({ message: t('auth.metamaskNotFound'), type: 'info' });
      }
    });
  };

  const handleOkx = () => {
    clearError();
    void connectOkx().catch((err) => {
      if (err instanceof OkxWalletNotFoundError) {
        setToast({ message: t('auth.okxNotFound'), type: 'info' });
      }
    });
  };

  return (
    <div className="text-center">
      <Dialog.Title className="text-xl font-bold text-text-primary">
        {t('auth.welcomeTitle')}
      </Dialog.Title>
      <p className="mt-2 text-sm text-text-secondary">{t('auth.walletSubtitle')}</p>

      <div className="mt-6 flex flex-col gap-3">
        <WalletButton
          label={t('auth.continueOkx')}
          icon={<AuthProviderIcon id="okx" className="h-full w-full" />}
          iconWrapClassName="bg-black p-1.5"
          onClick={handleOkx}
          loading={loading && activeWallet === 'okx'}
          disabled={loading && activeWallet !== 'okx'}
        />
        <WalletButton
          label={t('auth.continueMetaMask')}
          icon={<AuthProviderIcon id="metamask" className="h-full w-full" />}
          iconWrapClassName="bg-[#F6851B]/10 p-1"
          onClick={handleMetaMask}
          loading={loading && activeWallet === 'metamask'}
          disabled={loading && activeWallet !== 'metamask'}
        />
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-no/10 px-3 py-2 text-left text-sm text-no">
          {error}
          <button type="button" className="ml-2 underline" onClick={clearError}>
            {t('common.dismiss')}
          </button>
        </div>
      )}
    </div>
  );
}

function WalletButton({
  label,
  icon,
  iconWrapClassName,
  onClick,
  loading,
  disabled,
}: {
  label: string;
  icon: ReactNode;
  iconWrapClassName?: string;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl border border-border bg-white px-4 py-3.5 text-left text-sm font-semibold text-text-primary transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60',
      )}
    >
      <span
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl',
          iconWrapClassName,
        )}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1 text-left">{label}</span>
      {loading && <LoadingSpinner className="h-5 w-5 shrink-0" />}
    </button>
  );
}
