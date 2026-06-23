import { beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { LanguagePicker } from '@/components/settings/LanguagePicker';
import { useLocaleStore } from '@/stores/localeStore';

describe('LanguagePicker', () => {
  beforeEach(() => {
    cleanup();
    useLocaleStore.setState({ locale: 'en' });
  });

  it('renders all 8 language cards with native labels', () => {
    render(<LanguagePicker />);

    expect(screen.getByText('简体中文')).toBeInTheDocument();
    expect(screen.getByText('Bahasa Indonesia')).toBeInTheDocument();
    expect(screen.getByText('ไทย')).toBeInTheDocument();
    expect(screen.getByText('Language changes apply instantly across the app.')).toBeInTheDocument();
  });

  it('switches locale immediately on card click', () => {
    render(<LanguagePicker />);

    fireEvent.click(screen.getByRole('button', { name: '简体中文, Simplified Chinese' }));
    expect(useLocaleStore.getState().locale).toBe('zh-CN');
  });
});
