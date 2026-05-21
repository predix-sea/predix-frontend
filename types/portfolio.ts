export interface Position {
  id: string;
  marketId: string;
  marketTitle?: string;
  outcomeId: string;
  outcomeLabel?: string;
  size: number;
  avgPrice?: number;
  currentPrice?: number;
  unrealizedPnl?: number;
}

export interface Balance {
  asset: string;
  available: number;
  locked: number;
  total: number;
}
