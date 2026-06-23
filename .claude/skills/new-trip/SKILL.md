---
name: new-trip
description: Spin up a brand-new Viaje trip-app from the template, end to end — reset the content layer to a blank (no personal data), fill it (generate-from-destination or import-travel-plan), source imagery, verify, and ship to Cloudflare Pages. Use when starting a new trip in a repo created from the viaje-template. Orchestrates the other skills; does not replace them.
---

# Spin up a new trip-app (factory runbook)

Turn a repo freshly created from the **`viaje-template`** into a deployed,
access-gated trip-app. This skill **orchestrates** the existing pieces — it calls
`generate-from-destination` or `import-travel-plan`, it does not duplicate them.

## 0. Confirm you're in a fresh trip repo

Step 1 **wipes** the current trip content. Make sure you're in the **new** repo
(created via *Use this template* from `viaje-template`), not the canonical
template and not a live trip. The template must already carry the factory (the
mold + skills) — i.e. it was made from `mobileapp` after the factory landed on
`main`.

## 1. Reset to a blank, personal-data-free template

```bash
npm run new-trip -- --yes
```

Rewrites `src/data/trip.ts`, `src/site.config.ts`, `src/data/images.ts` to neutral
placeholders, empties the image `QUERIES`, and deletes the previous trip's photos
+ credits. **This is what stops one family's booking data or images leaking into
another's repo** — never skip it on a template copy.

## 2. Fill the content layer

Pick one (both write the content layer and end green on `npm run check`):

- **From a destination + preferences + length** → run **`generate-from-destination`**.
- **From a real booking** (PDF / text / photos) → run **`import-travel-plan`**.

They compose: generate a scaffold first, import real bookings on top later.

## 3. Source imagery (offline-first)

Where the network is open:

```bash
npm run fetch:images
```

…or trigger the **Fetch images** GitHub Action (repo → *Actions* → *Fetch images*
→ *Run workflow*). It downloads CC-licensed photos (Openverse + Wikimedia; no key
needed), optimises them to WebP, records `public/img/CREDITS.md`, and commits.
Missing photos fall back to themed gradients, so the app ships either way.

## 4. Verify

```bash
npm run check   # typecheck · lint · test · validate:trip
npm run build   # production bundle + PWA service worker
```

## 5. Access code + deploy

- `node scripts/hash-code.mjs "<family-word>"` → set the result as
  `VITE_ACCESS_CODE_HASH` in Cloudflare Pages (never commit it). See
  `docs/SECURITY.md`.
- Connect the repo to Cloudflare Pages (build `npm run build`, output `dist/`).
  Pushes to `main` auto-deploy. See `docs/DEPLOYMENT.md`.
- *(Optional)* attach a custom domain; *(optional)* add Cloudflare Access for
  real per-family authentication.

## Done when

- `npm run check` + `npm run build` are green.
- No placeholder text and **no other trip's data or photos** remain (`grep` for
  `nuevo-viaje`, the previous trip's id, or stray locators).
- The live URL opens, the gate accepts the code, and every tab works at phone
  width (Home, Días + day detail, Mapa, Frases/TTS, Ayuda).
