import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MarketCard } from '@/components/market/MarketCard';
import { useAuthStore } from '@/stores/authStore';
import { useLocaleStore } from '@/stores/localeStore';
import { useUiStore } from '@/stores/uiStore';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const market = {
  id: 'm1',
  title: 'Will BTC hit 100k?',
  status: 'OPEN' as const,
  volume: 50000,
  outcomes: [
    { id: 'yes', label: 'Yes' },
    { id: 'no', label: 'No' },
  ],
};

describe('MarketCard trade gate', () => {
  beforeEach(() => {
    useLocaleStore.setState({ locale: 'en' });
    useUiStore.setState({
      activeModal: 'none',
      authModal: { mode: 'login', step: 'wallet' },
    });
  });

  it('opens signup modal instead of navigating when unauthenticated user clicks Yes', () => {
    useAuthStore.setState({ isAuthenticated: false });
    const openAuthModal = vi.spyOn(useUiStore.getState(), 'openAuthModal');

    render(<MarketCard market={market} />);
    fireEvent.click(screen.getByRole('link', { name: 'Yes' }));

    expect(openAuthModal).toHaveBeenCalledWith('signup');
  });
});
