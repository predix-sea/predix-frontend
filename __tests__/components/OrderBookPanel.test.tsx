import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { OrderBookPanel } from '@/components/trading/OrderBookPanel';
import { useTradingStore } from '@/stores/tradingStore';
import { useLocaleStore } from '@/stores/localeStore';

const orderbook = {
  marketId: 'm1',
  bids: [{ price: 0.61, size: 100 }],
  asks: [{ price: 0.63, size: 80 }],
  lastTradePrice: 0.62,
};

describe('OrderBookPanel', () => {
  beforeEach(() => {
    useLocaleStore.setState({ locale: 'en' });
  });

  it('renders depth rows and fills trading store on price click', () => {
    useTradingStore.setState({ limitPrice: null, bookSide: null });

    render(<OrderBookPanel orderbook={orderbook} embedded />);

    expect(screen.getByText('Best Bid')).toBeInTheDocument();
    expect(screen.getByText('Best Ask')).toBeInTheDocument();
    expect(screen.getAllByText('Spread').length).toBeGreaterThan(0);

    const [askRow] = screen.getAllByRole('button');
    fireEvent.click(askRow);

    expect(useTradingStore.getState().limitPrice).toBe('0.63');
    expect(useTradingStore.getState().bookSide).toBe('BUY');
  });

  it('shows error state', () => {
    render(
      <OrderBookPanel
        isError
        error={{ code: 'DOWNSTREAM_UNAVAILABLE', message: 'BFF unavailable' }}
        embedded
      />,
    );

    expect(screen.getByText(/Failed to load order book/i)).toBeInTheDocument();
  });
});
