import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ComplianceBanner } from '@/components/compliance/ComplianceBanner';
import { useAuthStore } from '@/stores/authStore';
import { useLocaleStore } from '@/stores/localeStore';

describe('ComplianceBanner', () => {
  beforeEach(() => {
    useLocaleStore.setState({ locale: 'en' });
  });

  it('shows KYC message when required', () => {
    useAuthStore.setState({
      compliance: 'KYC_REQUIRED',
      user: { walletAddress: '0x1', chainId: 1, kycStatus: 'PENDING' },
    });

    render(<ComplianceBanner />);
    expect(screen.getByText(/KYC verification required/i)).toBeInTheDocument();
  });

  it('renders nothing when OK and KYC approved', () => {
    useAuthStore.setState({
      compliance: 'OK',
      user: { walletAddress: '0x1', chainId: 1, kycStatus: 'APPROVED' },
    });
    const { container } = render(<ComplianceBanner />);
    expect(container.firstChild).toBeNull();
  });
});
