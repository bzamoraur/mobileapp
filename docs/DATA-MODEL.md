# Data model — the `Trip` contract

The whole app renders from one object validated by `tripSchema` in
`src/data/schema.ts`. This is the contract your travel plan is mapped onto. The
schema is the source of truth; this page is a human summary.

## Top level: `Trip`

| Field | Required | Notes |
| --- | --- | --- |
| `schemaVersion` | ✓ | Always `1`. |
| `id` | ✓ | Slug, e.g. `japon-2026`. |
| `title` | ✓ | e.g. `Japón 2026`. |
| `subtitle` | | e.g. `Viaje en familia`. |
| `startDate` / `endDate` | ✓ | `AAAA-MM-DD`. `end` ≥ `start`. |
| `destinationTimezone` | ✓ | IANA, e.g. `Asia/Tokyo`. Drives "Hoy". |
| `phraseLang` | ✓ | BCP-47 for TTS, e.g. `ja-JP`. |
| `heroImage` | | `/img/..` (bundled) or `https://..`. |
| `days` | ✓ | ≥ 1, see below. |
| `places` | | Map screen entries. |
| `accommodations` | | Hotels/ryokans. |
| `flights` | | Outbound/return. |
| `insurance` | | Locators + 24h assistance. |
| `phrases` | | Grouped phrasebook. |
| `help` | | Documents, links, reminders, emergencies. |

## `Day`

`index` (1-based, unique), `date` (`AAAA-MM-DD`), `title`, optional `city`,
optional `image`, `tags[]`, `summary` (card text), optional `description`,
optional `transitNotes` ("Cómo empezar"), `activities[]`, `mealsIncluded[]`,
optional `accommodationId` (→ an `Accommodation.id`).

**Tags** are `{ label, kind }` where `kind` ∈ `transfer | freeDay | family |
flight | important | mealIncluded | organized | optional | info` (drives colour).

## `Activity`

`id`, `name`, `type` (`sightseeing | food | shop | transport | experience |
temple | viewpoint | free`), optional `startTime`, `durationLabel`, `image`,
`description`, `info` (long, shown in modal), and a maps target via either
`placeId` (→ a `Place`, preferred) or a raw `mapsQuery`.

## `Place` (Map screen)

`id`, `name`, `city`, `category` (`temple | monument | market | food | nature |
shopping | museum | neighborhood | other`), optional `image`, `info`, `address`,
and `mapsQuery` (required — free text like `Senso-ji, Tokyo`).

## `Accommodation`

`id`, `name`, `city`, optional `address`, `phone`, `image`, `nights[]`
(human-readable, e.g. `["19 de junio"]`), `mapsQuery`, optional `checkIn`/`checkOut`.

## `Flight`

`id`, `direction` (`outbound | return`), `airline`, `flightNumber`, `date`,
`from`/`to` (`{ name, code, city }`), `departLocal`/`arriveLocal` (`HH:MM`),
`arrivalDayOffset` (e.g. `1`), optional `durationLabel`, `baggage`, `notes`.

## `Insurance`

`provider`, optional `bookingLocator`, `providerLocator`, `policyNumber`,
`assistance[]` (contacts), optional `email`, `notes`.

## `Contact`

`{ label, value, channel, note? }` where `channel` ∈ `call | whatsapp | email |
web | text`. Renders the right action button.

## `PhraseGroup` / `Phrase`

Group: `{ id, title, phrases[] }`. Phrase: `{ es, target, romaji?, note? }` —
`target` is destination-language text (kana/kanji), `romaji` the reading. The
"Reproducir" button speaks `target` in `phraseLang`.

## `Help`

`documents[]` (checklist bullets), `links[]` (`{ label, url, description? }`),
`reminders[]`, `emergencyContacts[]`.

## Validation guarantees

`tripSchema.superRefine` enforces referential integrity at validation time:

- `end` ≥ `start`.
- unique `day.index`.
- every `day.accommodationId` resolves to an `Accommodation`.
- every `activity.placeId` resolves to a `Place`.
- dates/times/URLs/images match their formats.

A violation throws on load and fails `npm run validate:trip` (and CI), so broken
data never ships.
