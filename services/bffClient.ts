import type { ApiError, ApiResponse } from '@/types';
import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';

const DEFAULT_BASE =
  typeof window !== 'undefined'
    ? (process.env.NEXT_PUBLIC_BFF_BASE_URL ?? '/api/bff')
    : (process.env.BFF_BASE_URL ?? 'http://localhost:8080');

export type TokenGetter = () => string | null;
export type ComplianceHandler = (error: ApiError) => void;

let tokenGetter: TokenGetter = () => null;
let complianceHandler: ComplianceHandler | null = null;

export function setTokenGetter(getter: TokenGetter) {
  tokenGetter = getter;
}

export function setComplianceHandler(handler: ComplianceHandler | null) {
  complianceHandler = handler;
}

export function getBffBaseUrl(): string {
  return DEFAULT_BASE;
}

function generateTraceId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `trace-${Date.now()}`;
}

export async function bffRequest<T>(
  path: string,
  options: RequestInit & { skipAuth?: boolean } = {},
): Promise<T> {
  const base = getBffBaseUrl();
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`;
  const traceId = generateTraceId();

  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  headers.set('X-Trace-Id', traceId);

  if (!options.skipAuth) {
    const token = tokenGetter();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  const responseTraceId = response.headers.get('X-Trace-Id') ?? traceId;

  if (response.status === 401 && !options.skipAuth) {
    if (typeof window !== 'undefined' && tokenGetter()) {
      useAuthStore.getState().logout();
      useUiStore.getState().openAuthModal('login');
    }

    const err: ApiError = {
      code: 'AUTH_INVALID_TOKEN',
      message: 'Session expired',
      status: 401,
      traceId: responseTraceId,
    };
    throw err;
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    if (!response.ok) {
      throw {
        code: 'INTERNAL_ERROR',
        message: response.statusText || 'Request failed',
        status: response.status,
        traceId: responseTraceId,
      } satisfies ApiError;
    }
    return undefined as T;
  }

  const body = (await response.json()) as ApiResponse<T> | ApiError;

  if (!response.ok || ('code' in body && body.code !== 'OK')) {
    const apiError: ApiError = {
      code: 'code' in body ? body.code : 'INTERNAL_ERROR',
      message: 'message' in body ? body.message : 'Request failed',
      traceId: 'traceId' in body ? body.traceId : responseTraceId,
      status: response.status,
    };

    if (
      apiError.code === 'COMPLIANCE_CN_BLOCKED' ||
      apiError.code === 'COMPLIANCE_KYC_REQUIRED'
    ) {
      complianceHandler?.(apiError);
    }

    throw apiError;
  }

  return (body as ApiResponse<T>).data;
}

export function mapApiError(error: unknown): ApiError {
  if (error && typeof error === 'object' && 'code' in error) {
    return error as ApiError;
  }
  return {
    code: 'INTERNAL_ERROR',
    message: error instanceof Error ? error.message : 'Unknown error',
  };
}
