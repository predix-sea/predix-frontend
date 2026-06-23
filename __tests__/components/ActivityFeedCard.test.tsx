import { beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { ActivityFeedCard } from '@/components/home/ActivityFeedCard';
import { useLocaleStore } from '@/stores/localeStore';
import type { Market } from '@/types';

function makeMarkets(count: number): Market[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `market-${i}`,
    title: `Market title ${i}`,
    status: 'OPEN' as const,
    outcomes: [{ id: 'yes', label: 'Yes', probability: 0.5 }],
    volume: 1000,
    category: 'politics',
    closesAt: '2026-12-31T00:00:00.000Z',
  }));
}

describe('ActivityFeedCard', () => {
  beforeEach(() => {
    cleanup();
    useLocaleStore.setState({ locale: 'en' });
  });

  it('shows 4 items collapsed by default', () => {
    render(<ActivityFeedCard markets={makeMarkets(12)} />);
    expect(screen.getAllByRole('link')).toHaveLength(4);
    expect(screen.getByRole('button', { name: /show more/i })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('expands to all items and enables scroll container', () => {
    const { container } = render(<ActivityFeedCard markets={makeMarkets(12)} />);
    fireEvent.click(screen.getByRole('button', { name: /show more/i }));

    expect(screen.getAllByRole('link')).toHaveLength(12);
    expect(screen.getByRole('button', { name: /show less/i })).toHaveAttribute(
      'aria-expanded',
      'true',
    );

    const list = container.querySelector('ul');
    expect(list?.className).toContain('scroll-contained');
    expect(list?.className).toContain('calc(100vh-420px)');
  });

  it('collapses back to 4 items', () => {
    render(<ActivityFeedCard markets={makeMarkets(12)} />);
    fireEvent.click(screen.getByRole('button', { name: /show more/i }));
    fireEvent.click(screen.getByRole('button', { name: /show less/i }));

    expect(screen.getAllByRole('link')).toHaveLength(4);
  });

  it('hides expand control when four or fewer items', () => {
    render(<ActivityFeedCard markets={makeMarkets(3)} />);
    expect(screen.queryByRole('button', { name: /show more/i })).toBeNull();
    expect(screen.getAllByRole('link')).toHaveLength(3);
  });
});
