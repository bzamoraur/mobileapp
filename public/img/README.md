# Trip imagery

Photos for the app live here as **`<slug>.webp`** and are referenced from
`src/data/images.ts`. They're bundled + precached for offline use. If a file is
absent (or a remote URL fails), the UI shows a themed gradient automatically —
so missing images never break the layout, and real photos appear the moment you
add them.

## Three ways to add images

### 1. Drop your own (best quality, fully offline)
Put a file here and point its slug at it in `src/data/images.ts`
(`slug: '/img/<slug>.webp'`). Optimise large files first:

```bash
node -e "require('sharp')('in.jpg').resize(1600).webp({quality:82}).toFile('public/img/serengeti-central.webp')"
```

### 2. Auto-search the web and save
`scripts/fetch-images.mjs` searches for the best match, downloads it, optimises
it to WebP, records attribution in `CREDITS.md`, and repoints the slug in
`images.ts`. Sources, in order: **Unsplash** (if `UNSPLASH_ACCESS_KEY` is set) →
**Openverse** (CC-licensed, no key) → **Wikimedia Commons** (no key).

```bash
# Best quality: set your Unsplash Access Key (see .env.example), then:
export UNSPLASH_ACCESS_KEY=xxxxxxxx
npm run fetch:images                      # every slug still missing
npm run fetch:images -- serengeti-norte   # just one slug
npm run fetch:images -- jozani "Zanzibar red colobus monkey"   # custom query
npm run fetch:images -- --force           # re-fetch everything
```

Get an Unsplash Access Key at <https://unsplash.com/oauth/applications> (create an
app → copy **Access Key**). The script honours Unsplash's API guidelines
(triggers the download endpoint, stores photographer attribution in `CREDITS.md`).

> Run this **where the network is open** (your machine / CI). The hosted build
> sandbox blocks image hosts, so it can only run locally. Review the results and
> licences in `CREDITS.md` before committing `public/img/*.webp` + `images.ts`.

### 3. Remote URLs (interim)
Slugs without a local file currently point at Wikimedia `Special:FilePath` URLs
in `images.ts`. They load on a real device / Cloudflare and cache for offline
after first view.

## Slugs (subject)

| Slug | Subject | Status |
| --- | --- | --- |
| `hero` / `arusha` / `mount-meru` / `rivertrees` | Kilimanjaro · Arusha (lodge + mountain) | ✅ provided |
| `tarangire` / `burungue` | Tarangire — elephants + baobabs | ✅ provided |
| `lake-manyara` | Lake Manyara — flamingos | ✅ provided |
| `ngorongoro` / `kitela` | Ngorongoro Crater | ✅ provided |
| `serengeti-central` / `lahia` | Serengeti — lions on a kopje | ✅ provided |
| `olduvai` | Olduvai Gorge | remote |
| `serengeti-norte` / `mara-under-canvas` | Mara River crossing | remote |
| `balloon-safari` | Hot-air balloon over the Serengeti | remote |
| `karatu` | Karatu / highlands, coffee | remote |
| `kendwa` / `gold-zanzibar` | Kendwa beach | remote |
| `mnemba` | Mnemba atoll snorkelling | remote |
| `jozani` | Jozani forest / red colobus | remote |
| `prison-island` | Prison Island giant tortoises | remote |
| `stone-town` / `zanzibar-serena` | Stone Town | remote |
| `forodhani` | Forodhani night market | remote |
| `spice-farm` | Zanzibar spice farm | remote |
