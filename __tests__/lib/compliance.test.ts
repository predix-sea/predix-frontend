import { describe, expect, it } from 'vitest';
import { canTrade, canBrowse, complianceFromErrorCode } from '@/lib/compliance';

describe('compliance', () => {
  it('maps CN blocked code', () => {
    expect(complianceFromErrorCode('COMPLIANCE_CN_BLOCKED')).toBe('CN_BLOCKED');
  });

  it('blocks trading when CN blocked', () => {
    expect(canTrade('CN_BLOCKED', true)).toBe(false);
    expect(canBrowse('CN_BLOCKED')).toBe(false);
  });

  it('blocks trading when KYC required', () => {
    expect(canTrade('KYC_REQUIRED', false)).toBe(false);
    expect(canBrowse('KYC_REQUIRED')).toBe(true);
  });

  it('allows trading when OK and KYC approved', () => {
    expect(canTrade('OK', true)).toBe(true);
  });
});
