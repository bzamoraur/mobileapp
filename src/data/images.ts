/**
 * Imagery, one entry per slug used in `trip.ts`.
 *
 * Every entry is a local `/img/<file>.webp` file, bundled and precached for
 * offline use. Most were fetched with `scripts/fetch-images.mjs` (search +
 * download + optimize to WebP); a few were provided directly. ANY image that
 * fails to load falls back to a themed gradient (see HeroImage), so the layout
 * is never broken.
 *
 * To replace an image: drop a file in `public/img/` and point its slug at
 * `/img/<file>.webp` below, or re-run the fetch helper (see public/img/README.md
 * and public/img/CREDITS.md for attribution).
 */

// Photos reused across related slugs (hero area, lodge, region).
const arushaKili = '/img/arusha-kilimanjaro.webp';
const tarangire = '/img/tarangire.webp';
const manyara = '/img/lake-manyara.webp';
const ngorongoro = '/img/ngorongoro.webp';
const serengeti = '/img/serengeti.webp';
const maraNorte = '/img/serengeti-norte.webp';
const kendwa = '/img/kendwa.webp';
const stoneTown = '/img/stone-town.webp';

export const img = {
  // Hero + safari
  hero: '/img/hero.webp',
  arusha: '/img/arusha.webp',
  'mount-meru': '/img/mount-meru.webp',
  tarangire: tarangire,
  'lake-manyara': manyara,
  ngorongoro: ngorongoro,
  'serengeti-central': '/img/serengeti-central.webp',
  'serengeti-norte': maraNorte,
  olduvai: '/img/olduvai.webp',
  'balloon-safari': '/img/balloon-safari.webp',
  karatu: '/img/karatu.webp',
  // Zanzíbar
  kendwa: kendwa,
  'gold-zanzibar': kendwa,
  mnemba: '/img/mnemba.webp',
  jozani: '/img/jozani.webp',
  'prison-island': '/img/prison-island.webp',
  'stone-town': stoneTown,
  forodhani: '/img/forodhani.webp',
  'spice-farm': '/img/spice-farm.webp',
  // Hotels — themed regional scenery
  rivertrees: arushaKili,
  burungue: tarangire,
  kitela: ngorongoro,
  lahia: serengeti,
  'mara-under-canvas': maraNorte,
  'zanzibar-serena': stoneTown,
};
