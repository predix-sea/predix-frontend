import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MarketCard } from '@/components/markets/MarketCard';
import { useLocaleStore } from '@/stores/localeStore';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe('MarketCard', () => {
  beforeEach(() => {
    useLocaleStore.setState({ locale: 'en' });
  });

  it('renders market title and status', () => {
    render(
      <MarketCard
        market={{
          id: 'm1',
          title: 'Will BTC hit 100k?',
          status: 'OPEN',
          volume: 50000,
          outcomes: [{ id: 'yes', label: 'Yes' }],
        }}
      />,
    );

    expect(screen.getByText('Will BTC hit 100k?')).toBeInTheDocument();
    expect(screen.getByText('Open')).toBeInTheDocument();
  });
});
