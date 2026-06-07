import { bffRequest } from './bffClient';
import type { AuthTokenResponse, MeResponse, NonceResponse, SiweVerifyRequest } from '@/types';

export const authService = {
  getNonce: (address: string) =>
    bffRequest<NonceResponse>(
      `/api/v1/auth/siwe/nonce?address=${encodeURIComponent(address)}`,
      {
        method: 'GET',
        skipAuth: true,
      },
    ),

  verify: (payload: SiweVerifyRequest) =>
    bffRequest<AuthTokenResponse>('/api/v1/auth/siwe/verify', {
      method: 'POST',
      body: JSON.stringify(payload),
      skipAuth: true,
    }),

  logout: () =>
    bffRequest<null>('/api/v1/auth/logout', {
      method: 'POST',
    }),

  me: () => bffRequest<MeResponse>('/api/v1/auth/me'),
};
