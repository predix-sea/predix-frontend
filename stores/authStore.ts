import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ComplianceState } from '@/lib/compliance';
import type { MeResponse } from '@/types';

interface AuthState {
  accessToken: string | null;
  walletAddress: string | null;
  chainId: number | null;
  user: MeResponse | null;
  isAuthenticated: boolean;
  compliance: ComplianceState;
  registerKycSubmitted: boolean;
  setToken: (token: string | null) => void;
  setWallet: (address: string | null, chainId: number | null) => void;
  setUser: (user: MeResponse | null) => void;
  setCompliance: (state: ComplianceState) => void;
  setRegisterKycSubmitted: (value: boolean) => void;
  setUserKycStatus: (status: MeResponse['kycStatus']) => void;
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
      registerKycSubmitted: false,
      setToken: (token) =>
        set({
          accessToken: token,
          isAuthenticated: !!token,
        }),
      setWallet: (address, chainId) => set({ walletAddress: address, chainId }),
      setUser: (user) => set({ user }),
      setCompliance: (compliance) => set({ compliance }),
      setRegisterKycSubmitted: (registerKycSubmitted) => set({ registerKycSubmitted }),
      setUserKycStatus: (kycStatus) =>
        set((s) => ({
          user: s.user ? { ...s.user, kycStatus } : s.user,
          compliance: kycStatus === 'APPROVED' ? 'OK' : 'KYC_REQUIRED',
        })),
      logout: () =>
        set({
          accessToken: null,
          walletAddress: null,
          chainId: null,
          user: null,
          isAuthenticated: false,
          compliance: 'OK',
          registerKycSubmitted: false,
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
