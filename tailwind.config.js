/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Calm, iOS-like palette matching the reference, with one strong accent.
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        ink: {
          900: '#0f172a',
          700: '#334155',
          500: '#64748b',
          400: '#94a3b8',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f1f5f9',
          sunken: '#e2e8f0',
        },
      },
      borderRadius: {
        card: '1.25rem',
        pill: '999px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px -12px rgba(15, 23, 42, 0.18)',
        nav: '0 -1px 0 rgba(15, 23, 42, 0.06), 0 -8px 24px -16px rgba(15, 23, 42, 0.25)',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Inter',
          'Segoe UI',
          'Roboto',
          'system-ui',
          'sans-serif',
        ],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      maxWidth: {
        app: '30rem', // phone-width canvas, centered on larger screens
      },
    },
  },
  plugins: [],
};
