# The Viaje factory

How one codebase becomes many trip-apps — one per family or friend — quickly and
repeatably.

## Idea: a "mold" + a thin "content layer"

The app is split so that **almost everything is reusable** and only a small,
well-bounded set of files changes per trip.

```
                ┌──────────────── the mold (shared, never edited per trip) ────────────────┐
                │  components/  lib/  features/  pages/  data/schema.ts  data/index.ts      │
                │  data/selectors.ts  PWA + Workbox  theme/presets.ts  tailwind/vite config │
                └───────────────────────────────────────────────────────────────────────────┘
                                                   ▲   reads
                ┌──────────────── the content layer (swapped per trip) ────────┐
                │  src/site.config.ts     theme + branding (name, lang, desc)    │
                │  src/data/trip.ts       the validated Trip (days, places, …)   │
                │  src/data/images.ts     slug → /img/*.webp                      │
                │  scripts/fetch-images   QUERIES (slug → photo search)           │
                │  public/img/*.webp      bundled, precached photos               │
                │  VITE_ACCESS_CODE_HASH  the family access code (env/secret)     │
                └────────────────────────────────────────────────────────────────┘
```

Swapping the content layer re-skins and re-fills the whole app with **no markup
changes**: the theme retints every screen, and the schema guarantees the new
data renders (or fails loudly in CI).

## Two ways to fill the content layer

Both are Claude Code skills under `.claude/skills/`; both end on a green
`npm run check`.

| Skill | Start from | Produces |
|---|---|---|
| **`import-travel-plan`** | a real, booked plan (PDF/text/photos) | a `Trip` with real bookings — flights, locators, named hotels |
| **`generate-from-destination`** | just a destination + preferences + length | a researched, plausible `Trip` — itinerary, places, phrasebook, practical info — with bookings left blank |

They **compose**: generate a destination scaffold first, then import real
bookings on top when they exist.

## The theme system

`src/theme/presets.ts` holds named palettes + font stacks; `src/site.config.ts`
selects one with `theme: '<name>'`. Tailwind, the PWA manifest, `index.html`
branding and the map pins all read the active preset, so the choice is made in
exactly one place.

| Preset | Character | Typical destinations |
|---|---|---|
| `safari` | warm, earthy savanna | Tanzania, Kenya, Botswana, national parks |
| `beach` | turquoise + coral | Zanzíbar, Maldives, Caribbean, Greek isles |
| `city` | clean urban editorial | Japan, Italy, NYC, multi-city tours |

Add a theme by copying a block and changing the hues — keep the colour **keys**
(`brand`, `sand`, `moss`, `ink`, `surface`) so components keep working.

Per-trip **feature flags** live in `trip.ts` (`features`) — e.g. a city trip
sets `wildlifeTracker: false`; a domestic trip can drop `currencyConverter`.

## Runbook: spin up a new trip-app (one repo per trip)

> The decision is **one repo per trip** so each family gets an isolated app,
> deploy, access code, and (optionally) domain — and personal data never mixes.

1. **Create the repo** from the `viaje-template` GitHub template (Use this
   template → new repo). The template is this app with the sample trip and a
   neutral theme.
2. **Generate the content** — run the `generate-from-destination` skill (or
   `import-travel-plan` if a booking exists). Commit the content layer.
3. **Source imagery** — run `node scripts/fetch-images.mjs` where the network is
   open; commit `public/img/*` + updated `images.ts` + `CREDITS.md`.
4. **Set the access code** — `node scripts/hash-code.mjs "<word>"` and store the
   hash as `VITE_ACCESS_CODE_HASH` (build env / Cloudflare variable, never in
   git). See `docs/SECURITY.md`.
5. **Deploy** — connect the repo to Cloudflare Pages (build `npm run build`,
   output `dist/`). Pushes to `main` auto-deploy. See `docs/DEPLOYMENT.md`.
6. **(Optional) domain** — attach a custom subdomain in Cloudflare Pages.

## Status

- **M0 — template-ready theming** ✅ visual identity extracted into the content
  layer with zero UI regression for the Tanzania trip.
- **M1 — the generator** ✅ `generate-from-destination` skill + this runbook.
- **M2 — prove it** ⏳ create the `viaje-template` repo, generate a sample trip
  (a different destination + theme) into its own repo, and deploy it end-to-end.
  Needs the user to authorise creating the new repositories.
