import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { AppShell } from '@/components/layout/AppShell';

const inter = Inter({ subsets: ['latin'], variable: '--font-geist-sans' });

export const metadata: Metadata = {
  title: 'PrediX — Prediction Markets',
  description: 'Southeast Asia prediction market trading platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
