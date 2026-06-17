#!/usr/bin/env node
/**
 * Search the web for a photo of each place and save it into the app.
 *
 *   node scripts/fetch-images.mjs               # fetch every slug still missing
 *   node scripts/fetch-images.mjs serengeti-norte stone-town   # only these
 *   node scripts/fetch-images.mjs --force       # re-fetch even if a file exists
 *   node scripts/fetch-images.mjs jozani "Zanzibar red colobus monkey"  # custom query
 *
 * Sources (no API key needed):
 *   1. Openverse  (https://api.openverse.org) — aggregates CC-licensed images.
 *   2. Wikimedia Commons — fallback.
 * For each slug it downloads the best match, optimises it to a ~1600px WebP in
 * public/img/<slug>.webp, records attribution in public/img/CREDITS.md, and
 * repoints the slug at the local file in src/data/images.ts.
 *
 * IMPORTANT: run this where the network is open (your machine / CI). The hosted
 * build sandbox blocks image hosts, so it can only run locally.
 */
import { readFile, writeFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const imgDir = join(root, 'public', 'img');
const creditsFile = join(imgDir, 'CREDITS.md');
const imagesTs = join(root, 'src', 'data', 'images.ts');

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.error('Falta "sharp". Ejecuta: npm i -D sharp');
  process.exit(1);
}

// Default search query per slug (override on the CLI for one-offs).
const QUERIES = {
  hero: 'Kilimanjaro savanna acacia sunrise Tanzania',
  arusha: 'Arusha Tanzania town clock tower',
  'mount-meru': 'Mount Meru Tanzania',
  tarangire: 'Tarangire National Park elephants baobab',
  'lake-manyara': 'Lake Manyara flamingos Tanzania',
  ngorongoro: 'Ngorongoro Crater landscape Tanzania',
  olduvai: 'Olduvai Gorge Tanzania',
  'serengeti-central': 'Serengeti lion kopje savanna',
  'serengeti-norte': 'wildebeest Mara River crossing Serengeti',
  'balloon-safari': 'hot air balloon safari Serengeti',
  karatu: 'Karatu Tanzania coffee plantation highlands',
  kendwa: 'Kendwa beach Zanzibar turquoise',
  mnemba: 'Mnemba atoll Zanzibar snorkeling',
  jozani: 'Zanzibar red colobus Jozani forest',
  'prison-island': 'Prison Island Zanzibar giant tortoise',
  'stone-town': 'Stone Town Zanzibar street architecture',
  forodhani: 'Forodhani Gardens Stone Town night market',
  'spice-farm': 'Zanzibar spice farm cloves',
};

const args = process.argv.slice(2);
const force = args.includes('--force');
const positional = args.filter((a) => !a.startsWith('--'));
// `node fetch-images.mjs slug "custom query"`
const customQuery = positional.length === 2 ? positional[1] : null;
const slugs = positional.length
  ? [positional[0]]
  : Object.keys(QUERIES);

async function exists(p) {
  try {
    await access(p, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

const UA = 'ViajeApp/1.0 (personal travel app; image fetch script)';

async function searchOpenverse(query) {
  const url = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(query)}&page_size=8&license_type=commercial`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`Openverse ${res.status}`);
  const json = await res.json();
  return (json.results ?? []).map((r) => ({
    url: r.url,
    title: r.title,
    author: r.creator,
    license: `${r.license} ${r.license_version ?? ''}`.trim(),
    source: r.foreign_landing_url,
  }));
}

async function searchWikimedia(query) {
  const url =
    `https://commons.wikimedia.org/w/api.php?action=query&generator=search` +
    `&gsrsearch=${encodeURIComponent(query + ' filetype:bitmap')}&gsrnamespace=6&gsrlimit=8` +
    `&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1600&format=json&origin=*`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`Wikimedia ${res.status}`);
  const json = await res.json();
  const pages = json?.query?.pages ?? {};
  return Object.values(pages)
    .map((p) => p.imageinfo?.[0])
    .filter(Boolean)
    .map((ii) => ({
      url: ii.thumburl || ii.url,
      title: ii.extmetadata?.ObjectName?.value,
      author: ii.extmetadata?.Artist?.value?.replace(/<[^>]+>/g, ''),
      license: ii.extmetadata?.LicenseShortName?.value,
      source: ii.descriptionurl,
    }));
}

async function downloadToWebp(url, outPath) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`download ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await sharp(buf).resize(1600, null, { withoutEnlargement: true }).webp({ quality: 80 }).toFile(outPath);
}

async function recordCredit(slug, c) {
  let md = (await exists(creditsFile))
    ? await readFile(creditsFile, 'utf8')
    : '# Image credits\n\n| Slug | Title | Author | License | Source |\n| --- | --- | --- | --- | --- |\n';
  const row = `| ${slug} | ${c.title ?? ''} | ${c.author ?? ''} | ${c.license ?? ''} | ${c.source ?? ''} |\n`;
  md = md.replace(new RegExp(`^\\| ${slug} \\|.*\\n`, 'm'), ''); // de-dupe
  await writeFile(creditsFile, md + row);
}

async function repointImagesTs(slug) {
  const ts = await readFile(imagesTs, 'utf8');
  const key = /^[a-z0-9]+$/.test(slug) ? slug : `'${slug}'`;
  const re = new RegExp(`(^\\s*${key}:\\s*).*?,\\s*$`, 'm');
  if (!re.test(ts)) return false;
  await writeFile(imagesTs, ts.replace(re, `$1'/img/${slug}.webp',`));
  return true;
}

let ok = 0;
let failed = [];
for (const slug of slugs) {
  const out = join(imgDir, `${slug}.webp`);
  if (!force && (await exists(out))) {
    console.log(`• ${slug}: ya existe, omito (usa --force para rehacer)`);
    continue;
  }
  const query = customQuery ?? QUERIES[slug] ?? slug;
  let saved = false;
  for (const search of [searchOpenverse, searchWikimedia]) {
    try {
      const results = await search(query);
      for (const c of results) {
        if (!c.url) continue;
        try {
          await downloadToWebp(c.url, out);
          await recordCredit(slug, c);
          await repointImagesTs(slug);
          console.log(`✓ ${slug}  ←  ${c.license ?? 'CC'}  (${search.name})`);
          saved = true;
          ok++;
          break;
        } catch {
          /* try next result */
        }
      }
    } catch (e) {
      /* try next source */
    }
    if (saved) break;
  }
  if (!saved) {
    failed.push(slug);
    console.warn(`✗ ${slug}: no se pudo obtener imagen`);
  }
}

console.log(`\nHecho: ${ok} imágenes. ${failed.length ? 'Fallaron: ' + failed.join(', ') : ''}`);
console.log('Revisa public/img/CREDITS.md y haz commit de public/img/*.webp + src/data/images.ts');
