import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        card: 'var(--card)',
        border: 'var(--border)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        yes: 'var(--color-yes)',
        no: 'var(--color-no)',
        primary: 'var(--color-primary)',
        surface: 'var(--color-surface)',
        'brand-blue': 'var(--brand-blue)',
        'chip-active': 'var(--chip-active-bg)',
        'chip-inactive': 'var(--chip-inactive-bg)',
        'category-trending': 'var(--category-trending)',
        'category-crypto': 'var(--category-crypto)',
        'category-macro': 'var(--category-macro)',
        'category-sports': 'var(--category-sports)',
        'category-politics': 'var(--category-politics)',
        'category-environment': 'var(--category-environment)',
        predix: {
          bg: 'var(--background)',
          surface: 'var(--card)',
          border: 'var(--border)',
          accent: 'var(--brand-blue)',
          danger: 'var(--color-no)',
          warning: '#f59e0b',
          muted: 'var(--text-secondary)',
        },
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'card-hover': '0 4px 12px 0 rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06)',
      },
      fontFamily: {
        sans: ['-apple-system', 'Inter', 'PingFang SC', 'var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      maxWidth: {
        '8xl': '90rem',
      },
    },
  },
  plugins: [],
};

export default config;
