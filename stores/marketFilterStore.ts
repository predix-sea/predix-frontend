import { create } from 'zustand';

export type MarketSort = 'volume' | 'ending' | 'newest' | 'probability';
export type MarketTimeRange = '24h' | '7d' | '30d' | 'all';
export type MarketViewMode = 'grid' | 'list';

interface MarketFilterState {
  status: string;
  category: string;
  subcategory: string;
  query: string;
  sort: MarketSort;
  timeRange: MarketTimeRange;
  viewMode: MarketViewMode;
  showBookmarksOnly: boolean;
  sidebarOpen: boolean;
  setStatus: (status: string) => void;
  setCategory: (category: string) => void;
  setSubcategory: (subcategory: string) => void;
  setQuery: (query: string) => void;
  setSort: (sort: MarketSort) => void;
  setTimeRange: (timeRange: MarketTimeRange) => void;
  setViewMode: (viewMode: MarketViewMode) => void;
  setShowBookmarksOnly: (show: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  reset: () => void;
}

export const useMarketFilterStore = create<MarketFilterState>((set) => ({
  status: '',
  category: 'hot',
  subcategory: '',
  query: '',
  sort: 'volume',
  timeRange: 'all',
  viewMode: 'list',
  showBookmarksOnly: false,
  sidebarOpen: false,
  setStatus: (status) => set({ status }),
  setCategory: (category) => set({ category, subcategory: '' }),
  setSubcategory: (subcategory) => set({ subcategory }),
  setQuery: (query) => set({ query }),
  setSort: (sort) => set({ sort }),
  setTimeRange: (timeRange) => set({ timeRange }),
  setViewMode: (viewMode) => set({ viewMode }),
  setShowBookmarksOnly: (showBookmarksOnly) => set({ showBookmarksOnly }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  reset: () =>
    set({
      status: '',
      category: 'hot',
      subcategory: '',
      query: '',
      sort: 'volume',
      timeRange: 'all',
      viewMode: 'list',
      showBookmarksOnly: false,
      sidebarOpen: false,
    }),
}));
