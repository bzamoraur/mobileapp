# Decisions

Short log of the choices that shaped the project and why.

## Confirmed with the user

- **Installable PWA** (not native, not a plain site): opens from a link,
  installs to the home screen, works offline — the best fit for "open on a phone
  and share with family" without app stores.
- **Cloudflare Pages** hosting: free, fast, great PWA support, optional
  edge-level access control.
- **Shared access code** for privacy, with a documented upgrade path to
  Cloudflare Access for real authentication.
- **Spanish-only** UI (matches the family and the reference app).

## Engineering choices

- **Vite + React + TS over a meta-framework (Next/Astro):** the app is a small,
  interactive, fully static SPA. No SSR/server needs; Vite keeps it simple and
  deployable as plain static files anywhere.
- **Data-driven, single `Trip` schema (zod):** makes the app reusable for any
  trip and turns content mistakes into validation errors caught in CI.
- **Tailwind:** fast, consistent design system that mirrors the clean,
  card-based reference UI; tokens centralised in `tailwind.config.ts`, with the
  palette + fonts driven by the active theme preset so a trip re-skins from one
  file.
- **Web Speech API for the phrasebook:** no API keys, works offline where a
  matching voice exists, degrades gracefully (button hidden if unsupported).
- **Google Maps via web links (not an embedded map SDK):** zero keys/cost, opens
  the user's native maps app, and keeps the bundle small and offline-friendly.
- **Bundled images for offline:** trip imagery lives under `public/img` and is
  precached; gradient fallbacks keep cards looking intentional before imagery
  exists.

## Factory (reusing the app for many trips)

- **Mold + content layer:** the app is a reusable mold; a trip is defined by a
  small content layer (`site.config.ts`, `data/trip.ts`, `data/images.ts`,
  `public/img/*`). See `docs/FACTORY.md`.
- **Themes as presets:** named palettes in `src/theme/presets.ts`, selected in
  `site.config.ts` — Tailwind, manifest, `index.html` and map pins all read the
  active one, so re-skinning is a single-file change with zero markup edits.
- **Two generators:** `import-travel-plan` (from a booked plan) and
  `generate-from-destination` (from a destination + preferences + length).
- **One repo per trip:** each family gets an isolated repo, deploy, access code
  and optional domain — personal data never mixes between trips.

## Improvements over the reference

- True offline support + installability (PWA).
- Strict typing + schema validation + tests + CI quality gate.
- Accessibility: labelled controls, ≥44px targets, focus handling in the modal,
  reduced-motion support.
- Security headers, `noindex`, and a real (if modest) access gate with a path to
  edge auth.
- Timezone-correct "today" and drift-free date formatting.

## Open / deferred

- Optional component/interaction tests as screens are finalised.
- Deploys run via Cloudflare Pages' Git integration (push to `main`); CI is a
  quality gate only.
- Real imagery sourcing happens during the import/generation of a trip.
- Factory M2: create the `viaje-template` repo and prove the flow by generating
  + deploying a second trip in its own repo (needs the user to authorise the new
  repositories).
