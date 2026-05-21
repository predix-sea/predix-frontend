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
    errors.push('Size must be greater than 0');
  } else if (!hasValidDecimals(values.size, SIZE_DECIMALS)) {
    errors.push(`Size supports up to ${SIZE_DECIMALS} decimal places`);
  }

  if (values.type === 'LIMIT') {
    const price = parseFloat(values.price);
    if (!values.price || Number.isNaN(price) || price <= 0) {
      errors.push('Limit price must be greater than 0');
    } else if (price > 1) {
      errors.push('Price must be between 0 and 1 for prediction shares');
    } else if (!hasValidDecimals(values.price, PRICE_DECIMALS)) {
      errors.push(`Price supports up to ${PRICE_DECIMALS} decimal places`);
    }
  }

  return { valid: errors.length === 0, errors };
}

function hasValidDecimals(value: string, maxDecimals: number): boolean {
  const parts = value.split('.');
  if (parts.length === 1) return true;
  return parts[1].length <= maxDecimals;
}
