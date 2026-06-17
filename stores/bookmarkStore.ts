import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BookmarkState {
  ids: string[];
  toggle: (marketId: string) => void;
  isBookmarked: (marketId: string) => boolean;
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (marketId) =>
        set((state) => ({
          ids: state.ids.includes(marketId)
            ? state.ids.filter((id) => id !== marketId)
            : [...state.ids, marketId],
        })),
      isBookmarked: (marketId) => get().ids.includes(marketId),
    }),
    { name: 'predix-bookmarks' },
  ),
);
