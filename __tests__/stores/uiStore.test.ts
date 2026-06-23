import { beforeEach, describe, expect, it } from 'vitest';
import { useUiStore } from '@/stores/uiStore';

describe('uiStore modal exclusivity', () => {
  beforeEach(() => {
    useUiStore.setState({
      activeModal: 'none',
      authModal: { mode: 'login', step: 'wallet' },
      howItWorksModal: { step: 1 },
      authWelcomeAutoPending: false,
    });
  });

  it('open signup then open login closes howItWorks and sets login mode', () => {
    const { openAuthModal } = useUiStore.getState();

    openAuthModal('signup');
    openAuthModal('login');

    const state = useUiStore.getState();
    expect(state.activeModal).toBe('auth');
    expect(state.authModal.mode).toBe('login');
    expect(state.authModal.step).toBe('wallet');
    expect(state.activeModal).not.toBe('howItWorks');
  });

  it('open howItWorks then open signup closes howItWorks and resets step', () => {
    const { openHowItWorks, openAuthModal } = useUiStore.getState();

    openHowItWorks(2);
    openAuthModal('signup');

    const state = useUiStore.getState();
    expect(state.activeModal).toBe('auth');
    expect(state.authModal.mode).toBe('signup');
    expect(state.howItWorksModal.step).toBe(1);
    expect(state.activeModal).not.toBe('howItWorks');
  });

  it('open login then open howItWorks closes auth and opens howItWorks', () => {
    const { openAuthModal, openHowItWorks } = useUiStore.getState();

    openAuthModal('login');
    openHowItWorks(1);

    const state = useUiStore.getState();
    expect(state.activeModal).toBe('howItWorks');
    expect(state.howItWorksModal.step).toBe(1);
    expect(state.authModal.mode).toBe('login');
    expect(state.authModal.step).toBe('wallet');
  });

  it('resets signup kyc step when switching to login', () => {
    const { openAuthModalAtKyc, openAuthModal } = useUiStore.getState();

    openAuthModalAtKyc();
    expect(useUiStore.getState().authModal.step).toBe('kyc');

    openAuthModal('login');

    const state = useUiStore.getState();
    expect(state.authModal.mode).toBe('login');
    expect(state.authModal.step).toBe('wallet');
  });

  it('resets auth when opening howItWorks from signup kyc', () => {
    const { openAuthModalAtKyc, openHowItWorks } = useUiStore.getState();

    openAuthModalAtKyc();
    openHowItWorks(1);

    const state = useUiStore.getState();
    expect(state.activeModal).toBe('howItWorks');
    expect(state.authModal.step).toBe('wallet');
    expect(state.authModal.mode).toBe('login');
  });

  it('closeAuthModal with dismissWelcome writes localStorage', () => {
    localStorage.clear();
    const { openAuthWelcomeModal, closeAuthModal } = useUiStore.getState();

    openAuthWelcomeModal();
    closeAuthModal({ dismissWelcome: true });

    expect(localStorage.getItem('predix-auth-welcome-dismissed')).toBe('1');
    expect(useUiStore.getState().authWelcomeAutoPending).toBe(false);
  });
});
