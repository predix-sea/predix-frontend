'use client';

import { useCallback, useState } from 'react';
import { BrowserProvider } from 'ethers';
import { authService } from '@/services/authService';
import { mapApiError } from '@/services/bffClient';
import { useAuthStore } from '@/stores/authStore';
import { trackEvent } from '@/lib/analytics';
import type { ApiError } from '@/types';

const DEFAULT_CHAIN_ID = Number(process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID ?? 1);

export function useSiweLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setToken, setWallet, setUser } = useAuthStore();

  const connectAndLogin = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not detected. Please install a Web3 wallet.');
      }

      const provider = new BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);

      setWallet(address, chainId);

      const nonceRes = await authService.getNonce();
      const message = nonceRes.message;

      let signature: string;
      try {
        signature = await signer.signMessage(message);
      } catch {
        throw { code: 'AUTH_INVALID_SIGNATURE', message: 'Signature rejected' } satisfies ApiError;
      }

      const tokenRes = await authService.verify({
        walletAddress: address,
        message,
        signature,
        chainId: chainId || DEFAULT_CHAIN_ID,
      });

      setToken(tokenRes.accessToken);

      const me = await authService.me();
      setUser(me);

      trackEvent('login_success', { wallet: address });
    } catch (err) {
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
    }
  }, [setToken, setWallet, setUser]);

  return { connectAndLogin, loading, error, clearError: () => setError(null) };
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      isMetaMask?: boolean;
    };
  }
}
