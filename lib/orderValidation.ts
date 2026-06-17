import type { OrderType } from '@/types';

export interface OrderFormValues {
  size: string;
  price: string;
  type: OrderType;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

const SIZE_DECIMALS = 6;
const PRICE_DECIMALS = 4;

export function validateOrderForm(values: OrderFormValues): ValidationResult {
  const errors: string[] = [];
  const size = parseFloat(values.size);

  if (!values.size || Number.isNaN(size) || size <= 0) {
    errors.push('trading.validation.sizeGtZero');
  } else if (!hasValidDecimals(values.size, SIZE_DECIMALS)) {
    errors.push('trading.validation.sizeDecimals');
  }

  if (values.type === 'LIMIT') {
    const price = parseFloat(values.price);
    if (!values.price || Number.isNaN(price) || price <= 0) {
      errors.push('trading.validation.limitPriceGtZero');
    } else if (price > 1) {
      errors.push('trading.validation.priceRange');
    } else if (!hasValidDecimals(values.price, PRICE_DECIMALS)) {
      errors.push('trading.validation.priceDecimals');
    }
  }

  return { valid: errors.length === 0, errors };
}

function hasValidDecimals(value: string, maxDecimals: number): boolean {
  const parts = value.split('.');
  if (parts.length === 1) return true;
  return parts[1].length <= maxDecimals;
}
