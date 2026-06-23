'use client';

import { useMemo, useState } from 'react';
import { PriceChart } from './PriceChart';
import { OrderBookPanel } from './OrderBookPanel';
import { formatCentsPrecise, getYesPrice } from '@/lib/marketPricing';
import { ClientLiveText } from '@/components/ui/ClientLiveText';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/cn';
import type { Market, OrderBook } from '@/types';

type BottomTab = 'orderbook' | 'activity';

interface MockTrade {
  id: string;
  side: 'BUY' | 'SELL';
  outcome: 'Yes' | 'No';
  price: number;
  size: number;
  time: string;
}

const MOCK_TRADE_TIMES = [
  '2025-06-01T14:00:00.000Z',
  '2025-06-01T13:58:00.000Z',
  '2025-06-01T13:56:00.000Z',
] as const;

function generateMockTrades(yesPrice: number): MockTrade[] {
  return [
    { id: 't1', side: 'BUY', outcome: 'Yes', price: yesPrice, size: 120, time: MOCK_TRADE_TIMES[0] },
    {
      id: 't2',
      side: 'SELL',
      outcome: 'Yes',
      price: yesPrice - 0.01,
      size: 45,
      time: MOCK_TRADE_TIMES[1],
    },
    {
      id: 't3',
      side: 'BUY',
      outcome: 'No',
      price: 1 - yesPrice,
      size: 80,
      time: MOCK_TRADE_TIMES[2],
    },
  ];
}

function ActivityList({ yesPrice, hasLiveData }: { yesPrice: number; hasLiveData: boolean }) {
  const { t } = useTranslation();
  const trades = useMemo(() => generateMockTrades(yesPrice), [yesPrice]);

  if (!hasLiveData && trades.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-text-secondary">{t('trading.noRecentTrades')}</p>
    );
  }

  const sideLabel = (side: 'BUY' | 'SELL') =>
    side === 'BUY' ? t('trading.buy') : t('trading.sell');
  const outcomeLabel = (outcome: 'Yes' | 'No') =>
    outcome === 'Yes' ? t('trading.yes') : t('trading.no');

  return (
    <div>
      <div className="divide-y divide-border">
        {trades.map((trade) => (
          <div key={trade.id} className="flex items-center justify-between py-2.5 text-sm">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'font-medium',
                  trade.outcome === 'Yes' ? 'text-yes' : 'text-no',
                )}
              >
                {sideLabel(trade.side)} {outcomeLabel(trade.outcome)}
              </span>
              <span className="font-mono tabular-nums text-text-primary">
                {formatCentsPrecise(trade.price)}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-text-secondary">
              <span>
                {trade.size} {t('trading.sharesUnit')}
              </span>
              <ClientLiveText placeholder="--:--">
                {() =>
                  new Date(trade.time).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                }
              </ClientLiveText>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-text-secondary">{t('trading.demoActivity')}</p>
    </div>
  );
}

interface MarketMainPanelProps {
  market: Market;
  orderbook?: OrderBook;
  isLoading?: boolean;
  isError?: boolean;
  error?: unknown;
}

export function MarketMainPanel({
  market,
  orderbook,
  isLoading,
  isError,
  error,
}: MarketMainPanelProps) {
  const { t } = useTranslation();
  const [bottomTab, setBottomTab] = useState<BottomTab>('orderbook');
  const [bookExpanded, setBookExpanded] = useState(true);
  const yesPrice = getYesPrice(market, orderbook) ?? 0.5;
  const hasLiveData = orderbook?.lastTradePrice !== undefined;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <PriceChart marketId={market.id} currentPrice={yesPrice} />
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <button
          type="button"
          className="flex w-full items-center justify-between px-4 py-3 lg:hidden"
          onClick={() => setBookExpanded((v) => !v)}
          aria-expanded={bookExpanded}
        >
          <span className="text-sm font-semibold text-text-primary">
            {bottomTab === 'orderbook' ? t('trading.tabOrderBook') : t('trading.tabActivity')}
          </span>
          <span className="text-text-secondary">{bookExpanded ? '−' : '+'}</span>
        </button>

        <div className={cn('border-b border-border px-4', !bookExpanded && 'hidden lg:block')}>
          <div className="flex gap-6" role="tablist">
            {(
              [
                { id: 'orderbook' as const, labelKey: 'trading.tabOrderBook' },
                { id: 'activity' as const, labelKey: 'trading.tabActivity' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={bottomTab === tab.id}
                onClick={() => {
                  setBottomTab(tab.id);
                  setBookExpanded(true);
                }}
                className={cn(
                  '-mb-px border-b-2 py-3 text-sm font-medium transition-colors',
                  bottomTab === tab.id
                    ? 'border-brand-blue text-text-primary'
                    : 'border-transparent text-text-secondary hover:text-text-primary',
                )}
              >
                {t(tab.labelKey)}
              </button>
            ))}
          </div>
        </div>

        <div
          className={cn('p-4 lg:p-5', !bookExpanded && 'hidden lg:block')}
          role="tabpanel"
        >
          {bottomTab === 'orderbook' ? (
            <OrderBookPanel
              orderbook={orderbook}
              isLoading={isLoading}
              isError={isError}
              error={error}
              embedded
            />
          ) : (
            <ActivityList yesPrice={yesPrice} hasLiveData={hasLiveData} />
          )}
        </div>
      </div>
    </div>
  );
}
