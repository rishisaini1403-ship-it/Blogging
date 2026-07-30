import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        neutral: {
          850: '#1a1a1a',
          950: '#0a0a0a',
        },
        surface: {
          DEFAULT: '#111111',
          hover: '#1a1a1a',
          border: '#222222',
        },
        accent: {
          DEFAULT: '#3b82f6',
          50: 'rgba(59,130,246,0.05)',
          100: 'rgba(59,130,246,0.1)',
          200: 'rgba(59,130,246,0.2)',
        },
      },
      maxWidth: {
        content: '680px',
      },
    },
  },
  plugins: [],
} satisfies Config
