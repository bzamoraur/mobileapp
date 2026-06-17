/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm, editorial safari palette — earthy, premium, calm.
        brand: {
          // Terracotta / safari clay (primary accent).
          50: '#faf1ec',
          100: '#f4ddd1',
          200: '#e8bca6',
          300: '#d99775',
          400: '#cb7950',
          500: '#bc5f38',
          600: '#a64d2c',
          700: '#883c24',
          800: '#6e3220',
          900: '#5b2c1e',
        },
        sand: {
          // Warm neutral base (backgrounds, surfaces).
          50: '#faf7f1',
          100: '#f3ecdf',
          200: '#e8dcc6',
          300: '#d8c5a5',
          400: '#c4a87f',
        },
        moss: {
          // Deep acacia green (secondary accent).
          500: '#5b6b45',
          600: '#4a5838',
          700: '#3a452c',
        },
        ink: {
          // Warm charcoal text scale.
          900: '#1c1917',
          800: '#292524',
          700: '#44403c',
          500: '#78716c',
          400: '#a8a29e',
          300: '#d6d3d1',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#faf7f1',
          sunken: '#efe7d8',
        },
      },
      borderRadius: {
        card: '1.5rem',
        pill: '999px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(28, 25, 23, 0.04), 0 12px 32px -16px rgba(28, 25, 23, 0.22)',
        soft: '0 2px 10px -4px rgba(28, 25, 23, 0.15)',
        nav: '0 -1px 0 rgba(28, 25, 23, 0.06), 0 -10px 30px -18px rgba(28, 25, 23, 0.3)',
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Fraunces Variable"', 'Fraunces', 'Georgia', 'serif'],
      },
      letterSpacing: {
        tightish: '-0.015em',
      },
      maxWidth: {
        app: '30rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease both',
      },
    },
  },
  plugins: [],
};
