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

**Tailored tick-off sections.** The safari "Fauna" tracker is one instance of a
general `collections` feature: each trip can ship its own checklists —
"Monumentos", "Fotos que hacer", "Platos que probar", "Playas" — each rendering
as a Home tile + a tickable page whose "done" state saves on-device. Safari /
nature trips use `wildlife` (Big Five semantics); every other trip uses
`collections` (see the schema's `collection` / `collectionItem`).

## Runbook: spin up a new trip-app (one repo per trip)

> The decision is **one repo per trip** so each family gets an isolated app,
> deploy, access code, and (optionally) domain — and personal data never mixes.

The **`new-trip`** skill orchestrates the steps below end to end; this list is the
manual version (and the source of truth for what it does).

1. **Create the repo** from the `viaje-template` GitHub template (Use this
   template → new repo). The template is `mobileapp` *after the factory landed on
   `main`*, so a copy carries the mold **and** the skills — but it still holds the
   previous trip's content until step 2.
2. **Reset to a blank template** — `npm run new-trip -- --yes`. This rewrites the
   content layer to neutral placeholders and **deletes the previous trip's data,
   booking locators and photos**, so nothing personal leaks between repos. Never
   skip it on a template copy.
3. **Generate the content** — run the `generate-from-destination` skill (or
   `import-travel-plan` if a booking exists). Commit the content layer.
4. **Source imagery** — run `npm run fetch:images` where the network is open, or
   trigger the **Fetch images** GitHub Action (Actions → Run workflow; no API key
   needed). Commit `public/img/*` + updated `images.ts` + `CREDITS.md`.
5. **Set the access code** — `node scripts/hash-code.mjs "<word>"` and store the
   hash as `VITE_ACCESS_CODE_HASH` (build env / Cloudflare variable, never in
   git). See `docs/SECURITY.md`.
6. **Deploy** — connect the repo to Cloudflare Pages (build `npm run build`,
   output `dist/`). Pushes to `main` auto-deploy. See `docs/DEPLOYMENT.md`.
7. **(Optional) domain** — attach a custom subdomain in Cloudflare Pages.

### Gotchas learned in practice

- **Put the factory on `main` before templating.** *Use this template* copies the
  default branch as a one-time snapshot; if the mold/skills are only on a PR
  branch, the copy won't have them, and templating again later won't back-fill.
- **A running Claude Code session's repo scope is fixed at creation.** To fill a
  new trip repo, start a session scoped to it (the factory's "one repo per trip"
  already implies one session per trip).
- **The template is not neutral until reset.** `mobileapp` doubles as the live
  Tanzania app, so a fresh copy ships real personal data until step 2 runs.

## Keeping trips in sync with the mold

One repo per trip means a fix to the **mold** (components, schema, lib, skills,
CI, config, docs) doesn't reach trips already created. To pull mold updates into
a trip repo without disturbing its content:

```bash
git remote add template https://github.com/bzamoraur/mobileapp.git   # once
npm run sync-template
npm install && npm run check    # then review the diff, commit, open a PR
```

`sync-template` overwrites every mold file from the template branch and **leaves
the content layer untouched** (`site.config.ts`, `trip.ts`, `images.ts`, the
`fetch-images` QUERIES, and `public/img`). It refuses to run on a dirty tree and
never commits for you — you review the diff first.

Caveats: a file *deleted* in the template isn't auto-removed (scan `git status`);
and because the per-trip image QUERIES live inside `scripts/fetch-images.mjs`,
that script is treated as content — if the template changes its *logic*,
reconcile it by hand.

## Status

- **M0 — template-ready theming** ✅ visual identity extracted into the content
  layer with zero UI regression for the Tanzania trip.
- **M1 — the generator** ✅ `generate-from-destination` skill + this runbook.
- **M2 — prove it** ✅ a second trip (`viaje-japan`, Tokio & Kioto, city theme)
  was generated from the template and deployed live on Cloudflare Pages,
  end-to-end, in its own repo.
- **M3 — industrialise** 🚧 cut the per-trip manual surface.
  - ✅ `new-trip` reset + skill (blank, personal-data-free template).
  - ✅ **Fetch images** GitHub Action (on-demand, no key needed).
  - ✅ `sync-template` — propagate mold fixes into existing trip repos.
  - ✅ content-QA gate (`qa:content`) — placeholder / day-date / coordinate /
    link checks, in `npm run check` and CI.
  - ⏳ per-trip deploy automation (Wrangler); on-demand link-reachability check.
