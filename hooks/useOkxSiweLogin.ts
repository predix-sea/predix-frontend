'use client';

import { useCallback } from 'react';
import { getOkxProvider } from '@/lib/walletProviders';
import { runSiweLogin } from '@/lib/runSiweLogin';
import { useAuthStore } from '@/stores/authStore';

export class OkxWalletNotFoundError extends Error {
  constructor() {
    super('OKX wallet not found');
    this.name = 'OkxWalletNotFoundError';
  }
}

export function useOkxSiweLogin() {
  const connectOkx = useCallback(async () => {
    const provider = getOkxProvider();
    if (!provider) {
      throw new OkxWalletNotFoundError();
    }

    const { setToken, setWallet, setUser } = useAuthStore.getState();
    await runSiweLogin(provider, { setToken, setWallet, setUser });
  }, []);

  return { connectOkx };
}
