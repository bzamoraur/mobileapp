#!/usr/bin/env node
// Rasterises the SVG icons into the PNG sizes the PWA manifest needs.
// Run with: node scripts/gen-icons.mjs   (requires the optional `sharp` dep)
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.error('Falta "sharp". Instala con: npm i -D sharp  y reejecuta.');
  process.exit(1);
}

const favicon = await readFile(join(pub, 'favicon.svg'));
const maskable = await readFile(join(pub, 'icons', 'maskable.svg'));

await mkdir(join(pub, 'icons'), { recursive: true });

const jobs = [
  [favicon, 192, join(pub, 'icons', 'icon-192.png')],
  [favicon, 512, join(pub, 'icons', 'icon-512.png')],
  [maskable, 512, join(pub, 'icons', 'icon-512-maskable.png')],
  [favicon, 180, join(pub, 'apple-touch-icon.png')],
];

for (const [svg, size, out] of jobs) {
  const png = await sharp(svg, { density: 384 }).resize(size, size).png().toBuffer();
  await writeFile(out, png);
  console.log(`✓ ${out.replace(root + '/', '')} (${size}×${size})`);
}
