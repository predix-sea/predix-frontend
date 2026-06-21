import { beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { AuthModal } from '@/components/auth/AuthModal';
import { useLocaleStore } from '@/stores/localeStore';
import { useUiStore } from '@/stores/uiStore';

describe('AuthModal', () => {
  beforeEach(() => {
    cleanup();
    useLocaleStore.setState({ locale: 'en' });
    useUiStore.setState({
      activeModal: 'auth',
      authModal: { mode: 'login', step: 'wallet' },
    });
  });

  it('renders simple wallet connect step without in-modal mode tabs', () => {
    render(<AuthModal />);

    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Welcome to PrediX' })).toBeInTheDocument();
    expect(screen.getByText('Connect a wallet to start trading')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue with OKX Wallet' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue with MetaMask' })).toBeInTheDocument();
    expect(screen.getByText('Terms')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Continue with Google' })).not.toBeInTheDocument();
  });

  it('renders identical wallet UI for signup and login modes', () => {
    const assertWalletUi = () => {
      expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Welcome to PrediX' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Continue with OKX Wallet' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Continue with MetaMask' })).toBeInTheDocument();
      expect(screen.getByText('Terms')).toBeInTheDocument();
      expect(screen.queryByText('Verify')).not.toBeInTheDocument();
    };

    useUiStore.setState({
      activeModal: 'auth',
      authModal: { mode: 'login', step: 'wallet' },
    });
    const { unmount } = render(<AuthModal />);
    assertWalletUi();
    unmount();

    useUiStore.setState({
      activeModal: 'auth',
      authModal: { mode: 'signup', step: 'wallet' },
    });
    render(<AuthModal />);
    assertWalletUi();
  });

  it('shows only KYC body after signup wallet SIWE without wallet buttons', () => {
    useUiStore.setState({
      activeModal: 'auth',
      authModal: { mode: 'signup', step: 'kyc' },
    });
    render(<AuthModal />);

    expect(screen.getByText('Verify your identity')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Continue with OKX Wallet' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Continue with MetaMask' })).not.toBeInTheDocument();
    expect(screen.getByText('Verify')).toBeInTheDocument();
  });

  it('resets signup kyc step when switching to login via openAuthModal', () => {
    useUiStore.setState({
      activeModal: 'auth',
      authModal: { mode: 'signup', step: 'kyc' },
    });
    const { rerender } = render(<AuthModal />);

    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    expect(screen.getByText('Verify your identity')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Country \/ Region/i), { target: { value: 'TH' } });

    useUiStore.getState().openAuthModal('login');
    rerender(<AuthModal />);

    expect(screen.getByRole('heading', { name: 'Welcome to PrediX' })).toBeInTheDocument();
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();

    useUiStore.getState().openAuthModal('signup');
    rerender(<AuthModal />);
    expect(useUiStore.getState().authModal).toEqual({ mode: 'signup', step: 'wallet' });
    expect(screen.getByRole('heading', { name: 'Welcome to PrediX' })).toBeInTheDocument();
  });

  it('does not show bottom switch links', () => {
    render(<AuthModal />);
    expect(screen.queryByText("Don't have an account? Sign up")).not.toBeInTheDocument();
    expect(screen.queryByText('Already have an account? Log in')).not.toBeInTheDocument();
  });
});
