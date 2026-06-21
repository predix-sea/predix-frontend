'use client';

import { useCallback, useState } from 'react';
import { mapApiError } from '@/services/bffClient';
import { getMetaMaskProvider } from '@/lib/walletProviders';
import { runSiweLogin } from '@/lib/runSiweLogin';
import { useAuthStore } from '@/stores/authStore';
import { trackEvent } from '@/lib/analytics';
import { OkxWalletNotFoundError, useOkxSiweLogin } from '@/hooks/useOkxSiweLogin';

export type WalletLoginTarget = 'metamask' | 'okx';

export class MetaMaskNotFoundError extends Error {
  constructor() {
    super('MetaMask not found');
    this.name = 'MetaMaskNotFoundError';
  }
}

export function useSiweLogin() {
  const [loading, setLoading] = useState(false);
  const [activeWallet, setActiveWallet] = useState<WalletLoginTarget | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { connectOkx: connectOkxWallet } = useOkxSiweLogin();

  const runWalletLogin = useCallback(
    async (target: WalletLoginTarget, connect: () => Promise<void>) => {
      setLoading(true);
      setActiveWallet(target);
      setError(null);

      try {
        await connect();
      } catch (err) {
        if (err instanceof MetaMaskNotFoundError || err instanceof OkxWalletNotFoundError) {
          throw err;
        }

        const apiErr = mapApiError(err);
        const msg =
          apiErr.code === 'AUTH_NONCE_EXPIRED'
            ? 'Login session expired. Please try again.'
            : apiErr.code === 'AUTH_INVALID_SIGNATURE'
              ? 'Invalid signature or rejected by wallet.'
              : apiErr.message;

        setError(msg);
        trackEvent('login_failed', { code: apiErr.code });
        throw err;
      } finally {
        setLoading(false);
        setActiveWallet(null);
      }
    },
    [],
  );

  const connectMetaMask = useCallback(async () => {
    const provider = getMetaMaskProvider();
    if (!provider) {
      throw new MetaMaskNotFoundError();
    }

    const { setToken, setWallet, setUser } = useAuthStore.getState();
    await runWalletLogin('metamask', () =>
      runSiweLogin(provider, { setToken, setWallet, setUser }),
    );
  }, [runWalletLogin]);

  const connectOkx = useCallback(async () => {
    await runWalletLogin('okx', connectOkxWallet);
  }, [connectOkxWallet, runWalletLogin]);

  return {
    connectMetaMask,
    connectOkx,
    loading,
    activeWallet,
    error,
    clearError: () => setError(null),
  };
}
