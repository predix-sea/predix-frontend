import { beforeEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { AuthProviderIcon } from '@/components/auth/AuthProviderIcons';

describe('AuthProviderIcon wallet brands', () => {
  beforeEach(() => {
    cleanup();
  });

  it('renders metamask inline svg with official viewBox', () => {
    const { container } = render(<AuthProviderIcon id="metamask" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('viewBox', '0 0 142 137');
    expect(svg).toHaveAttribute('overflow', 'visible');
    expect(svg).toHaveAttribute('preserveAspectRatio', 'xMidYMid meet');
    expect(container.querySelectorAll('path').length).toBeGreaterThan(20);
    expect(container.querySelector('path[fill="#E17726"]')).toBeTruthy();
  });

  it('renders okx inline svg with four rounded white tiles on black', () => {
    const { container } = render(<AuthProviderIcon id="okx" />);
    const rects = container.querySelectorAll('rect');
    expect(rects).toHaveLength(5);
    expect(rects[0]).toHaveAttribute('fill', '#000');
    expect(rects[1]).toHaveAttribute('fill', '#fff');
    expect(rects[1]).toHaveAttribute('rx', '1.5');
    expect(container.querySelector('path[fill-rule]')).toBeNull();
  });
});
