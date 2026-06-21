import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { OutcomeSelector } from '@/components/trading/OutcomeSelector';
import { useLocaleStore } from '@/stores/localeStore';

const outcomes = [
  { id: 'yes', label: 'Yes', price: 0.65 },
  { id: 'no', label: 'No', price: 0.35 },
];

describe('OutcomeSelector', () => {
  beforeEach(() => {
    cleanup();
    useLocaleStore.setState({ locale: 'en' });
  });

  it('keeps No visibly styled when Yes is selected by default', () => {
    render(
      <OutcomeSelector
        outcomes={outcomes}
        selectedId="yes"
        onSelect={vi.fn()}
      />,
    );

    const noButton = screen.getByRole('button', { name: /No/i });
    expect(noButton.className).toMatch(/border-no/);
    expect(noButton.className).toMatch(/text-no/);
  });

  it('keeps Yes visibly styled when No is selected', () => {
    render(
      <OutcomeSelector
        outcomes={outcomes}
        selectedId="no"
        onSelect={vi.fn()}
      />,
    );

    const yesButton = screen.getByRole('button', { name: /Yes/i });
    expect(yesButton.className).toMatch(/border-yes/);
    expect(yesButton.className).toMatch(/text-yes/);
  });

  it('calls onSelect when an outcome is clicked', () => {
    const onSelect = vi.fn();
    render(
      <OutcomeSelector
        outcomes={outcomes}
        selectedId="yes"
        onSelect={onSelect}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /No/i }));
    expect(onSelect).toHaveBeenCalledWith('no');
  });
});
