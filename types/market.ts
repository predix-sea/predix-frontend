export type MarketStatus = 'OPEN' | 'CLOSED' | 'RESOLVED' | 'PAUSED' | string;

export type ResolutionStatus = 'PENDING' | 'PROPOSED' | 'DISPUTED' | 'RESOLVED' | string;

export interface Outcome {
  id: string;
  label: string;
  tokenId?: string;
  price?: number;
  probability?: number;
}

export interface Market {
  id: string;
  title: string;
  description?: string;
  category?: string;
  status: MarketStatus;
  resolutionStatus?: ResolutionStatus;
  volume?: number;
  volume24h?: number;
  closesAt?: string;
  createdAt?: string;
  outcomes: Outcome[];
  imageUrl?: string;
}

export interface OrderBookLevel {
  price: number;
  size: number;
}

export interface OrderBook {
  marketId: string;
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  lastTradePrice?: number;
  updatedAt?: string;
}

export interface Trade {
  id: string;
  marketId: string;
  outcomeId?: string;
  price: number;
  size: number;
  side: 'BUY' | 'SELL';
  timestamp: string;
}
