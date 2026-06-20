import type { ThemeName } from './theme/presets';

/**
 * Per-trip branding + theme selection — the "content layer" knobs the factory
 * swaps for each trip (alongside `src/data/trip.ts`, `images.ts` and
 * `public/img/`). Read by Tailwind (`tailwind.config.ts`), the PWA manifest and
 * `index.html` branding (`vite.config.ts`), and the map pins.
 */
export const site = {
  /** Active theme preset (see `src/theme/presets.ts`). */
  theme: 'safari' as ThemeName,
  /** Full app name — PWA manifest `name` + browser-tab title. */
  appName: 'Tanzania & Zanzíbar',
  /** Short name — PWA `short_name` + iOS home-screen label. */
  shortName: 'Viaje',
  /** Meta description (also the PWA manifest description). */
  description: 'Tu viaje a Tanzania y Zanzíbar, en el bolsillo. Funciona sin conexión.',
  /** UI language tag. */
  lang: 'es',
};
