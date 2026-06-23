import { create } from 'zustand';
import { markAuthWelcomeDismissed } from '@/lib/authWelcome';

export type AuthModalMode = 'login' | 'signup';
export type AuthModalStep = 'wallet' | 'kyc' | 'done';
export type ActiveModal = 'none' | 'auth' | 'howItWorks';

const DEFAULT_AUTH_MODAL = { mode: 'login' as AuthModalMode, step: 'wallet' as AuthModalStep };

interface CloseAuthModalOptions {
  dismissWelcome?: boolean;
}

interface UiState {
  theme: 'dark' | 'light';
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  activeModal: ActiveModal;
  authModal: { mode: AuthModalMode; step: AuthModalStep };
  howItWorksModal: { step: 1 | 2 | 3 };
  authWelcomeAutoPending: boolean;
  setToast: (toast: UiState['toast']) => void;
  openAuthModal: (mode: AuthModalMode, step?: AuthModalStep) => void;
  openAuthWelcomeModal: () => void;
  openAuthModalAtKyc: () => void;
  closeAuthModal: (options?: CloseAuthModalOptions) => void;
  setAuthModalStep: (step: AuthModalStep) => void;
  openHowItWorks: (step?: 1 | 2 | 3) => void;
  closeHowItWorks: () => void;
  dismissHowItWorks: () => void;
  setHowItWorksStep: (step: 1 | 2 | 3) => void;
}

export const useUiStore = create<UiState>((set) => ({
  theme: 'dark',
  toast: null,
  activeModal: 'none',
  authModal: DEFAULT_AUTH_MODAL,
  howItWorksModal: { step: 1 },
  authWelcomeAutoPending: false,
  setToast: (toast) => set({ toast }),
  openAuthModal: (mode, step = 'wallet') =>
    set({
      activeModal: 'auth',
      authModal: { mode, step },
      howItWorksModal: { step: 1 },
      authWelcomeAutoPending: false,
    }),
  openAuthWelcomeModal: () =>
    set({
      activeModal: 'auth',
      authModal: { mode: 'signup', step: 'wallet' },
      authWelcomeAutoPending: true,
    }),
  openAuthModalAtKyc: () =>
    set({
      activeModal: 'auth',
      authModal: { mode: 'signup', step: 'kyc' },
      howItWorksModal: { step: 1 },
      authWelcomeAutoPending: false,
    }),
  closeAuthModal: (options) => {
    if (options?.dismissWelcome) {
      markAuthWelcomeDismissed();
    }
    set({
      activeModal: 'none',
      authModal: DEFAULT_AUTH_MODAL,
      authWelcomeAutoPending: false,
    });
  },
  setAuthModalStep: (step) =>
    set((s) => ({ authModal: { ...s.authModal, step } })),
  openHowItWorks: (step = 1) =>
    set({
      activeModal: 'howItWorks',
      howItWorksModal: { step },
      authModal: DEFAULT_AUTH_MODAL,
      authWelcomeAutoPending: false,
    }),
  closeHowItWorks: () =>
    set({
      activeModal: 'none',
    }),
  dismissHowItWorks: () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('predix-how-it-works-dismissed', '1');
    }
    set({
      activeModal: 'none',
      howItWorksModal: { step: 1 },
    });
  },
  setHowItWorksStep: (step) =>
    set((s) => ({ howItWorksModal: { ...s.howItWorksModal, step } })),
}));

export function isAuthModalOpen(state: Pick<UiState, 'activeModal'>): boolean {
  return state.activeModal === 'auth';
}

export function isHowItWorksModalOpen(state: Pick<UiState, 'activeModal'>): boolean {
  return state.activeModal === 'howItWorks';
}
