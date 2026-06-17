import { z } from 'zod';

/**
 * The single source of truth for a trip.
 *
 * Everything the app renders comes from one validated object that conforms to
 * `tripSchema`. The raw travel plan you share is transformed into a `Trip` (see
 * the `import-travel-plan` skill) and validated at build time and at runtime, so
 * a malformed plan fails loudly instead of rendering a broken screen.
 */

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

/** Calendar date with no time component, e.g. "2026-06-13". */
const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Usa el formato AAAA-MM-DD')
  .refine((s) => !Number.isNaN(Date.parse(`${s}T00:00:00`)), 'Fecha inválida');

/** Local wall-clock time, e.g. "09:30". */
const localTime = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Usa el formato HH:MM');

/** A safe http(s) URL — used for external links and maps. */
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

/** A phone number kept as a string to preserve "+" and spacing. */
const phone = z.string().min(3).max(32);

// ---------------------------------------------------------------------------
// Shared building blocks
// ---------------------------------------------------------------------------

/** Tag kinds drive the colour/treatment of a chip. */
export const tagKind = z.enum([
  'transfer', // Traslado
  'freeDay', // Día libre
  'family', // Ruta de la familia
  'flight', // Vuelo
  'important', // Importante
  'mealIncluded', // Comida incluida
  'organized', // Visita organizada
  'optional', // Opcional
  'info', // generic
]);

export const tag = z.object({
  label: z.string().min(1),
  kind: tagKind,
});

/** Place categories drive the icons and grouping on the Map screen. */
export const placeCategory = z.enum([
  'temple', // Templos y santuarios
  'monument', // Monumentos y miradores
  'market', // Mercados y comida
  'food',
  'nature', // Naturaleza
  'shopping', // Compras
  'museum',
  'neighborhood', // Barrios / zonas
  'other',
]);

/** A contact a traveller might call/message (assistance, insurer, guide...). */
export const contact = z.object({
  label: z.string().min(1),
  value: z.string().min(1), // phone number, email, or free text
  channel: z.enum(['call', 'whatsapp', 'email', 'web', 'text']).default('call'),
  note: z.string().optional(),
});

// ---------------------------------------------------------------------------
// Places (Map screen) + activities reference them by id
// ---------------------------------------------------------------------------

export const place = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  city: z.string().min(1),
  category: placeCategory,
  image: imageRef.optional(),
  /** Long description shown in the "Info" modal. */
  info: z.string().optional(),
  address: z.string().optional(),
  /** Free-text query used to build a Google Maps link (e.g. "Senso-ji, Tokyo"). */
  mapsQuery: z.string().min(1),
});

// ---------------------------------------------------------------------------
// Days + activities (Itinerary)
// ---------------------------------------------------------------------------

export const activity = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  /** Drives the type chip + icon. */
  type: z
    .enum(['sightseeing', 'food', 'shop', 'transport', 'experience', 'temple', 'viewpoint', 'free'])
    .default('sightseeing'),
  startTime: localTime.optional(),
  durationLabel: z.string().optional(), // e.g. "45–60 min"
  image: imageRef.optional(),
  description: z.string().optional(),
  /** Long detail shown in the "Info" modal. */
  info: z.string().optional(),
  /** Link to a Place for the Maps button (preferred), or a raw query. */
  placeId: z.string().optional(),
  mapsQuery: z.string().optional(),
});

export const day = z.object({
  /** Sequential day index within the trip (1-based). Día N. */
  index: z.number().int().positive(),
  date: isoDate,
  title: z.string().min(1),
  city: z.string().optional(),
  image: imageRef.optional(),
  tags: z.array(tag).default([]),
  /** Short summary used on cards. */
  summary: z.string().min(1),
  /** Optional longer description for the day detail header. */
  description: z.string().optional(),
  /** "Cómo empezar" / transit notes. */
  transitNotes: z.string().optional(),
  activities: z.array(activity).default([]),
  mealsIncluded: z.array(z.string()).default([]),
  /** Where you sleep that night (Accommodation id). */
  accommodationId: z.string().optional(),
});

// ---------------------------------------------------------------------------
// Logistics: flights, accommodation, insurance, help
// ---------------------------------------------------------------------------

const airport = z.object({
  name: z.string().min(1),
  code: z.string().min(2).max(4),
  city: z.string().min(1),
});

export const flight = z.object({
  id: z.string().min(1),
  direction: z.enum(['outbound', 'return']),
  airline: z.string().min(1),
  flightNumber: z.string().min(1),
  date: isoDate,
  from: airport,
  to: airport,
  departLocal: localTime,
  arriveLocal: localTime,
  /** +1 if arrival is next day. */
  arrivalDayOffset: z.number().int().min(0).default(0),
  durationLabel: z.string().optional(), // "14:00 h"
  baggage: z.string().optional(),
  notes: z.string().optional(),
});

export const accommodation = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  city: z.string().min(1),
  address: z.string().optional(),
  phone: phone.optional(),
  image: imageRef.optional(),
  /** Human-readable nights, e.g. ["19 de junio", "20 de junio"]. */
  nights: z.array(z.string()).default([]),
  mapsQuery: z.string().min(1),
  checkIn: isoDate.optional(),
  checkOut: isoDate.optional(),
});

export const insurance = z.object({
  provider: z.string().min(1),
  bookingLocator: z.string().optional(),
  providerLocator: z.string().optional(),
  policyNumber: z.string().optional(),
  assistance: z.array(contact).default([]),
  email: z.string().email().optional(),
  notes: z.string().optional(),
});

export const phrase = z.object({
  es: z.string().min(1),
  /** Target language text (kanji/kana for Japanese). */
  target: z.string().min(1),
  /** Romanised reading, shown in parentheses. */
  romaji: z.string().optional(),
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

export const help = z.object({
  /** Document/checklist bullets (passport rules, etc.). */
  documents: z.array(z.string()).default([]),
  links: z.array(helpLink).default([]),
  reminders: z.array(z.string()).default([]),
  emergencyContacts: z.array(contact).default([]),
});

// ---------------------------------------------------------------------------
// Trip (root)
// ---------------------------------------------------------------------------

export const tripSchema = z
  .object({
    /** Schema version so future migrations are explicit. */
    schemaVersion: z.literal(1),
    id: z.string().min(1),
    title: z.string().min(1), // "Japón 2026"
    subtitle: z.string().optional(),
    startDate: isoDate,
    endDate: isoDate,
    /** IANA timezone of the destination, e.g. "Asia/Tokyo". */
    destinationTimezone: z.string().min(1),
    /** Target-language BCP-47 code for phrase TTS, e.g. "ja-JP". */
    phraseLang: z.string().min(2),
    heroImage: imageRef.optional(),

    days: z.array(day).min(1),
    places: z.array(place).default([]),
    accommodations: z.array(accommodation).default([]),
    flights: z.array(flight).default([]),
    insurance: insurance.optional(),
    phrases: z.array(phraseGroup).default([]),
    help: help.optional(),
  })
  .superRefine((trip, ctx) => {
    // Referential integrity — catch broken links at validation time.
    const placeIds = new Set(trip.places.map((p) => p.id));
    const accomIds = new Set(trip.accommodations.map((a) => a.id));
    const dayIndexes = new Set<number>();

    if (Date.parse(trip.startDate) > Date.parse(trip.endDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endDate'],
        message: 'endDate no puede ser anterior a startDate',
      });
    }

    trip.days.forEach((d, i) => {
      if (dayIndexes.has(d.index)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['days', i, 'index'],
          message: `Día con índice duplicado: ${d.index}`,
        });
      }
      dayIndexes.add(d.index);

      if (d.accommodationId && !accomIds.has(d.accommodationId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['days', i, 'accommodationId'],
          message: `accommodationId desconocido: ${d.accommodationId}`,
        });
      }
      d.activities.forEach((a, j) => {
        if (a.placeId && !placeIds.has(a.placeId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['days', i, 'activities', j, 'placeId'],
            message: `placeId desconocido: ${a.placeId}`,
          });
        }
      });
    });
  });

// ---------------------------------------------------------------------------
// Inferred types
// ---------------------------------------------------------------------------

export type Trip = z.infer<typeof tripSchema>;
export type Day = z.infer<typeof day>;
export type Activity = z.infer<typeof activity>;
export type Place = z.infer<typeof place>;
export type PlaceCategory = z.infer<typeof placeCategory>;
export type Accommodation = z.infer<typeof accommodation>;
export type Flight = z.infer<typeof flight>;
export type Insurance = z.infer<typeof insurance>;
export type Contact = z.infer<typeof contact>;
export type PhraseGroup = z.infer<typeof phraseGroup>;
export type Phrase = z.infer<typeof phrase>;
export type Help = z.infer<typeof help>;
export type Tag = z.infer<typeof tag>;
export type TagKind = z.infer<typeof tagKind>;
