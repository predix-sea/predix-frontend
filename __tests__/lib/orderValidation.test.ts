import { describe, expect, it } from 'vitest';
import { validateOrderForm } from '@/lib/orderValidation';

describe('validateOrderForm', () => {
  it('rejects zero size', () => {
    const r = validateOrderForm({ size: '0', price: '0.5', type: 'LIMIT' });
    expect(r.valid).toBe(false);
    expect(r.errors[0]).toContain('Size');
  });

  it('requires price for limit orders', () => {
    const r = validateOrderForm({ size: '10', price: '', type: 'LIMIT' });
    expect(r.valid).toBe(false);
  });

  it('accepts valid market order', () => {
    const r = validateOrderForm({ size: '5', price: '', type: 'MARKET' });
    expect(r.valid).toBe(true);
  });

  it('rejects price above 1', () => {
    const r = validateOrderForm({ size: '1', price: '1.5', type: 'LIMIT' });
    expect(r.valid).toBe(false);
  });
});
