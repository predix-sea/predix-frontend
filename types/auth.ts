export interface NonceResponse {
  nonce: string;
  message: string;
  domain: string;
}

export interface AuthTokenResponse {
  accessToken: string;
  tokenType: string;
  sessionId: string;
}

export interface MeResponse {
  walletAddress: string;
  chainId: number;
  kycStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | string;
}

export interface SiweVerifyRequest {
  walletAddress: string;
  message: string;
  signature: string;
  chainId: number;
}
