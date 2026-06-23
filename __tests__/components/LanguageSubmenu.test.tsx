import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { LanguageSubmenu } from '@/components/menu/LanguageSubmenu';
import { SUPPORTED_LOCALES } from '@/lib/i18n/locales';
import { useLocaleStore } from '@/stores/localeStore';

vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

describe('LanguageSubmenu', () => {
  beforeEach(() => {
    cleanup();
    useLocaleStore.setState({ locale: 'en' });
  });

  it('renders 8 locale buttons', () => {
    render(<LanguageSubmenu />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(SUPPORTED_LOCALES.length);
    expect(buttons).toHaveLength(8);
    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute('aria-current', 'true');
  });

  it('container has scroll-contained class', () => {
    const { container } = render(<LanguageSubmenu />);
    const scrollContainer = container.firstElementChild;

    expect(scrollContainer).toHaveClass('scroll-contained');
    expect(scrollContainer?.className).toContain('scrollbar-thin');
  });
});
