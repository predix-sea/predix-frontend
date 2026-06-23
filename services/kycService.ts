import { bffRequest, mapApiError } from '@/services/bffClient';

const KYC_PENDING_KEY = 'predix-kyc-pending';

export interface KycSubmitPayload {
  country: string;
  fullName?: string;
  dateOfBirth?: string;
  idType: string;
  walletAddress: string;
}

export interface KycSubmitResult {
  status: 'PENDING';
  mock?: boolean;
}

export function getPendingKycFromStorage(): KycSubmitPayload & { submittedAt: number } | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(KYC_PENDING_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as KycSubmitPayload & { submittedAt: number };
  } catch {
    return null;
  }
}

export async function submitKyc(payload: KycSubmitPayload): Promise<KycSubmitResult> {
  try {
    await bffRequest<{ status: string }>('/api/v1/compliance/kyc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return { status: 'PENDING' };
  } catch (err) {
    const apiErr = mapApiError(err);
    if (apiErr.status !== 404 && apiErr.status !== 502 && apiErr.status !== 0) {
      throw err;
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(
        KYC_PENDING_KEY,
        JSON.stringify({ ...payload, submittedAt: Date.now() }),
      );
    }
    return { status: 'PENDING', mock: true };
  }
}
