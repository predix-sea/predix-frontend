import { BrowserProvider } from 'ethers';
import { authService } from '@/services/authService';
import { trackEvent } from '@/lib/analytics';
import type { Eip1193Provider } from '@/lib/walletProviders';
import type { ApiError, MeResponse } from '@/types';

const DEFAULT_CHAIN_ID = Number(process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID ?? 1);

export interface SiweLoginDeps {
  setWallet: (address: string | null, chainId: number | null) => void;
  setToken: (token: string | null) => void;
  setUser: (user: MeResponse | null) => void;
}

export async function runSiweLogin(
  ethereum: Eip1193Provider,
  deps: SiweLoginDeps,
): Promise<void> {
  const provider = new BrowserProvider(ethereum);
  await provider.send('eth_requestAccounts', []);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  const network = await provider.getNetwork();
  const chainId = Number(network.chainId);

  deps.setWallet(address, chainId);

  const nonceRes = await authService.getNonce(address);
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

  deps.setToken(tokenRes.accessToken);

  const me = await authService.me();
  deps.setUser(me);

  trackEvent('login_success', { wallet: address });
}
