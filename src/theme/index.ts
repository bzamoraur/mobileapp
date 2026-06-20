import { presets } from './presets';
import { site } from '../site.config';

/** The active theme preset, resolved from `src/site.config.ts`. */
export const theme = presets[site.theme];

export { presets };
export type { ThemeName, ThemePreset, Palette, ColorScale } from './presets';
