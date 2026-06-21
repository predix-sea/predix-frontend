import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OrderForm } from '@/components/trading/OrderForm';
import { useAuthStore } from '@/stores/authStore';
import { useLocaleStore } from '@/stores/localeStore';
import { useUiStore } from '@/stores/uiStore';

const market = {
  id: 'm1',
  title: 'Test',
  status: 'OPEN' as const,
  outcomes: [
    { id: 'yes', label: 'Yes' },
    { id: 'no', label: 'No' },
  ],
};

function renderOrderForm() {
  const qc = new QueryClient();
  return render(
    <QueryClientProvider client={qc}>
      <OrderForm market={market} />
    </QueryClientProvider>,
  );
}

describe('OrderForm', () => {
  beforeEach(() => {
    cleanup();
    useLocaleStore.setState({ locale: 'en' });
    useUiStore.setState({
      activeModal: 'none',
      authModal: { mode: 'login', step: 'wallet' },
    });
  });

  it('shows trading disabled when KYC not approved', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      compliance: 'KYC_REQUIRED',
      user: { walletAddress: '0x0', chainId: 1, kycStatus: 'PENDING' },
    });

    renderOrderForm();

    expect(screen.getByRole('button', { name: /Trading Disabled/i })).toBeDisabled();
  });

  it('keeps the form interactive when unauthenticated and opens signup on submit', () => {
    useAuthStore.setState({
      isAuthenticated: false,
      compliance: 'OK',
      user: null,
    });

    const openAuthModal = vi.spyOn(useUiStore.getState(), 'openAuthModal');
    renderOrderForm();

    expect(screen.getAllByRole('button', { name: 'Sign up to trade' })[0]).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Buy' })).toBeEnabled();
    expect(screen.queryByText(/KYC verification required/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: 'Sign up to trade' })[0]);

    expect(openAuthModal).toHaveBeenCalledWith('signup');
    expect(screen.getByText('Connect a wallet to place orders')).toBeInTheDocument();
  });
});
