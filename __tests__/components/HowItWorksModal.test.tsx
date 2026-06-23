import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { HowItWorksModal } from '@/components/onboarding/HowItWorksModal';
import { GlobalModals } from '@/components/layout/GlobalModals';
import { TopHeader } from '@/components/layout/TopHeader';
import { useAuthStore } from '@/stores/authStore';
import { useLocaleStore } from '@/stores/localeStore';
import { isHowItWorksModalOpen, useUiStore } from '@/stores/uiStore';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

describe('HowItWorksModal', () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
    localStorage.setItem('predix-how-it-works-dismissed', '1');
    useLocaleStore.setState({ locale: 'en' });
    useAuthStore.setState({ isAuthenticated: false });
    useUiStore.setState({
      activeModal: 'howItWorks',
      howItWorksModal: { step: 1 },
      authModal: { mode: 'login', step: 'wallet' },
    });
  });

  it('renders step 1 and advances to step 2 on Next', () => {
    render(<HowItWorksModal />);

    expect(screen.getByText('1. Pick a prediction market')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('2. Trade')).toBeInTheDocument();
  });

  it('advances through all steps to step 3', () => {
    render(<HowItWorksModal />);

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('3. Redeem')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Get started' })).toBeInTheDocument();
  });

  it('opens signup auth modal on Get started from step 3 and closes howItWorks', () => {
    useUiStore.setState({ activeModal: 'howItWorks', howItWorksModal: { step: 3 } });
    render(<HowItWorksModal />);

    fireEvent.click(screen.getByRole('button', { name: 'Get started' }));

    const state = useUiStore.getState();
    expect(state.activeModal).toBe('auth');
    expect(state.authModal.mode).toBe('signup');
    expect(isHowItWorksModalOpen(state)).toBe(false);
    expect(localStorage.getItem('predix-how-it-works-dismissed')).toBe('1');
  });

  it('allows jumping steps via dot indicators', () => {
    render(<HowItWorksModal />);

    fireEvent.click(screen.getByRole('button', { name: 'Step 3' }));
    expect(screen.getByText('3. Redeem')).toBeInTheDocument();
  });

  describe('switching modals', () => {
    it('signup auth open then TopHeader login click opens only login auth modal', () => {
      useUiStore.setState({
        activeModal: 'auth',
        authModal: { mode: 'signup', step: 'wallet' },
        howItWorksModal: { step: 1 },
      });

      render(
        <>
          <TopHeader />
          <GlobalModals />
        </>,
      );

      expect(screen.getAllByRole('dialog')).toHaveLength(1);
      expect(useUiStore.getState().authModal.mode).toBe('signup');
      expect(screen.getByRole('heading', { name: 'Welcome to PrediX' })).toBeInTheDocument();
      expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
      expect(screen.queryByText('1. Pick a prediction market')).not.toBeInTheDocument();

      const headerLoginBtn = screen
        .getAllByRole('button', { name: 'Log in', hidden: true })
        .find((el) => el.getAttribute('role') !== 'tab');
      expect(headerLoginBtn).toBeDefined();
      fireEvent.click(headerLoginBtn!);

      const state = useUiStore.getState();
      expect(state.activeModal).toBe('auth');
      expect(state.authModal.mode).toBe('login');
      expect(state.authModal.step).toBe('wallet');
      expect(isHowItWorksModalOpen(state)).toBe(false);
      expect(screen.getAllByRole('dialog')).toHaveLength(1);
      expect(screen.getByRole('heading', { name: 'Welcome to PrediX' })).toBeInTheDocument();
      expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
      expect(screen.queryByText('1. Pick a prediction market')).not.toBeInTheDocument();
    });

    it('howItWorks open then openAuthModal(signup) closes howItWorks', () => {
      useUiStore.setState({
        activeModal: 'howItWorks',
        howItWorksModal: { step: 2 },
        authModal: { mode: 'login', step: 'wallet' },
      });

      const { rerender } = render(<GlobalModals />);

      expect(screen.getAllByRole('dialog')).toHaveLength(1);
      expect(screen.getByText('2. Trade')).toBeInTheDocument();
      expect(isHowItWorksModalOpen(useUiStore.getState())).toBe(true);

      useUiStore.getState().openAuthModal('signup');
      rerender(<GlobalModals />);

      const state = useUiStore.getState();
      expect(state.activeModal).toBe('auth');
      expect(state.authModal.mode).toBe('signup');
      expect(isHowItWorksModalOpen(state)).toBe(false);
      expect(screen.getAllByRole('dialog')).toHaveLength(1);
      expect(screen.queryByText('2. Trade')).not.toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Welcome to PrediX' })).toBeInTheDocument();
      expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    });
  });
});
