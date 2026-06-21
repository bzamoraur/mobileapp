import { describe, it, expect } from 'vitest';
import { presets } from './presets';

/**
 * The factory swaps the active theme by name (`src/site.config.ts`), so every
 * preset must be a complete, drop-in palette. These tests lock that invariant:
 * a new or edited preset that drops a colour shade, mistypes a hex value, or
 * forgets a font stack fails CI instead of shipping an app with broken colours.
 *
 * `safari` is the canonical, battle-tested theme (it powers the live trip), so
 * every other preset must mirror its colour-group + shade shape exactly.
 */

const CANON = 'safari';
const names = Object.keys(presets) as (keyof typeof presets)[];

/** Sorted "group → shade keys" map, e.g. `{ brand: ['100','200',…], … }`. */
function shapeOf(name: keyof typeof presets): Record<string, string[]> {
  const shape: Record<string, string[]> = {};
  for (const [group, scale] of Object.entries(presets[name].colors)) {
    shape[group] = Object.keys(scale).sort();
  }
  return shape;
}

describe('theme presets', () => {
  it('expose the canonical colour groups + shades in every preset', () => {
    const canon = shapeOf(CANON);
    for (const name of names) {
      expect(shapeOf(name), `preset "${name}"`).toEqual(canon);
    }
  });

  it('use a valid 6-digit hex for every colour value', () => {
    for (const name of names) {
      for (const [group, scale] of Object.entries(presets[name].colors)) {
        for (const [shade, value] of Object.entries(scale)) {
          expect(value, `${name}.${group}.${shade}`).toMatch(/^#[0-9a-f]{6}$/i);
        }
      }
    }
  });

  it('define a label and non-empty sans + display font stacks', () => {
    for (const name of names) {
      const p = presets[name];
      expect(p.label.length, `${name}.label`).toBeGreaterThan(0);
      expect(p.fonts.sans.length, `${name}.fonts.sans`).toBeGreaterThan(0);
      expect(p.fonts.display.length, `${name}.fonts.display`).toBeGreaterThan(0);
    }
  });
});
