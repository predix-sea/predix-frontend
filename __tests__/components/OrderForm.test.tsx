import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OrderForm } from '@/components/trading/OrderForm';
import { useAuthStore } from '@/stores/authStore';

const market = {
  id: 'm1',
  title: 'Test',
  status: 'OPEN' as const,
  outcomes: [
    { id: 'yes', label: 'Yes' },
    { id: 'no', label: 'No' },
  ],
};

describe('OrderForm', () => {
  it('shows trading disabled when KYC not approved', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      compliance: 'KYC_REQUIRED',
      user: { walletAddress: '0x0', chainId: 1, kycStatus: 'PENDING' },
    });

    const qc = new QueryClient();
    render(
      <QueryClientProvider client={qc}>
        <OrderForm market={market} />
      </QueryClientProvider>,
    );

    expect(screen.getByRole('button', { name: /Trading Disabled/i })).toBeDisabled();
  });
});
