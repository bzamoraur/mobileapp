import { z } from 'zod';

/**
 * The single source of truth for a trip (schema v2).
 *
 * Everything the app renders comes from one validated object that conforms to
 * `tripSchema`. The raw travel plan (a Pangea booking PDF) is transformed into a
 * `Trip` and validated at build time and at runtime, so a malformed plan fails
 * loudly instead of rendering a broken screen.
 *
 * v2 generalises the model for a safari + beach trip: itinerary stops are
 * "areas" rather than cities, flights are multi-leg journeys, each day can carry
 * optional "extra things to see/do" (with prices), and there is a rich practical
 * section (visa, vaccines, weather, packing, taxes).
 */

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Usa el formato AAAA-MM-DD')
  .refine((s) => !Number.isNaN(Date.parse(`${s}T00:00:00`)), 'Fecha inválida');

const localTime = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Usa el formato HH:MM');

const httpUrl = z
  .string()
  .url()
  .refine((u) => /^https?:\/\//.test(u), 'Solo se permiten URLs http(s)');

/** Image reference: a bundled asset path ("/img/..") or an https URL. */
const imageRef = z
  .string()
  .min(1)
  .refine(
    (s) => s.startsWith('/') || /^https:\/\//.test(s),
    'La imagen debe ser una ruta local (/img/..) o una URL https',
  );

const phone = z.string().min(3).max(40);

// ---------------------------------------------------------------------------
// Shared building blocks
// ---------------------------------------------------------------------------

export const tagKind = z.enum([
  'flight', // Vuelo
  'transfer', // Traslado
  'safari', // Safari / game drive
  'freeDay', // Día libre
  'family', // Ruta de la familia
  'important', // Importante
  'mealIncluded', // Pensión / comidas
  'beach', // Playa
  'culture', // Cultura / ciudad
  'experience', // Experiencia destacada
  'optional', // Opcional
  'info', // generic
]);

export const tag = z.object({
  label: z.string().min(1),
  kind: tagKind,
});

/** Place categories drive icons + grouping on the Map screen. */
export const placeCategory = z.enum([
  'park', // Parque nacional / reserva
  'crater', // Cráter / caldera
  'wildlife', // Fauna / avistamiento
  'nature', // Naturaleza / paisaje
  'viewpoint', // Mirador
  'beach', // Playa / mar
  'town', // Ciudad / pueblo
  'historic', // Lugar histórico / patrimonio
  'market', // Mercado
  'culture', // Cultura / experiencia
  'other',
]);

/** A contact a traveller might use (advisor, assistance, insurer...). */
export const contact = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  channel: z.enum(['call', 'whatsapp', 'email', 'web', 'text']).default('call'),
  note: z.string().optional(),
});

/** An optional or suggested extra at a stop ("cosas adicionales que ver/hacer"). */
export const extra = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  /** True if it is an optional, payable supplement. */
  optional: z.boolean().default(false),
  /** Human-readable price, e.g. "18 €". */
  price: z.string().optional(),
  placeId: z.string().optional(),
  mapsQuery: z.string().optional(),
  image: imageRef.optional(),
});

// ---------------------------------------------------------------------------
// Places (Map screen)
// ---------------------------------------------------------------------------

export const place = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  /** Itinerary area, e.g. "Serengeti", "Zanzíbar". */
  area: z.string().min(1),
  /** Top-level grouping on the Map, e.g. "Safari", "Zanzíbar". */
  region: z.string().min(1),
  category: placeCategory,
  image: imageRef.optional(),
  info: z.string().optional(),
  address: z.string().optional(),
  mapsQuery: z.string().min(1),
  /** Latitude (WGS84) for the interactive map marker. Optional + backward-compatible. */
  lat: z.number().min(-90).max(90).optional(),
  /** Longitude (WGS84) for the interactive map marker. Optional + backward-compatible. */
  lng: z.number().min(-180).max(180).optional(),
});

// ---------------------------------------------------------------------------
// Days + activities (Itinerary)
// ---------------------------------------------------------------------------

export const activity = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z
    .enum(['safari', 'sightseeing', 'transport', 'flight', 'experience', 'beach', 'culture', 'free'])
    .default('sightseeing'),
  startTime: localTime.optional(),
  durationLabel: z.string().optional(),
  image: imageRef.optional(),
  description: z.string().optional(),
  info: z.string().optional(),
  placeId: z.string().optional(),
  mapsQuery: z.string().optional(),
});

export const day = z.object({
  /** First day number (1-based). */
  index: z.number().int().positive(),
  /** For multi-day stops, the last day number (e.g. 12 for "Días 9–12"). */
  lastIndex: z.number().int().positive().optional(),
  date: isoDate,
  /** End date for multi-day stops (inclusive). */
  endDate: isoDate.optional(),
  title: z.string().min(1),
  /** Itinerary area/region label, e.g. "Serengeti central". */
  area: z.string().optional(),
  image: imageRef.optional(),
  gallery: z.array(imageRef).default([]),
  tags: z.array(tag).default([]),
  summary: z.string().min(1),
  description: z.string().optional(),
  transitNotes: z.string().optional(),
  activities: z.array(activity).default([]),
  /** Additional / optional things to see or do at this stop. */
  extras: z.array(extra).default([]),
  mealsIncluded: z.array(z.string()).default([]),
  accommodationId: z.string().optional(),
});

// ---------------------------------------------------------------------------
// Flights (multi-leg journeys), accommodation, insurance
// ---------------------------------------------------------------------------

const airport = z.object({
  name: z.string().min(1),
  code: z.string().min(3).max(4),
  city: z.string().min(1),
});

export const flightLeg = z.object({
  airline: z.string().min(1),
  flightNumber: z.string().min(1),
  from: airport,
  to: airport,
  departLocal: localTime,
  arriveLocal: localTime,
  arrivalDayOffset: z.number().int().min(0).default(0),
  durationLabel: z.string().optional(),
  aircraft: z.string().optional(),
});

export const journey = z.object({
  id: z.string().min(1),
  direction: z.enum(['outbound', 'return', 'domestic']),
  date: isoDate,
  label: z.string().optional(),
  baggage: z.string().optional(),
  /** Airline check-in / manage-booking URL (for the CKI quick link). */
  checkInUrl: httpUrl.optional(),
  legs: z.array(flightLeg).min(1),
});

export const accommodation = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  area: z.string().min(1),
  address: z.string().optional(),
  phone: phone.optional(),
  website: httpUrl.optional(),
  image: imageRef.optional(),
  /** Human-readable nights, e.g. ["18 ago", "19 ago"] or ["5 noches"]. */
  nights: z.array(z.string()).default([]),
  /** Régimen, e.g. "Pensión completa con bebidas". */
  board: z.string().optional(),
  roomType: z.string().optional(),
  mapsQuery: z.string().min(1),
  description: z.string().optional(),
});

export const insurance = z.object({
  provider: z.string().min(1),
  plan: z.string().optional(),
  bookingLocator: z.string().optional(),
  providerLocator: z.string().optional(),
  policyNumber: z.string().optional(),
  /** Key coverages as bullets. */
  coverages: z.array(z.string()).default([]),
  assistance: z.array(contact).default([]),
  email: z.string().email().optional(),
  notes: z.string().optional(),
});

// ---------------------------------------------------------------------------
// Phrasebook, practical info
// ---------------------------------------------------------------------------

export const phrase = z.object({
  es: z.string().min(1),
  /** Target-language text (Swahili here). */
  target: z.string().min(1),
  /** Pronunciation guide, shown in parentheses. */
  pron: z.string().optional(),
  note: z.string().optional(),
});

export const phraseGroup = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  phrases: z.array(phrase).min(1),
});

export const helpLink = z.object({
  label: z.string().min(1),
  url: httpUrl,
  description: z.string().optional(),
});

export const weatherRow = z.object({
  month: z.string().min(1),
  minC: z.number().int(),
  maxC: z.number().int(),
  rainPct: z.number().int().min(0).max(100).optional(),
});

/** One currency in the offline converter, expressed against the base currency. */
export const exchangeRate = z.object({
  code: z.string().min(1),
  label: z.string().optional(),
  /** How many units of this currency equal 1 unit of `base`. */
  perBase: z.number().positive(),
});

/** Offline exchange-rate snapshot powering the currency converter. */
export const exchange = z.object({
  base: z.string().min(1),
  /** Human label for when the rates were captured, e.g. "junio 2026 (aprox.)". */
  updated: z.string().optional(),
  rates: z.array(exchangeRate).min(1),
});

/** Rich practical section powering the Ayuda screen. */
export const practical = z.object({
  intro: z.string().optional(),
  documents: z.array(z.string()).default([]),
  visa: helpLink.optional(),
  vaccines: z.string().optional(),
  money: z.string().optional(),
  exchange: exchange.optional(),
  language: z.string().optional(),
  timezone: z.string().optional(),
  weather: z.array(weatherRow).default([]),
  packing: z.array(z.string()).default([]),
  etiquette: z.array(z.string()).default([]),
  tipping: z.string().optional(),
  taxes: z.array(z.string()).default([]),
  links: z.array(helpLink).default([]),
  reminders: z.array(z.string()).default([]),
  emergencyContacts: z.array(contact).default([]),
});

export const agency = z.object({
  name: z.string().min(1),
  advisorName: z.string().optional(),
  advisorEmail: z.string().email().optional(),
  advisorPhone: phone.optional(),
  bookingRef: z.string().optional(),
  locator: z.string().optional(),
  phone: phone.optional(),
});

// ---------------------------------------------------------------------------
// On-device features: wildlife tracker + per-trip feature switches
// ---------------------------------------------------------------------------

/** A species the traveller can tick off as "spotted" (state is saved on-device). */
export const wildlifeSpecies = z.object({
  id: z.string().min(1),
  /** Common name in the UI language, e.g. "León". */
  name: z.string().min(1),
  /** Name in the destination language (Swahili here), e.g. "Simba". */
  nameLocal: z.string().optional(),
  /** True for the classic "Big Five". */
  big5: z.boolean().default(false),
  /** Where/when it is most likely to be seen. */
  note: z.string().optional(),
  /** Portrait for the detail card (gradient-falls-back if absent). */
  image: imageRef.optional(),
  /** One-line description shown in the detail card. */
  about: z.string().optional(),
  /** A "¿Sabías que…?" fun fact for the detail card. */
  fact: z.string().optional(),
});

/**
 * Per-trip feature switches. Optional features default ON; a generated trip can
 * set any to `false` to hide it. Data-driven features additionally require their
 * data (e.g. the wildlife tracker only shows when `wildlife` is non-empty), so
 * the default-on flags are safe for trips that simply omit the data.
 */
export const featureFlags = z
  .object({
    countdown: z.boolean().default(true),
    packingChecklist: z.boolean().default(true),
    wildlifeTracker: z.boolean().default(true),
    journal: z.boolean().default(true),
    expenses: z.boolean().default(true),
    currencyConverter: z.boolean().default(true),
    emergency: z.boolean().default(true),
    documents: z.boolean().default(true),
  })
  .default({});

// ---------------------------------------------------------------------------
// Trip (root)
// ---------------------------------------------------------------------------

export const tripSchema = z
  .object({
    schemaVersion: z.literal(2),
    id: z.string().min(1),
    title: z.string().min(1),
    subtitle: z.string().optional(),
    summary: z.string().optional(),
    startDate: isoDate,
    endDate: isoDate,
    destinationTimezone: z.string().min(1),
    phraseLang: z.string().min(2),
    heroImage: imageRef.optional(),

    agency: agency.optional(),
    days: z.array(day).min(1),
    places: z.array(place).default([]),
    accommodations: z.array(accommodation).default([]),
    journeys: z.array(journey).default([]),
    insurance: insurance.optional(),
    phrases: z.array(phraseGroup).default([]),
    practical: practical.optional(),
    features: featureFlags,
    wildlife: z.array(wildlifeSpecies).default([]),
    inclusions: z.array(z.string()).default([]),
    exclusions: z.array(z.string()).default([]),
  })
  .superRefine((trip, ctx) => {
    const placeIds = new Set(trip.places.map((p) => p.id));
    const accomIds = new Set(trip.accommodations.map((a) => a.id));
    const seenIndexes = new Set<number>();

    if (Date.parse(trip.startDate) > Date.parse(trip.endDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endDate'],
        message: 'endDate no puede ser anterior a startDate',
      });
    }

    trip.days.forEach((d, i) => {
      if (seenIndexes.has(d.index)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['days', i, 'index'],
          message: `Día con índice duplicado: ${d.index}`,
        });
      }
      seenIndexes.add(d.index);

      if (d.lastIndex !== undefined && d.lastIndex < d.index) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['days', i, 'lastIndex'],
          message: 'lastIndex no puede ser menor que index',
        });
      }
      if (d.accommodationId && !accomIds.has(d.accommodationId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['days', i, 'accommodationId'],
          message: `accommodationId desconocido: ${d.accommodationId}`,
        });
      }
      const checkPlace = (pid: string | undefined, path: (string | number)[]) => {
        if (pid && !placeIds.has(pid)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path,
            message: `placeId desconocido: ${pid}`,
          });
        }
      };
      d.activities.forEach((a, j) => checkPlace(a.placeId, ['days', i, 'activities', j, 'placeId']));
      d.extras.forEach((e, j) => checkPlace(e.placeId, ['days', i, 'extras', j, 'placeId']));
    });
  });

// ---------------------------------------------------------------------------
// Inferred types
// ---------------------------------------------------------------------------

/** Consumption type (after parsing): all defaulted fields are present. */
export type Trip = z.infer<typeof tripSchema>;
/** Authoring type (before parsing): defaulted fields may be omitted. */
export type TripInput = z.input<typeof tripSchema>;
export type Day = z.infer<typeof day>;
export type Activity = z.infer<typeof activity>;
export type Extra = z.infer<typeof extra>;
export type Place = z.infer<typeof place>;
export type PlaceCategory = z.infer<typeof placeCategory>;
export type Accommodation = z.infer<typeof accommodation>;
export type Journey = z.infer<typeof journey>;
export type FlightLeg = z.infer<typeof flightLeg>;
export type Insurance = z.infer<typeof insurance>;
export type Contact = z.infer<typeof contact>;
export type PhraseGroup = z.infer<typeof phraseGroup>;
export type Phrase = z.infer<typeof phrase>;
export type Practical = z.infer<typeof practical>;
export type Exchange = z.infer<typeof exchange>;
export type WeatherRow = z.infer<typeof weatherRow>;
export type Agency = z.infer<typeof agency>;
export type Tag = z.infer<typeof tag>;
export type TagKind = z.infer<typeof tagKind>;
export type HelpLink = z.infer<typeof helpLink>;
export type WildlifeSpecies = z.infer<typeof wildlifeSpecies>;
export type FeatureFlags = z.infer<typeof featureFlags>;
