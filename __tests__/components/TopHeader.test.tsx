import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { TopHeader } from '@/components/layout/TopHeader';
import { GlobalModals } from '@/components/layout/GlobalModals';
import { useAuthStore } from '@/stores/authStore';
import { useLocaleStore } from '@/stores/localeStore';
import { isHowItWorksModalOpen, useUiStore } from '@/stores/uiStore';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

describe('TopHeader auth actions', () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
    useLocaleStore.setState({ locale: 'en' });
    useAuthStore.setState({
      isAuthenticated: false,
      walletAddress: null,
      user: null,
    });
    useUiStore.setState({
      activeModal: 'none',
      authModal: { mode: 'login', step: 'wallet' },
      howItWorksModal: { step: 1 },
      authWelcomeAutoPending: false,
    });
  });

  it('shows Log in and Sign up when unauthenticated', () => {
    render(<TopHeader />);

    expect(screen.getByRole('button', { name: 'Log in' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign up' })).toBeInTheDocument();
    expect(screen.queryByLabelText(/0x/i)).not.toBeInTheDocument();
  });

  it('opens login modal from Log in and signup modal from Sign up', () => {
    const openAuthModal = vi.spyOn(useUiStore.getState(), 'openAuthModal');
    render(<TopHeader />);

    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));
    expect(openAuthModal).toHaveBeenCalledWith('login');

    fireEvent.click(screen.getByRole('button', { name: 'Sign up' }));
    expect(openAuthModal).toHaveBeenCalledWith('signup');
  });

  it('shows UserMenu instead of auth buttons when authenticated', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
      user: { walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12', chainId: 1, kycStatus: 'APPROVED' },
    });

    render(<TopHeader />);

    expect(screen.queryByRole('button', { name: 'Log in' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Sign up' })).not.toBeInTheDocument();
    expect(screen.getByLabelText('0xabcd…ef12')).toBeInTheDocument();
  });

  it('opens login from header after welcome modal was dismissed', () => {
    localStorage.setItem('predix-how-it-works-dismissed', '1');
    localStorage.setItem('predix-auth-welcome-dismissed', '1');

    render(
      <>
        <TopHeader />
        <GlobalModals />
      </>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));

    const state = useUiStore.getState();
    expect(state.activeModal).toBe('auth');
    expect(state.authModal.mode).toBe('login');
    expect(state.authWelcomeAutoPending).toBe(false);
    expect(screen.getByRole('heading', { name: 'Welcome to PrediX' })).toBeInTheDocument();
  });

  it('closes howItWorks when header Log in is clicked', () => {
    localStorage.setItem('predix-how-it-works-dismissed', '1');
    useUiStore.setState({
      activeModal: 'howItWorks',
      howItWorksModal: { step: 2 },
    });

    render(
      <>
        <TopHeader />
        <GlobalModals />
      </>,
    );

    expect(screen.getByText('2. Trade')).toBeInTheDocument();

    const headerLoginBtn = screen
      .getAllByRole('button', { name: 'Log in', hidden: true })
      .find((el) => el.getAttribute('role') !== 'tab');
    fireEvent.click(headerLoginBtn!);

    const state = useUiStore.getState();
    expect(state.activeModal).toBe('auth');
    expect(state.authModal.mode).toBe('login');
    expect(isHowItWorksModalOpen(state)).toBe(false);
    expect(screen.queryByText('2. Trade')).not.toBeInTheDocument();
  });
});
