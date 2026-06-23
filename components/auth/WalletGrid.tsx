'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { useUiStore } from '@/stores/uiStore';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { cn } from '@/lib/cn';
import {
  AuthProviderIcon,
  WALLET_PROVIDER_LABELS,
  WALLET_PROVIDER_ORDER,
  type WalletProviderId,
} from './AuthProviderIcons';

interface WalletGridProps {
  onMetaMask: () => void;
  loading?: boolean;
}

export function WalletGrid({ onMetaMask, loading }: WalletGridProps) {
  const { t } = useTranslation();
  const setToast = useUiStore((s) => s.setToast);

  const handleClick = (id: WalletProviderId) => {
    if (id === 'metamask') {
      onMetaMask();
      return;
    }
    setToast({ message: t('auth.comingSoon'), type: 'info' });
  };

  return (
    <div className="grid grid-cols-4 gap-2.5">
      {WALLET_PROVIDER_ORDER.map((id) => {
        const isMetaMask = id === 'metamask';
        const label = WALLET_PROVIDER_LABELS[id];

        return (
          <button
            key={id}
            type="button"
            data-wallet-id={id}
            disabled={loading && isMetaMask}
            onClick={() => handleClick(id)}
            title={label}
            aria-label={label}
            className={cn(
              'flex aspect-square items-center justify-center rounded-xl border border-border bg-white transition hover:border-gray-300',
              loading && isMetaMask && 'opacity-60',
            )}
          >
            {loading && isMetaMask ? (
              <LoadingSpinner className="h-7 w-7" />
            ) : (
              <AuthProviderIcon id={id} className="h-7 w-7" />
            )}
          </button>
        );
      })}
    </div>
  );
}
