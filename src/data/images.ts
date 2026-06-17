/**
 * Imagery, one entry per slug used in `trip.ts`.
 *
 * - Local `/img/<file>.webp` files are bundled and precached for offline use
 *   (these are the photos you've provided).
 * - The rest point to freely-licensed Wikimedia Commons images via
 *   `Special:FilePath`; they load on a real device / the Cloudflare deployment
 *   (this build sandbox blocks them). ANY image that fails to load falls back to
 *   a themed gradient (see HeroImage), so the layout is never broken.
 *
 * To replace a remote image with your own: drop a file in `public/img/` and
 * point its slug at `/img/<file>.webp` below. The `scripts/fetch-images.mjs`
 * helper can also search and download images automatically (run it where the
 * network is open — see public/img/README.md).
 */
const wiki = (file: string, width = 1600) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;

// Provided photos, reused across related slugs (hero, lodge, area).
const arushaKili = '/img/arusha-kilimanjaro.webp';
const tarangire = '/img/tarangire.webp';
const manyara = '/img/lake-manyara.webp';
const ngorongoro = '/img/ngorongoro.webp';
const serengeti = '/img/serengeti.webp';

export const img = {
  // Hero + safari (provided photos)
  hero: arushaKili,
  arusha: arushaKili,
  'mount-meru': arushaKili,
  tarangire: tarangire,
  'lake-manyara': manyara,
  ngorongoro: ngorongoro,
  'serengeti-central': serengeti,
  // Safari (remote, pending photos)
  olduvai: wiki('Olduvai Gorge.jpg'),
  'serengeti-norte': wiki('Wildebeest Mara River crossing.jpg'),
  'balloon-safari': wiki('Balloon Safari, Serengeti National Park, Tanzania.jpg'),
  karatu: wiki('Coffee plantation in Tanzania.jpg'),
  // Zanzíbar (remote, pending photos)
  kendwa: wiki('Kendwa Beach, Zanzibar.jpg'),
  mnemba: wiki('Mnemba Island Zanzibar.jpg'),
  jozani: wiki('Zanzibar Red Colobus.jpg'),
  'prison-island': wiki('Aldabra giant tortoise on Prison Island, Zanzibar.jpg'),
  'stone-town': wiki('Stone Town, Zanzibar.jpg'),
  forodhani: wiki('Forodhani Gardens, Stone Town, Zanzibar.jpg'),
  'spice-farm': wiki('Spices of Zanzibar.jpg'),
  // Hotels — themed regional scenery
  rivertrees: arushaKili,
  burungue: tarangire,
  kitela: ngorongoro,
  lahia: serengeti,
  'mara-under-canvas': wiki('Wildebeest Mara River crossing.jpg'),
  'gold-zanzibar': wiki('Kendwa Beach, Zanzibar.jpg'),
  'zanzibar-serena': wiki('Stone Town, Zanzibar.jpg'),
};
