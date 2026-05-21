import { create } from 'zustand';

interface MarketFilterState {
  status: string;
  category: string;
  query: string;
  setStatus: (status: string) => void;
  setCategory: (category: string) => void;
  setQuery: (query: string) => void;
  reset: () => void;
}

export const useMarketFilterStore = create<MarketFilterState>((set) => ({
  status: '',
  category: '',
  query: '',
  setStatus: (status) => set({ status }),
  setCategory: (category) => set({ category }),
  setQuery: (query) => set({ query }),
  reset: () => set({ status: '', category: '', query: '' }),
}));
