import { beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { useLocaleStore } from '@/stores/localeStore';

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    cleanup();
    useLocaleStore.setState({ locale: 'en' });
  });

  it('shows current short label and opens dropdown with native labels', () => {
    render(<LanguageSwitcher />);

    expect(screen.getByRole('button', { name: 'Language' })).toHaveTextContent('EN');

    fireEvent.click(screen.getByRole('button', { name: 'Language' }));

    expect(screen.getByRole('option', { name: /简体中文/ })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /繁體中文/ })).toBeInTheDocument();
  });

  it('switches locale immediately on option click', () => {
    render(<LanguageSwitcher />);

    fireEvent.click(screen.getByRole('button', { name: 'Language' }));
    fireEvent.click(screen.getByRole('option', { name: /简体中文/ }));

    expect(useLocaleStore.getState().locale).toBe('zh-CN');
    expect(screen.getByText('简')).toBeInTheDocument();
  });
});
