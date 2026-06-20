/**
 * Theme presets for the Viaje template. Each generated trip selects one in
 * `src/site.config.ts`; the active preset drives Tailwind's colours + fonts (see
 * `tailwind.config.ts`) and is also read by the PWA manifest, `index.html` and
 * the map pins.
 *
 * Components reference a stable set of colour keys — `brand` (primary accent),
 * `sand` (warm/neutral surfaces), `moss` (secondary accent), `ink` (text scale)
 * and `surface` — so swapping the preset retints the whole app with no markup
 * changes. To add a theme, copy a block and adjust the hues, keeping the keys.
 */

export type ColorScale = Record<string, string>;

export interface Palette {
  brand: ColorScale;
  sand: ColorScale;
  moss: ColorScale;
  ink: ColorScale;
  surface: ColorScale;
}

export interface ThemePreset {
  label: string;
  colors: Palette;
  fonts: { sans: string[]; display: string[] };
}

const SANS = ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'];
const DISPLAY = ['"Fraunces Variable"', 'Fraunces', 'Georgia', 'serif'];

export const presets = {
  /** Warm, editorial safari palette — earthy, premium, calm (the Tanzania trip). */
  safari: {
    label: 'Safari',
    colors: {
      brand: {
        50: '#faf1ec', 100: '#f4ddd1', 200: '#e8bca6', 300: '#d99775', 400: '#cb7950',
        500: '#bc5f38', 600: '#a64d2c', 700: '#883c24', 800: '#6e3220', 900: '#5b2c1e',
      },
      sand: { 50: '#faf7f1', 100: '#f3ecdf', 200: '#e8dcc6', 300: '#d8c5a5', 400: '#c4a87f' },
      moss: { 500: '#5b6b45', 600: '#4a5838', 700: '#3a452c' },
      ink: { 300: '#d6d3d1', 400: '#a8a29e', 500: '#78716c', 700: '#44403c', 800: '#292524', 900: '#1c1917' },
      surface: { DEFAULT: '#ffffff', muted: '#faf7f1', sunken: '#efe7d8' },
    },
    fonts: { sans: SANS, display: DISPLAY },
  },
  /** Indian-ocean beach palette — turquoise water, warm sand, coral accent. */
  beach: {
    label: 'Playa',
    colors: {
      brand: {
        50: '#e6f7f6', 100: '#c4ecea', 200: '#92dcd8', 300: '#5bc6c1', 400: '#31aaa5',
        500: '#1a8e89', 600: '#11746f', 700: '#125c58', 800: '#134a47', 900: '#123d3b',
      },
      sand: { 50: '#fbf8f3', 100: '#f5eee1', 200: '#ecdcc3', 300: '#dcc49d', 400: '#c9a878' },
      moss: { 500: '#e2674a', 600: '#cc5238', 700: '#a8412c' },
      ink: { 300: '#d6d3d1', 400: '#a8a29e', 500: '#78716c', 700: '#44403c', 800: '#292524', 900: '#1c1917' },
      surface: { DEFAULT: '#ffffff', muted: '#fbf8f3', sunken: '#eae0d0' },
    },
    fonts: { sans: SANS, display: DISPLAY },
  },
  /** Refined city palette — slate indigo, cool stone, muted gold accent. */
  city: {
    label: 'Ciudad',
    colors: {
      brand: {
        50: '#eef0f6', 100: '#d8dded', 200: '#b3bdd7', 300: '#8593bb', 400: '#5e6e9e',
        500: '#445485', 600: '#36436e', 700: '#2d3759', 800: '#28304a', 900: '#222840',
      },
      sand: { 50: '#f8f8f7', 100: '#eeeeec', 200: '#e0e0dd', 300: '#cacac5', 400: '#a8a8a2' },
      moss: { 500: '#b08a3e', 600: '#94722f', 700: '#735826' },
      ink: { 300: '#d4d4d8', 400: '#a1a1aa', 500: '#71717a', 700: '#3f3f46', 800: '#27272a', 900: '#18181b' },
      surface: { DEFAULT: '#ffffff', muted: '#f8f8f7', sunken: '#e8e8e6' },
    },
    fonts: { sans: SANS, display: DISPLAY },
  },
} satisfies Record<string, ThemePreset>;

export type ThemeName = keyof typeof presets;
