import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { HamburgerMenu } from '@/components/menu/HamburgerMenu';
import { GlobalModals } from '@/components/layout/GlobalModals';
import { useAuthStore } from '@/stores/authStore';
import { useLocaleStore } from '@/stores/localeStore';
import { isHowItWorksModalOpen, useUiStore } from '@/stores/uiStore';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

describe('HamburgerMenu auth actions', () => {
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
    render(<HamburgerMenu open onOpenChange={() => {}} />);

    expect(screen.getByRole('menuitem', { name: 'Log in' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Sign up' })).toBeInTheDocument();
  });

  it('opens auth modal from menu items', () => {
    const openAuthModal = vi.spyOn(useUiStore.getState(), 'openAuthModal');
    render(<HamburgerMenu open onOpenChange={() => {}} />);

    fireEvent.click(screen.getByRole('menuitem', { name: 'Log in' }));
    expect(openAuthModal).toHaveBeenCalledWith('login');

    render(<HamburgerMenu open onOpenChange={() => {}} />);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Sign up' }));
    expect(openAuthModal).toHaveBeenCalledWith('signup');
  });

  it('hides auth menu items when authenticated', () => {
    useAuthStore.setState({
      isAuthenticated: true,
      walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
      user: { walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12', chainId: 1, kycStatus: 'APPROVED' },
    });

    render(<HamburgerMenu open onOpenChange={() => {}} />);

    expect(screen.queryByRole('menuitem', { name: 'Log in' })).not.toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: 'Sign up' })).not.toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Portfolio' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Disconnect' })).toBeInTheDocument();
  });

  it('expands language list with all 8 locales', () => {
    render(<HamburgerMenu open onOpenChange={() => {}} />);

    fireEvent.click(screen.getByRole('button', { name: 'Language' }));

    expect(screen.getByRole('button', { name: /Bahasa Melayu/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /繁體中文/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute('aria-current', 'true');
  });

  it('closes howItWorks when menu Log in is selected', () => {
    localStorage.setItem('predix-how-it-works-dismissed', '1');
    useUiStore.setState({
      activeModal: 'howItWorks',
      howItWorksModal: { step: 1 },
    });

    render(
      <>
        <HamburgerMenu open onOpenChange={() => {}} />
        <GlobalModals />
      </>,
    );

    expect(screen.getByText('1. Pick a prediction market')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('menuitem', { name: 'Log in', hidden: true }));

    const state = useUiStore.getState();
    expect(state.activeModal).toBe('auth');
    expect(state.authModal.mode).toBe('login');
    expect(isHowItWorksModalOpen(state)).toBe(false);
    expect(screen.queryByText('1. Pick a prediction market')).not.toBeInTheDocument();
  });
});
