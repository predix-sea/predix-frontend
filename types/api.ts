export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
  traceId: string;
  timestamp: string;
}

export type ApiErrorCode =
  | 'AUTH_INVALID_SIGNATURE'
  | 'AUTH_NONCE_EXPIRED'
  | 'AUTH_INVALID_TOKEN'
  | 'AUTH_UNAUTHORIZED'
  | 'COMPLIANCE_CN_BLOCKED'
  | 'COMPLIANCE_COUNTRY_BLOCKED'
  | 'COMPLIANCE_KYC_REQUIRED'
  | 'DOWNSTREAM_TIMEOUT'
  | 'DOWNSTREAM_UNAVAILABLE'
  | 'CUSTODY_PATH_VIOLATION'
  | 'RATE_LIMIT_EXCEEDED'
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'INTERNAL_ERROR'
  | 'ORDER_INVALID_MARKET_STATUS'
  | string;

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  traceId?: string;
  status?: number;
}

export function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    typeof (value as ApiError).code === 'string'
  );
}
