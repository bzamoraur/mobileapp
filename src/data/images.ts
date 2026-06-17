/**
 * Curated remote imagery, one entry per slug used in `trip.ts`.
 *
 * These are Wikimedia Commons links (freely licensed) served via `Special:FilePath`,
 * which resolves a file name to the actual image. They load on a real device /
 * the Cloudflare deployment; this build sandbox blocks them, and ANY image that
 * fails simply falls back to a themed gradient (see HeroImage), so the layout is
 * never broken.
 *
 * To use your own photos instead: drop files in `public/img/<slug>.webp` and
 * point the slug below at `/img/<slug>.webp`. To fix a wrong photo, just change
 * its file name here.
 */
const wiki = (file: string, width = 1600) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;

export const img = {
  // Hero + safari
  hero: wiki('Mount Kilimanjaro Dec 2009 edit1.jpg'),
  arusha: wiki('Arusha clock tower.jpg'),
  'mount-meru': wiki('Mount Meru (Tanzania).jpg'),
  tarangire: wiki('Tarangire National Park 02.jpg'),
  'lake-manyara': wiki('Lake Manyara National Park.jpg'),
  ngorongoro: wiki('Ngorongoro Crater.jpg'),
  olduvai: wiki('Olduvai Gorge.jpg'),
  'serengeti-central': wiki('Serengeti Elefantenherde1.jpg'),
  'serengeti-norte': wiki('Wildebeest Mara River crossing.jpg'),
  'balloon-safari': wiki('Balloon Safari, Serengeti National Park, Tanzania.jpg'),
  karatu: wiki('Coffee plantation in Tanzania.jpg'),
  // Zanzíbar
  kendwa: wiki('Kendwa Beach, Zanzibar.jpg'),
  mnemba: wiki('Mnemba Island Zanzibar.jpg'),
  jozani: wiki('Zanzibar Red Colobus.jpg'),
  'prison-island': wiki('Aldabra giant tortoise on Prison Island, Zanzibar.jpg'),
  'stone-town': wiki('Stone Town, Zanzibar.jpg'),
  forodhani: wiki('Forodhani Gardens, Stone Town, Zanzibar.jpg'),
  'spice-farm': wiki('Spices of Zanzibar.jpg'),
  // Hotels — themed regional scenery (no freely-licensed hotel photos)
  rivertrees: wiki('Mount Meru (Tanzania).jpg'),
  burungue: wiki('Tarangire National Park 02.jpg'),
  kitela: wiki('Ngorongoro Crater.jpg'),
  lahia: wiki('Serengeti Elefantenherde1.jpg'),
  'mara-under-canvas': wiki('Wildebeest Mara River crossing.jpg'),
  'gold-zanzibar': wiki('Kendwa Beach, Zanzibar.jpg'),
  'zanzibar-serena': wiki('Stone Town, Zanzibar.jpg'),
};
