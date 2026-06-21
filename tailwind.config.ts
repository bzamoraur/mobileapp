import type { Config } from 'tailwindcss';
import { presets } from './src/theme/presets';
import { site } from './src/site.config';

// The active trip's theme drives the palette + fonts; structural tokens
// (radii, shadows, spacing, motion) are shared across all themes.
const { colors, fonts } = presets[site.theme];

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors,
      fontFamily: { sans: fonts.sans, display: fonts.display },
      borderRadius: { card: '1.5rem', pill: '999px' },
      boxShadow: {
        card: '0 1px 2px rgba(28, 25, 23, 0.04), 0 12px 32px -16px rgba(28, 25, 23, 0.22)',
        soft: '0 2px 10px -4px rgba(28, 25, 23, 0.15)',
        nav: '0 -1px 0 rgba(28, 25, 23, 0.06), 0 -10px 30px -18px rgba(28, 25, 23, 0.3)',
      },
      letterSpacing: { tightish: '-0.015em' },
      maxWidth: { app: '30rem' },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: { 'fade-up': 'fade-up 0.4s ease both' },
    },
  },
  plugins: [],
} satisfies Config;
