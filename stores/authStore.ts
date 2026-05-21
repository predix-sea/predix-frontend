import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ComplianceState } from '@/lib/compliance';
import type { MeResponse } from '@/types';

const TOKEN_KEY = 'predix_access_token';

interface AuthState {
  accessToken: string | null;
  walletAddress: string | null;
  chainId: number | null;
  user: MeResponse | null;
  isAuthenticated: boolean;
  compliance: ComplianceState;
  setToken: (token: string | null) => void;
  setWallet: (address: string | null, chainId: number | null) => void;
  setUser: (user: MeResponse | null) => void;
  setCompliance: (state: ComplianceState) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      walletAddress: null,
      chainId: null,
      user: null,
      isAuthenticated: false,
      compliance: 'OK',
      setToken: (token) =>
        set({
          accessToken: token,
          isAuthenticated: !!token,
        }),
      setWallet: (address, chainId) => set({ walletAddress: address, chainId }),
      setUser: (user) => set({ user }),
      setCompliance: (compliance) => set({ compliance }),
      logout: () =>
        set({
          accessToken: null,
          walletAddress: null,
          chainId: null,
          user: null,
          isAuthenticated: false,
          compliance: 'OK',
        }),
    }),
    {
      name: 'predix-auth',
      partialize: (s) => ({
        accessToken: s.accessToken,
        walletAddress: s.walletAddress,
        chainId: s.chainId,
      }),
    },
  ),
);

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return useAuthStore.getState().accessToken;
}

export function clearStoredToken() {
  useAuthStore.getState().logout();
}
