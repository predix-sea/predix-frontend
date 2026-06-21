import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { AuthWelcomeAutoOpen } from '@/components/auth/AuthWelcomeAutoOpen';
import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';
import { AUTH_WELCOME_DELAY_MS } from '@/lib/authWelcome';

describe('AuthWelcomeAutoOpen', () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
    vi.unstubAllEnvs();
    useAuthStore.setState({ isAuthenticated: false, accessToken: null });
    useUiStore.setState({
      activeModal: 'none',
      authModal: { mode: 'login', step: 'wallet' },
      authWelcomeAutoPending: false,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('opens signup auth modal when unauthenticated and welcome not dismissed', () => {
    localStorage.setItem('predix-how-it-works-dismissed', '1');
    render(<AuthWelcomeAutoOpen />);

    const state = useUiStore.getState();
    expect(state.activeModal).toBe('auth');
    expect(state.authModal.mode).toBe('signup');
    expect(state.authWelcomeAutoPending).toBe(true);
  });

  it('does not open when auth welcome dismissed', () => {
    localStorage.setItem('predix-how-it-works-dismissed', '1');
    localStorage.setItem('predix-auth-welcome-dismissed', '1');
    render(<AuthWelcomeAutoOpen />);
    expect(useUiStore.getState().activeModal).toBe('none');
  });

  it('does not open when authenticated', () => {
    localStorage.setItem('predix-how-it-works-dismissed', '1');
    useAuthStore.setState({ isAuthenticated: true, accessToken: 'tok' });
    render(<AuthWelcomeAutoOpen />);
    expect(useUiStore.getState().activeModal).toBe('none');
  });

  it('does not open while another modal is active', () => {
    localStorage.setItem('predix-how-it-works-dismissed', '1');
    useUiStore.setState({ activeModal: 'auth' });
    render(<AuthWelcomeAutoOpen />);
    expect(useUiStore.getState().authModal.mode).toBe('login');
    expect(useUiStore.getState().authWelcomeAutoPending).toBe(false);
  });

  it('waits for how-it-works close then opens auth after delay', () => {
    vi.useFakeTimers();
    useUiStore.setState({ activeModal: 'howItWorks' });
    const { rerender } = render(<AuthWelcomeAutoOpen />);
    expect(useUiStore.getState().activeModal).toBe('howItWorks');

    useUiStore.setState({ activeModal: 'none' });
    rerender(<AuthWelcomeAutoOpen />);

    vi.advanceTimersByTime(AUTH_WELCOME_DELAY_MS - 1);
    expect(useUiStore.getState().activeModal).toBe('none');

    vi.advanceTimersByTime(1);
    expect(useUiStore.getState().activeModal).toBe('auth');
    expect(useUiStore.getState().authModal.mode).toBe('signup');
    expect(useUiStore.getState().authWelcomeAutoPending).toBe(true);
  });

  it('opens auth only when NEXT_PUBLIC_AUTO_AUTH_WELCOME is true', () => {
    vi.stubEnv('NEXT_PUBLIC_AUTO_AUTH_WELCOME', 'true');
    render(<AuthWelcomeAutoOpen />);
    expect(useUiStore.getState().activeModal).toBe('auth');
    expect(useUiStore.getState().authModal.mode).toBe('signup');
  });
});
