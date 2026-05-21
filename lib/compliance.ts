import type { ApiErrorCode } from '@/types';

export type ComplianceState =
  | 'OK'
  | 'CN_BLOCKED'
  | 'KYC_REQUIRED'
  | 'UNKNOWN';

export function complianceFromErrorCode(code: ApiErrorCode | string): ComplianceState {
  if (code === 'COMPLIANCE_CN_BLOCKED') return 'CN_BLOCKED';
  if (code === 'COMPLIANCE_KYC_REQUIRED') return 'KYC_REQUIRED';
  return 'UNKNOWN';
}

export function canTrade(compliance: ComplianceState, kycApproved: boolean): boolean {
  if (compliance === 'CN_BLOCKED') return false;
  if (compliance === 'KYC_REQUIRED' || !kycApproved) return false;
  return true;
}

export function canBrowse(compliance: ComplianceState): boolean {
  return compliance !== 'CN_BLOCKED';
}
