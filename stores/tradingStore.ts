import { create } from 'zustand';
import type { OrderSide } from '@/types';

interface TradingState {
  limitPrice: string | null;
  bookSide: OrderSide | null;
  setFromOrderBook: (price: number, side: OrderSide) => void;
  clearBookSelection: () => void;
}

export const useTradingStore = create<TradingState>((set) => ({
  limitPrice: null,
  bookSide: null,
  setFromOrderBook: (price, side) =>
    set({ limitPrice: price.toFixed(4).replace(/\.?0+$/, '') || '0', bookSide: side }),
  clearBookSelection: () => set({ limitPrice: null, bookSide: null }),
}));
