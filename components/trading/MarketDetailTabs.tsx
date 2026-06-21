'use client';

import { useMemo, useState } from 'react';
import { OrderBookPanel } from './OrderBookPanel';
import { PriceChart } from './PriceChart';
import { formatCentsPrecise, getYesPrice } from '@/lib/marketPricing';
import { ClientLiveText } from '@/components/ui/ClientLiveText';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/cn';
import type { Market, OrderBook } from '@/types';

type TabId = 'chart' | 'orderbook' | 'activity';

const TABS: { id: TabId; labelKey: string }[] = [
  { id: 'chart', labelKey: 'trading.tabChart' },
  { id: 'orderbook', labelKey: 'trading.tabOrderBook' },
  { id: 'activity', labelKey: 'trading.tabActivity' },
];

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

function ActivityPanel({ yesPrice, hasLiveData }: { yesPrice: number; hasLiveData: boolean }) {
  const { t } = useTranslation();
  const trades = useMemo(() => generateMockTrades(yesPrice), [yesPrice]);

  if (!hasLiveData && trades.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-text-secondary">
        {t('trading.noRecentTrades')}
      </p>
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
          <div key={trade.id} className="flex items-center justify-between py-3 text-sm">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  'font-medium',
                  trade.outcome === 'Yes' ? 'text-yes' : 'text-no',
                )}
              >
                {sideLabel(trade.side)} {outcomeLabel(trade.outcome)}
              </span>
              <span className="font-mono text-text-primary">{formatCentsPrecise(trade.price)}</span>
            </div>
            <div className="flex items-center gap-4 text-text-secondary">
              <span>
                {trade.size} {t('trading.sharesUnit')}
              </span>
              <ClientLiveText className="text-xs" placeholder="--:--">
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
      <p className="mt-4 text-center text-xs text-text-secondary">{t('trading.demoActivity')}</p>
    </div>
  );
}

interface MarketDetailTabsProps {
  market: Market;
  orderbook?: OrderBook;
  isLoading?: boolean;
  isError?: boolean;
  error?: unknown;
}

export function MarketDetailTabs({
  market,
  orderbook,
  isLoading,
  isError,
  error,
}: MarketDetailTabsProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabId>('chart');
  const yesPrice = getYesPrice(market, orderbook) ?? 0.5;
  const hasLiveData = orderbook?.lastTradePrice !== undefined;

  return (
    <div className="rounded-xl border border-border bg-card shadow-card">
      <div className="flex gap-6 border-b border-border px-5" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              '-mb-px border-b-2 py-3 text-sm font-medium transition-colors',
              activeTab === tab.id
                ? 'border-brand-blue text-text-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary',
            )}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      <div className="p-5" role="tabpanel">
        {activeTab === 'chart' && (
          <PriceChart marketId={market.id} currentPrice={yesPrice} />
        )}
        {activeTab === 'orderbook' && (
          <OrderBookPanel
            orderbook={orderbook}
            isLoading={isLoading}
            isError={isError}
            error={error}
            embedded
          />
        )}
        {activeTab === 'activity' && (
          <ActivityPanel yesPrice={yesPrice} hasLiveData={hasLiveData} />
        )}
      </div>
    </div>
  );
}
