import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { WalletGrid } from '@/components/auth/WalletGrid';
import {
  WALLET_PROVIDER_LABELS,
  WALLET_PROVIDER_ORDER,
} from '@/components/auth/AuthProviderIcons';
import { useLocaleStore } from '@/stores/localeStore';
import { useUiStore } from '@/stores/uiStore';

describe('WalletGrid', () => {
  beforeEach(() => {
    cleanup();
    useLocaleStore.setState({ locale: 'en' });
    useUiStore.setState({ toast: null });
  });

  it('renders 8 provider buttons in Polymarket order without visible labels', () => {
    render(<WalletGrid onMetaMask={vi.fn()} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(8);

    buttons.forEach((button, index) => {
      const id = WALLET_PROVIDER_ORDER[index];
      expect(button).toHaveAttribute('data-wallet-id', id);
      expect(button).toHaveAttribute('aria-label', WALLET_PROVIDER_LABELS[id]);
    });

    expect(screen.queryByText('MetaMask')).not.toBeInTheDocument();
    expect(screen.queryByText('WalletConnect')).not.toBeInTheDocument();
    expect(screen.queryByText('Rainbow')).not.toBeInTheDocument();
  });

  it('calls onMetaMask when MetaMask is clicked', () => {
    const onMetaMask = vi.fn();
    render(<WalletGrid onMetaMask={onMetaMask} />);

    fireEvent.click(screen.getByRole('button', { name: 'MetaMask' }));
    expect(onMetaMask).toHaveBeenCalledTimes(1);
  });

  it('shows coming soon toast for non-MetaMask providers', () => {
    render(<WalletGrid onMetaMask={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Telegram' }));

    expect(useUiStore.getState().toast).toEqual({
      message: 'Coming soon',
      type: 'info',
    });
  });
});
