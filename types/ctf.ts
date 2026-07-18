export interface CtfPosition {
  conditionId: string;
  marketId?: string;
  marketTitle?: string;
  yesBalance: string;
  noBalance: string;
  source: 'indexer' | 'demo';
}

export interface CtfTimelineEvent {
  eventType: string;
  txHash?: string;
  blockNumber?: number;
  conditionId?: string;
}
