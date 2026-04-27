/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* 21st.dev uses zinc as the neutral palette */
        brand: {
          50:  '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0',
          300: '#86efac', 400: '#4ade80', 500: '#22c55e',
          600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['DM Mono', 'ui-monospace', 'monospace'],
        data: ['DM Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(34,197,94,0.15), 0 0 40px rgba(34,197,94,0.05)',
        'glow-sm':    '0 0 10px rgba(34,197,94,0.1)',
        'inset-top':  'inset 0 1px 0 rgba(255,255,255,0.05)',
        'card-light': '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)',
        'card-dark':  '0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.2)',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':       { backgroundPosition: '100% 50%' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(-8px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'gradient':       'gradient-shift 6s ease infinite',
        'shimmer':        'shimmer 1.5s infinite',
        'slide-up':       'slide-up 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.25s ease-out',
        'pulse-slow':     'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow':      'spin 3s linear infinite',
      },
      backgroundSize: {
        '300%': '300% 300%',
      },
    },
  },
  plugins: [],
};
