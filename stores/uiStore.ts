import { create } from 'zustand';

interface UiState {
  theme: 'dark' | 'light';
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  setToast: (toast: UiState['toast']) => void;
}

export const useUiStore = create<UiState>((set) => ({
  theme: 'dark',
  toast: null,
  setToast: (toast) => set({ toast }),
}));
