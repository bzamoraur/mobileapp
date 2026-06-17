# Viaje — family travel companion

A mobile-first, **offline-capable PWA** that holds one family trip's plan and is
shared with relatives via a link they can install to their home screen. Home /
today, day-by-day itinerary, places map, phrasebook with text-to-speech, and a
help section (flights, insurance, documents). Data-driven, Spanish UI.

> Recreation (improved) of a reference travel app — see `docs/DECISIONS.md`.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run check      # typecheck + lint + test + validate (run before committing)
npm run build      # production build + PWA service worker → dist/
```

The app boots with a **sample trip** until the real plan is loaded.

## Load a real trip

Share your travel plan and it gets mapped onto the typed `Trip` schema via the
[`import-travel-plan`](.claude/skills/import-travel-plan/SKILL.md) skill, which
writes `src/data/trip.ts`, sources imagery, and verifies everything.

## Privacy

Trip data is personal. It's `noindex`, behind a family **access code**, and
served with strict security headers. The code is deterrence, not real auth — for
that, front the deploy with Cloudflare Access. See `docs/SECURITY.md`.

```bash
node scripts/hash-code.mjs "family-code"   # → set as VITE_ACCESS_CODE_HASH
```

## Docs

- [`CLAUDE.md`](CLAUDE.md) — working in this repo
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- [`docs/DATA-MODEL.md`](docs/DATA-MODEL.md) — the `Trip` contract
- [`docs/SECURITY.md`](docs/SECURITY.md)
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — Cloudflare Pages
- [`docs/DECISIONS.md`](docs/DECISIONS.md)

## Stack

Vite · React · TypeScript (strict) · Tailwind · react-router · zod ·
vite-plugin-pwa · Vitest. Deploys to Cloudflare Pages.
