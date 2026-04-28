/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* ── Terra palette — dark olive greens for the shell ── */
        terra: {
          50:  '#f2f7f2',
          100: '#e0ede0',
          200: '#b8d4b8',
          300: '#8ab88a',
          400: '#5a9a5a',
          500: '#3a7a3a',
          600: '#2a5e2a',
          700: '#1a3e1a',
          800: '#112811',
          900: '#0a1a0a',
          950: '#050d05',
        },
        /* ── Brand green ── */
        brand: {
          50:  '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0',
          300: '#86efac', 400: '#4ade80', 500: '#22c55e',
          600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d',
        },
      },
      fontFamily: {
        sans:    ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Syne', 'DM Sans', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'DM Mono', 'ui-monospace', 'monospace'],
        data:    ['JetBrains Mono', 'DM Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: { '3xl': '1.5rem', '4xl': '2rem' },
      boxShadow: {
        'glow-green':  '0 0 20px rgba(34,197,94,0.18), 0 0 40px rgba(34,197,94,0.06)',
        'glow-sm':     '0 0 10px rgba(34,197,94,0.12)',
        'glow-bright': '0 0 30px rgba(74,222,128,0.25)',
        'terra-inset': 'inset 0 1px 0 rgba(255,255,255,0.04)',
        'card-light':  '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':       { backgroundPosition: '100% 50%' },
        },
        'field-pulse': {
          '0%, 100%': { opacity: '0.4' },
          '50%':       { opacity: '1' },
        },
      },
      animation: {
        'gradient':     'gradient-shift 6s ease infinite',
        'field-pulse':  'field-pulse 2s ease-in-out infinite',
        'pulse-slow':   'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow':    'spin 3s linear infinite',
      },
      backgroundSize: { '300%': '300% 300%' },
    },
  },
  plugins: [],
};
