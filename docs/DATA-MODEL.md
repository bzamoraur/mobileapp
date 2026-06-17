# Data model — the `Trip` contract (schema v2)

The whole app renders from one object validated by `tripSchema` in
`src/data/schema.ts`. Author data against `TripInput` (defaulted fields may be
omitted); the loader parses it into a `Trip` (all defaults present). The schema
is the source of truth; this page is a human summary.

## Top level: `Trip`

| Field | Required | Notes |
| --- | --- | --- |
| `schemaVersion` | ✓ | Always `2`. |
| `id`, `title` | ✓ | e.g. `tanzania-2026`, `Tanzania & Zanzíbar`. |
| `subtitle`, `summary` | | Tagline + intro paragraph. |
| `startDate` / `endDate` | ✓ | `AAAA-MM-DD`. `end` ≥ `start`. |
| `destinationTimezone` | ✓ | IANA, e.g. `Africa/Dar_es_Salaam`. Drives "Hoy". |
| `phraseLang` | ✓ | BCP-47 for TTS, e.g. `sw-TZ`. |
| `heroImage` | | `/img/..` (bundled) or `https://..`. |
| `agency` | | Name, advisor, booking ref/locator, phone. |
| `days` | ✓ | ≥ 1, see below. |
| `places` | | Map entries (grouped by `region`). |
| `accommodations` | | Lodges/hotels. |
| `journeys` | | Multi-leg flights. |
| `insurance` | | Provider, coverages, assistance. |
| `phrases` | | Grouped phrasebook (Swahili). |
| `practical` | | Visa, vaccines, money, weather, packing, taxes, … |
| `inclusions` / `exclusions` | | "Incluye / no incluye" bullets. |

## `Day`

`index` (1-based, unique), optional `lastIndex` (multi-day, e.g. "Días 9–12"),
`date` and optional `endDate` (inclusive span), `title`, optional `area`,
`image`, `gallery[]`, `tags[]`, `summary`, optional `description` /
`transitNotes`, `activities[]`, `extras[]`, `mealsIncluded[]`, optional
`accommodationId` (→ `Accommodation.id`).

**Tags** are `{ label, kind }`, kind ∈ `flight | transfer | safari | freeDay |
family | important | mealIncluded | beach | culture | experience | optional |
info` (drives colour).

## `Activity` and `Extra`

- **Activity** (the planned day): `id`, `name`, `type` (`safari | sightseeing |
  transport | flight | experience | beach | culture | free`), optional
  `startTime`, `durationLabel`, `image`, `description`, `info` (modal), and a maps
  target via `placeId` (preferred) or `mapsQuery`.
- **Extra** (additional / optional things to see): `name`, optional
  `description`, `optional` (payable supplement), `price` (e.g. `"18 €"`),
  `placeId`/`mapsQuery`, `image`.

## `Place` (Map)

`id`, `name`, `area`, `region` (top-level group, e.g. `Safari` / `Zanzíbar`),
`category` (`park | crater | wildlife | nature | viewpoint | beach | town |
historic | market | culture | other`), optional `image` / `info` / `address`,
and required `mapsQuery`.

## `Accommodation`

`id`, `name`, `area`, optional `address` / `phone` / `website` / `image`,
`nights[]`, optional `board` (régimen), `roomType`, required `mapsQuery`,
optional `description`.

## `Journey` (flights)

`id`, `direction` (`outbound | return | domestic`), `date`, optional `label` /
`baggage`, and `legs[]`. Each **leg**: `airline`, `flightNumber`, `from`/`to`
(`{ name, code, city }`), `departLocal`/`arriveLocal` (`HH:MM`),
`arrivalDayOffset`, optional `durationLabel` / `aircraft`.

## `Insurance`, `Phrase`, `Practical`, `Agency`

- **Insurance**: `provider`, optional `plan` / locators / `policyNumber`,
  `coverages[]`, `assistance[]` (contacts), optional `email` / `notes`.
- **Phrase**: `{ es, target, pron?, note? }` grouped in `PhraseGroup`. The
  "Reproducir" button speaks `target` in `phraseLang`.
- **Practical**: `intro`, `documents[]`, `visa` (link), `vaccines`, `money`,
  `language`, `timezone`, `weather[]` (`{ month, minC, maxC, rainPct? }`),
  `packing[]`, `taxes[]`, `links[]`, `reminders[]`, `emergencyContacts[]`.
- **Agency**: `name`, advisor name/email/phone, booking ref, locator, phone.
- **Contact**: `{ label, value, channel, note? }`, channel ∈ `call | whatsapp |
  email | web | text`.

## Validation guarantees

`tripSchema.superRefine` enforces, at load + build time:

- `end` ≥ `start`; unique `day.index`; `lastIndex` ≥ `index`.
- every `day.accommodationId` resolves to an `Accommodation`.
- every `activity.placeId` and `extra.placeId` resolves to a `Place`.
- dates/times/URLs/images match their formats.

A violation throws on load and fails `npm run validate:trip` (and CI).
