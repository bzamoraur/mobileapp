---
name: import-travel-plan
description: Convert a raw family travel plan (text, PDF, photos, or a forwarded itinerary) into the validated Trip data that powers the Viaje app. Use when the user shares a trip itinerary/plan to load into the app, or asks to add/update days, places, hotels, flights, insurance, phrases, or help info.
---

# Import a travel plan into the Viaje app

Turn a raw plan into `src/data/trip.ts` that conforms to `tripSchema`, wire it
up, source imagery, and finish green on `npm run check`.

## 0. Read the contract first

Before writing data, read `src/data/schema.ts` (authoritative) and
`docs/DATA-MODEL.md` (summary). The schema enforces formats and referential
integrity — design the data to satisfy it.

## 1. Extract structure from the raw plan

The plan may be free text, a PDF, screenshots, or a forwarded agency itinerary
(often Spanish). Pull out:

- Trip: title, dates (`startDate`/`endDate`), destination timezone, phrase
  language, family-facing subtitle.
- One `Day` per calendar day (1-based `index`, consecutive `date`s). For each:
  title, city, tags, a short `summary`, a longer `description`, optional
  `transitNotes` ("Cómo empezar"), `activities`, `mealsIncluded`, and which
  `accommodation` you sleep in that night.
- `places` worth a map pin (templos, miradores, mercados, barrios…).
- `accommodations` (name, city, address, phone, nights, mapsQuery).
- `flights` (ida/vuelta), `insurance` (locators + 24h assistance),
  `phrases` (destination language), `help` (documents, Visit-Japan-Web-style
  links, reminders, emergency numbers).

Ask the user for anything genuinely missing and sensitive (e.g. real booking
locators, assistance numbers) rather than inventing it. It's fine to leave
optional fields out.

## 2. Write `src/data/trip.ts`

- `export const trip: TripInput = { schemaVersion: 2, ... }` typed with
  `import type { TripInput } from './schema'`.
- Give every `day`, `activity`, `place`, `accommodation`, `flight` a stable
  unique `id`/`index`.
- **Link, don't duplicate:** reference places from activities via `placeId`, and
  set `day.accommodationId`. Validation rejects unknown references.
- Build `mapsQuery` as a clear, geocodable string (e.g. `"Senso-ji, Tokyo"`).
- Phrases: `es` (Spanish), `target` (destination script), `romaji` (reading).
  Verify the target text and reading; don't guess script.
- Mirror the reference's friendly Spanish tone in copy.
- **Tailored tick-off list:** add a `collections` checklist that fits the trip
  (monuments to see, photos to take, dishes to try…); see the schema's
  `collection`. Use `wildlife` only for safari/nature trips.

## 3. Activate it

Switch `src/data/index.ts` to import the real trip instead of the sample:

```ts
// import { sampleTrip } from './trip.sample';
import { trip as activeTrip } from './trip';
// ...
const raw: unknown = activeTrip;
```

Keep `trip.sample.ts` for tests. Update `schema.test.ts` only if the sample
changes.

## 4. Imagery (offline-first)

The app works without images (gradient fallbacks), but real photos are a big
UX win. When adding them:

- Save to `public/img/<area>/<slug>.webp` and reference as `/img/...` so they're
  **precached for offline**. Prefer WebP, keep files small (≈1600px max,
  optimised). Do **not** hotlink remote images for primary content (defeats
  offline); remote `https` URLs are allowed only as a fallback.
- Use imagery the family is allowed to use (their own photos, or correctly
  licensed/royalty-free). Record attribution if a license requires it.
- For generated hero/section art, the image-generation MCP tools are available;
  downscale results before bundling.

## 5. Validate and verify

```bash
npm run validate:trip   # schema + referential integrity
npm run check           # typecheck + lint + test + validate
npm run dev             # smoke-test every tab on a phone-width viewport
```

Walk all screens: Home (today/“Hoy”, esta-noche, mañana, accesos),
Días + day detail (actividades, comidas, alojamiento), Mapa (búsqueda +
filtros), Frases (Reproducir), Ayuda (documentos, enlaces, emergencias),
Vuelos/Seguro/Alojamientos.

## 6. Quality bar (do not skip)

- `npm run check` is green.
- No invented sensitive data; placeholders clearly marked if used.
- Dates consecutive and within `startDate`..`endDate`; `index` unique.
- Every `placeId`/`accommodationId` resolves.
- Spanish copy reads naturally; destination-language text is correct.
- Commit with a clear message; the app stays deployable at every step.
