#!/usr/bin/env node
/**
 * Reset the content layer to a blank, personal-data-free template.
 *
 * Run this right after creating a repo from the viaje-template and BEFORE filling
 * it with a real trip. It wipes the previous trip's data, branding and photos so
 * no one else's booking locators, contacts or images ship in the new repo.
 *
 *   npm run new-trip -- --yes
 *
 * It rewrites src/data/trip.ts, src/site.config.ts and src/data/images.ts to
 * neutral placeholders, empties the QUERIES in scripts/fetch-images.mjs, deletes
 * public/img/*.webp and resets public/img/CREDITS.md. Then fill the content with
 * the generate-from-destination or import-travel-plan skill.
 */
import { writeFile, readFile, readdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const p = (...parts) => join(root, ...parts);

const args = process.argv.slice(2);
if (!args.includes('--yes') && !args.includes('--force')) {
  console.error(
    'new-trip wipes the current trip content (trip.ts, site.config.ts, images.ts\n' +
      'and public/img/*.webp) and resets it to a blank template.\n\n' +
      'Make sure you are in a NEW repo from the template, then re-run to confirm:\n' +
      '  npm run new-trip -- --yes',
  );
  process.exit(1);
}

const TRIP = `import type { TripInput } from './schema';

/**
 * Placeholder trip — written by "npm run new-trip". It carries NO personal data.
 * Replace it by running the generate-from-destination or import-travel-plan skill
 * (they overwrite this file plus images.ts and site.config.ts). Until then the app
 * shows this friendly blank itinerary.
 */
export const trip: TripInput = {
  schemaVersion: 2,
  id: 'nuevo-viaje',
  title: 'Tu próximo viaje',
  subtitle: 'Aún por planear',
  summary:
    'Plantilla en blanco. Genera el contenido (destino, días, lugares, frases) con las skills del proyecto para reemplazar este texto.',
  startDate: '2026-01-01',
  endDate: '2026-01-03',
  destinationTimezone: 'Europe/Madrid',
  phraseLang: 'es-ES',

  accommodations: [
    {
      id: 'alojamiento',
      name: 'Alojamiento (por definir)',
      area: 'Destino',
      nights: ['1 noche'],
      mapsQuery: 'hotel',
    },
  ],
  places: [
    {
      id: 'lugar',
      name: 'Lugar de ejemplo',
      area: 'Destino',
      region: 'Destino',
      category: 'other',
      mapsQuery: 'plaza mayor',
    },
  ],
  days: [
    {
      index: 1,
      date: '2026-01-01',
      title: 'Día 1',
      summary: 'Edita src/data/trip.ts o ejecuta la skill de generación.',
      tags: [{ label: 'Por planear', kind: 'info' }],
    },
    {
      index: 2,
      date: '2026-01-02',
      title: 'Día 2',
      summary: 'Añade actividades, lugares y extras.',
      accommodationId: 'alojamiento',
      activities: [
        { id: 'd2-a1', name: 'Actividad de ejemplo', type: 'sightseeing', placeId: 'lugar' },
      ],
    },
  ],
  phrases: [
    {
      id: 'saludos',
      title: 'Saludos',
      phrases: [{ es: 'Hola', target: 'Hola', pron: 'O-la' }],
    },
  ],

  features: {
    wildlifeTracker: false,
  },
};
`;

const SITE = `import type { ThemeName } from './theme/presets';

/**
 * Per-trip branding + theme — reset to neutral by "npm run new-trip". The
 * generator/import skill sets these to the real trip's name and theme.
 */
export const site = {
  /** Active theme preset (see src/theme/presets.ts). */
  theme: 'city' as ThemeName,
  /** Full app name — PWA manifest name + browser-tab title. */
  appName: 'Viaje',
  /** Short name — PWA short_name + iOS home-screen label. */
  shortName: 'Viaje',
  /** Meta description (also the PWA manifest description). */
  description: 'Tu viaje, en el bolsillo. Funciona sin conexión.',
  /** UI language tag. */
  lang: 'es',
};
`;

const IMAGES = `/**
 * Imagery map (slug -> /img/<file>.webp), filled per trip by the generator/import
 * skill and scripts/fetch-images.mjs. Empty in the blank template; any missing
 * image falls back to a themed gradient (see HeroImage), so the layout never breaks.
 */
export const img: Record<string, string> = {};
`;

const CREDITS = `# Image credits

| Slug | Title | Author | License | Source |
| --- | --- | --- | --- | --- |
`;

await writeFile(p('src', 'data', 'trip.ts'), TRIP);
await writeFile(p('src', 'site.config.ts'), SITE);
await writeFile(p('src', 'data', 'images.ts'), IMAGES);
await writeFile(p('public', 'img', 'CREDITS.md'), CREDITS);

// Empty the per-trip image search queries (between the markers in fetch-images.mjs).
const fetchPath = p('scripts', 'fetch-images.mjs');
const fetchSrc = await readFile(fetchPath, 'utf8');
await writeFile(
  fetchPath,
  fetchSrc.replace(
    /\/\/ new-trip:queries-start[\s\S]*?\/\/ new-trip:queries-end/,
    '// new-trip:queries-start — reset to {} per trip by scripts/new-trip.mjs\nconst QUERIES = {};\n// new-trip:queries-end',
  ),
);

// Delete bundled trip photos (keep README.md / CREDITS.md / the icons folder).
const imgDir = p('public', 'img');
let removed = 0;
for (const f of await readdir(imgDir)) {
  if (f.endsWith('.webp')) {
    await rm(join(imgDir, f));
    removed += 1;
  }
}

console.log(
  '✓ Content layer reset to a blank template (no personal data).\n' +
    '  · trip.ts / site.config.ts / images.ts → placeholders\n' +
    `  · public/img: removed ${removed} photo(s); CREDITS.md reset\n` +
    '  · fetch-images QUERIES emptied\n\n' +
    'Next:\n' +
    '  1. Fill the trip: run generate-from-destination or import-travel-plan.\n' +
    '  2. Images (network open): npm run fetch:images\n' +
    '  3. Verify: npm run check',
);
