---
name: generate-from-destination
description: Generate a complete Viaje trip-app from scratch given only a destination, some preferences and a trip length (no booked itinerary yet). Researches the destination, picks a theme, and writes the full content layer (trip data, branding, imagery) that conforms to the Trip schema. Use when the user wants to spin up a new trip-app for a place ("a 7-day Japan trip", "a beach week in Zanzíbar") rather than importing an already-booked plan.
---

# Generate a Viaje trip-app from a destination

Turn a **destination + preferences + length** into the full content layer of a
working Viaje app: researched itinerary, places, phrasebook and practical info,
a fitting theme, and imagery — ending green on `npm run check`.

This is the "from scratch" sibling of **`import-travel-plan`**. That skill
overlays a *real booking* (locators, flight numbers, hotel names). This one
builds a *plausible, well-researched plan* for a place nobody has booked yet.
They compose: generate first, then import real bookings on top later.

## What you write (the "content layer")

Everything else (components, schema, lib, PWA) is the shared "mold" — never
touch it. A trip is defined entirely by these files:

| File | Role |
|---|---|
| `src/site.config.ts` | theme + branding (app name, short name, description, lang) |
| `src/data/trip.ts` | the `Trip` object (days, places, phrases, practical…) |
| `src/data/images.ts` | slug → `/img/<file>.webp` map referenced by `trip.ts` |
| `scripts/fetch-images.mjs` | `QUERIES` map (slug → photo search query) |
| `public/img/*.webp` | the bundled, precached photos |

`src/data/index.ts` already imports `./trip`, so writing `trip.ts` activates it.

## 0. Read the contract first

Read `src/data/schema.ts` (authoritative, **schema v2**) and
`docs/DATA-MODEL.md`. Note: `schemaVersion: 2`; phrases use `es` / `target` /
`pron`; days are 1-based with optional `lastIndex` for multi-day stops; places
need `area`, `region`, `category`, `mapsQuery` (+ optional `lat`/`lng` for the
interactive map); every `placeId`/`accommodationId` must resolve.

## 1. Gather the brief

Collect (ask only for what's missing — pick sensible defaults and state them):

- **Destination(s)** and rough **regions** to cover.
- **Length** in days, or explicit `startDate`/`endDate`. If only a length is
  given, choose plausible near-future dates and say so.
- **Travellers**: family / couple / friends, and ages if it changes the plan.
- **Interests**: wildlife, beaches, culture, food, hiking, nightlife, slow vs.
  packed **pace**, and a rough **budget tier**.
- **Languages**: UI stays Spanish; set `phraseLang` to the destination language.

## 2. Research the destination (don't hallucinate)

Use the **`deep-research`** skill (or web search + fetch) to gather *real* facts.
Verify before writing:

- A day-by-day **itinerary** that fits the length, interests and pace, grouped
  into **areas** (each multi-night base is one stop).
- **Places** worth a map pin: real names, a geocodable `mapsQuery`
  (e.g. `"Fushimi Inari, Kyoto"`), and `lat`/`lng` when you can verify them.
- **Phrases** in the destination language: `es`, `target` (correct script), and
  `pron`. Verify the script and reading — never guess characters.
- **Practical** info: currency + **approximate** exchange rates (label them
  "aprox."), etiquette, tipping norms, **emergency numbers**, plug type,
  documents/visa link, and a short month-by-month weather feel.
- **Wildlife** list *only* for nature/safari trips (species + where seen).

## 3. Choose the theme + branding → `site.config.ts`

Pick the preset whose character matches the destination (see
`src/theme/presets.ts`):

| Preset | Use for | Notes |
|---|---|---|
| `safari` | savanna / wildlife / national parks | turn the wildlife tracker on |
| `beach` | coast / islands / tropical | |
| `city` | urban / cultural / multi-city | turn the wildlife tracker off |

Set `appName` (tab title + manifest), `shortName` (home-screen label),
`description`, and `lang`. Then set the **feature flags** in `trip.ts`
(`features`) to match: e.g. `wildlifeTracker: false` and omit `wildlife` for a
city trip; keep `currencyConverter` on only when the currency differs from the
travellers' home one.

## 4. Write the content layer

- `src/data/trip.ts`: `export const trip: Trip = { schemaVersion: 2, ... }`,
  `import type { Trip } from './schema'` and `import { img } from './images'`.
  Stable unique `id`/`index` everywhere; **link, don't duplicate** (`placeId`,
  `accommodationId`). Friendly Spanish copy that matches the existing tone.
- `src/data/images.ts`: add a slug per hero/day/place/species you reference.
- **Honesty rule (important).** This plan is **not booked**, so do **not**
  invent personal/sensitive data: omit `journeys` (flight numbers), `insurance`
  locators, agency refs, and lodge phone/address — the schema makes them
  optional. Accommodations can be **generic suggestions by area** (mark them as
  suggestions in `description`). Destination *facts* (places, phrases, currency,
  emergency numbers) must be real and verified.

## 5. Imagery (offline-first)

- Add a `slug: "search query"` entry to `QUERIES` in
  `scripts/fetch-images.mjs` for every new slug.
- Run `node scripts/fetch-images.mjs` **where the network is open** (your
  machine / CI; the build sandbox blocks image hosts). It downloads, optimises
  to ~1600px WebP in `public/img/`, records attribution in `CREDITS.md`, and
  repoints the slug in `images.ts`.
- Missing photos fall back to themed gradients — the layout never breaks, so a
  trip is shippable even before every image lands.

## 6. Validate and verify

```bash
npm run validate:trip   # schema + referential integrity
npm run check           # typecheck + lint + test + validate
npm run dev             # smoke-test every tab at phone width
```

Walk Home, Días + day detail, Mapa (search + filters + pins), Frases
(Reproducir / TTS), Ayuda (documents, links, emergencies), and the converter.

## 7. Quality bar (do not skip)

- `npm run check` is green; the app stays deployable at every step.
- No invented bookings or sensitive data; suggestions clearly labelled.
- Dates consecutive and within `startDate`..`endDate`; `index` unique; every
  `placeId`/`accommodationId` resolves.
- Spanish reads naturally; destination-language text + script are correct.
- Theme + feature flags fit the destination.

## 8. Ship it as its own app

The factory keeps **one trip per repo**. See `docs/FACTORY.md` for the runbook:
create a repo from the `viaje-template`, run this skill there, add an access
code, and connect Cloudflare Pages. This skill only writes the content layer —
deployment is a separate, documented step.
