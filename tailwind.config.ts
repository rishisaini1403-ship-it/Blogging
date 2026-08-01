import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'monospace'],
      },
      colors: {
        bg: '#0A0A0B',
        surface: '#131316',
        border: '#26262B',
        text: '#EDEDEF',
        muted: '#9A9AA2',
        subtle: '#6E6E76',
        accent: {
          DEFAULT: '#D9A45C',
          50: 'rgba(217,164,92,0.08)',
          100: 'rgba(217,164,92,0.16)',
        },
      },
      maxWidth: {
        content: '720px',
        wide: '880px',
      },
      fontSize: {
        xs: ['0.8125rem', { lineHeight: '1.5' }],
        sm: ['0.9375rem', { lineHeight: '1.6' }],
        base: ['1.0625rem', { lineHeight: '1.7' }],
        lg: ['1.1875rem', { lineHeight: '1.65' }],
        xl: ['1.375rem', { lineHeight: '1.45' }],
        '2xl': ['1.75rem', { lineHeight: '1.3' }],
        '3xl': ['2.1875rem', { lineHeight: '1.2' }],
        '4xl': ['2.75rem', { lineHeight: '1.1' }],
      },
      letterSpacing: {
        tightest: '-0.025em',
        tighter: '-0.015em',
        tight: '-0.01em',
      },
    },
  },
  plugins: [],
} satisfies Config
