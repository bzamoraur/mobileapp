# CLAUDE.md — Viaje (family travel companion PWA)

Guidance for working in this repo. Read this before making changes.

## What this is

A **mobile-first, offline-capable PWA** that holds one family trip's plan and is
shared with relatives via a link they can install to their home screen. It is a
data-driven recreation (improved) of a reference travel app: home/today, day
itinerary, places map, phrasebook with text-to-speech, and a help/logistics
section (flights, insurance, documents).

Everything the UI shows comes from **one validated data object** (`Trip`). There
is no backend: the app is fully static, so it deploys anywhere and works offline.

## Stack

- **Vite + React 18 + TypeScript (strict)** — SPA.
- **Tailwind CSS** — design system in `tailwind.config.ts`, palette + fonts
  driven by the active theme preset (`src/theme/presets.ts`).
- **react-router-dom** — routing.
- **zod** — the trip schema + runtime/build-time validation.
- **vite-plugin-pwa (Workbox)** — offline precache + installability.
- **Vitest + Testing Library** — tests.

Target: deploy to **Cloudflare Pages**. UI language: **Spanish only**.

## Commands

```bash
npm run dev            # local dev server
npm run build          # typecheck + production build (+ PWA service worker)
npm run preview        # serve the production build
npm run check          # typecheck + lint + test + validate:trip  (run before committing)
npm run validate:trip  # validate the active trip against the schema
node scripts/hash-code.mjs "code"   # generate VITE_ACCESS_CODE_HASH
node scripts/gen-icons.mjs          # regenerate PNG icons from the SVGs
```

Always run `npm run check` before committing. CI runs the same gate.

## Architecture / where things live

```
src/
  site.config.ts     # CONTENT LAYER: theme + branding (name, lang) per trip
  theme/presets.ts   # named palettes + fonts; `index.ts` resolves the active one
  data/
    schema.ts        # THE CONTRACT: zod schema + inferred types for a Trip
    trip.sample.ts   # sample trip (used until the real plan is generated)
    trip.ts          # the REAL trip (import-travel-plan / generate-from-destination)
    images.ts        # slug → /img/*.webp map referenced by trip.ts
    index.ts         # loads + validates the active trip; exports `trip`
    selectors.ts     # derived reads (today's day, lookups by id)
  lib/               # pure helpers: dates, maps url, tts, cn
  components/        # reusable UI (cards, modal, tab bar, icons, ...)
  features/access/   # the family access-code gate
  pages/             # one file per screen
  App.tsx            # routes
  main.tsx           # entry: SW registration, ErrorBoundary, AccessGate, App
public/              # icons, favicon, robots, _headers, _redirects
scripts/             # node helpers (icons, hash, trip validation, fetch-images)
docs/                # architecture, data model, security, deployment, factory, decisions
```

### Routes

`/` Home · `/dias` Days · `/dias/:index` Day detail · `/mapa` Map ·
`/frases` Phrases · `/ayuda` Help · `/vuelos` Flights · `/seguro` Insurance ·
`/alojamientos` Accommodations.

## Conventions (match these)

- **TypeScript is strict**, incl. `noUncheckedIndexedAccess` and
  `exactOptionalPropertyTypes`. Don't loosen tsconfig to make errors go away.
- **All trip content flows through the schema.** To add a field, update
  `schema.ts` first (it drives types + validation), then the UI.
- **Never hardcode trip content in components.** Components render `Trip` data.
- Import via the `@/` alias (e.g. `@/components/...`).
- Spanish user-facing copy. Keep code identifiers in English.
- Use `type`-only imports for types (lint enforces it).
- Prefer the existing primitives: `HeroImage` (gradient fallback), `Modal`,
  `MapsButton`, `ContactButton`, `CopyField`, `Tag`.
- **Accessibility & thumbs**: keep tap targets ≥ 44px (`.tap`), label icon-only
  buttons, respect `prefers-reduced-motion` (already wired in `index.css`).

## Offline & data-sensitivity rules

- The app must work with no connectivity. Bundle imagery under `public/img/...`
  and reference it as `/img/...` so it's precached. Avoid runtime-only network
  dependencies; external links (Google Maps, WhatsApp, Visit Japan Web) open in
  the system browser and are expected to need data.
- Trip data is **personal** (booking locators, phone numbers). It is `noindex`,
  and access is gated. See `docs/SECURITY.md` — the gate is deterrence, not
  authentication; Cloudflare Access is the real lock.

## Filling the trip (the "factory")

This codebase is a reusable **mold**; a trip is just its **content layer**
(`site.config.ts`, `data/trip.ts`, `data/images.ts`, `public/img/*`). Two skills
fill it, both ending green on `npm run check`:

- **`import-travel-plan`** — from a real booked plan (PDF/text/photos). Maps it
  onto the schema, writes `src/data/trip.ts`, sources imagery.
- **`generate-from-destination`** — from just a destination + preferences +
  length. Researches the place, picks a theme, writes the whole content layer
  with bookings left blank.

The factory's architecture, theme system and the per-trip-repo runbook (one repo
per trip) are documented in **`docs/FACTORY.md`**.
