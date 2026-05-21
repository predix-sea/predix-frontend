export type OrderSide = 'BUY' | 'SELL';
export type OrderType = 'LIMIT' | 'MARKET';
export type OrderStatus =
  | 'PENDING'
  | 'OPEN'
  | 'PARTIALLY_FILLED'
  | 'FILLED'
  | 'CANCELLED'
  | 'REJECTED'
  | string;

export interface Order {
  id: string;
  marketId: string;
  outcomeId: string;
  side: OrderSide;
  type: OrderType;
  price?: number;
  size: number;
  filledSize?: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface PlaceOrderRequest {
  marketId: string;
  outcomeId: string;
  side: OrderSide;
  type: OrderType;
  size: number;
  price?: number;
}
