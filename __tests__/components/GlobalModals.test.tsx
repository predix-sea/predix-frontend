import { beforeEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { GlobalModals } from '@/components/layout/GlobalModals';
import { useLocaleStore } from '@/stores/localeStore';
import { useUiStore } from '@/stores/uiStore';

function countOpenDialogNodes(): number {
  return document.querySelectorAll('[data-state="open"]').length;
}

describe('GlobalModals', () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
    localStorage.setItem('predix-how-it-works-dismissed', '1');
    localStorage.setItem('predix-auth-welcome-dismissed', '1');
    useLocaleStore.setState({ locale: 'en' });
    useUiStore.setState({
      activeModal: 'none',
      authModal: { mode: 'login', step: 'wallet' },
      howItWorksModal: { step: 1 },
    });
  });

  it('renders no open dialog when activeModal is none', () => {
    render(<GlobalModals />);
    expect(screen.queryAllByRole('dialog')).toHaveLength(0);
    expect(countOpenDialogNodes()).toBe(0);
  });

  it('renders exactly one open dialog for auth', () => {
    useUiStore.setState({ activeModal: 'auth' });
    render(<GlobalModals />);
    expect(screen.getAllByRole('dialog')).toHaveLength(1);
    expect(countOpenDialogNodes()).toBeGreaterThan(0);
  });

  it('renders exactly one open dialog for howItWorks', () => {
    useUiStore.setState({ activeModal: 'howItWorks' });
    render(<GlobalModals />);
    expect(screen.getAllByRole('dialog')).toHaveLength(1);
    expect(countOpenDialogNodes()).toBeGreaterThan(0);
  });

  it('never mounts both dialogs when switching modals', () => {
    useUiStore.setState({ activeModal: 'auth' });
    const { rerender } = render(<GlobalModals />);
    expect(screen.getAllByRole('dialog')).toHaveLength(1);

    useUiStore.setState({ activeModal: 'howItWorks' });
    rerender(<GlobalModals />);
    expect(screen.getAllByRole('dialog')).toHaveLength(1);
    expect(countOpenDialogNodes()).toBeGreaterThan(0);
  });
});
