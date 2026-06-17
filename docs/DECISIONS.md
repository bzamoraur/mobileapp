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
  card-based reference UI; tokens centralised in `tailwind.config.js`.
- **Web Speech API for the phrasebook:** no API keys, works offline where a
  matching voice exists, degrades gracefully (button hidden if unsupported).
- **Google Maps via web links (not an embedded map SDK):** zero keys/cost, opens
  the user's native maps app, and keeps the bundle small and offline-friendly.
- **Bundled images for offline:** trip imagery lives under `public/img` and is
  precached; gradient fallbacks keep cards looking intentional before imagery
  exists.

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
- Optional CI auto-deploy to Cloudflare (wired, needs secrets).
- Real imagery sourcing happens during the import of the actual plan.
