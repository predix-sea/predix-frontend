import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ClientLiveText } from '@/components/ui/ClientLiveText';

describe('ClientLiveText', () => {
  it('shows live text after mount', async () => {
    render(<ClientLiveText placeholder="—">{() => '3d 2h'}</ClientLiveText>);
    expect(await screen.findByText('3d 2h')).toBeInTheDocument();
  });
});
