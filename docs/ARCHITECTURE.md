# Architecture

## Shape

A static, client-only SPA. No server, no database, no API calls for core
functionality. The trip is compiled into the bundle as validated data; the
service worker precaches the app shell and bundled media for offline use.

```
Raw travel plan ──(import-travel-plan skill)──▶ src/data/trip.ts
                                                      │ (zod validate at load + build)
                                                      ▼
                          src/data/index.ts ── trip ──▶ pages/components
                                                      ▲
                                       selectors.ts (today, lookups)
```

## Layers

- **Data** (`src/data`): schema (contract), the trip, the validating loader,
  and pure selectors. Nothing here imports React.
- **Lib** (`src/lib`): pure, framework-free helpers (dates, maps URL, TTS,
  classnames) — unit-tested.
- **Components** (`src/components`): presentational, reusable. Receive data via
  props; the few that read the global `trip` do so through `@/data`.
- **Features** (`src/features`): self-contained concerns (the access gate).
- **Pages** (`src/pages`): one screen each, composed from components + data.

## Key decisions baked into the architecture

- **Single validated source of truth.** Adding/altering content means changing
  the schema first; types and validation follow. This makes a malformed plan a
  loud build failure, not a silent UI bug.
- **Offline-first.** Workbox precaches everything matched by the build glob;
  remote images get a CacheFirst runtime cache. External destinations (Maps,
  WhatsApp) intentionally require connectivity and open in the system browser.
- **Timezone-correct "today".** `todayInTimezone` resolves the current day in the
  destination's timezone so "Hoy" is right even mid-flight. Date formatting is
  UTC-anchored to avoid off-by-one drift.
- **Thin, accessible components.** Shared primitives (`HeroImage`, `Modal`,
  `MapsButton`, `ContactButton`, `CopyField`, `Tag`) keep pages declarative and
  consistent; icon buttons are labelled and tap targets are ≥ 44px.
- **Resilience.** An `ErrorBoundary` wraps the app and renders readable Spanish
  errors (including schema validation failures) instead of a blank screen.

## Rendering & routing

`BrowserRouter` with a shared `AppShell` layout (persistent bottom `TabBar`,
scroll-to-top on navigation). Sub-pages (day detail, flights, insurance,
accommodations) render inside the shell with a back button.

## Testing

Vitest + Testing Library (jsdom). Current coverage focuses on the highest-risk
pure logic: date/timezone handling and schema validation (including referential
integrity). Component/interaction tests are added alongside features.
