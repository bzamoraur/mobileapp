import type { TripInput } from './schema';

/**
 * Small, schema-v2-conformant fixture used by tests. It exercises the validation
 * rules (references, ranges) without depending on the real trip content.
 */
export const sampleTrip: TripInput = {
  schemaVersion: 2,
  id: 'sample',
  title: 'Viaje de muestra',
  startDate: '2026-08-17',
  endDate: '2026-08-20',
  destinationTimezone: 'Africa/Dar_es_Salaam',
  phraseLang: 'sw-TZ',

  accommodations: [
    {
      id: 'lodge',
      name: 'Lodge de muestra',
      area: 'Serengeti',
      nights: ['18 ago'],
      mapsQuery: 'Serengeti National Park',
    },
  ],
  places: [
    {
      id: 'serengeti',
      name: 'Serengeti',
      area: 'Serengeti',
      region: 'Safari',
      category: 'park',
      mapsQuery: 'Serengeti National Park',
    },
  ],
  days: [
    {
      index: 1,
      date: '2026-08-17',
      title: 'Salida',
      summary: 'Vuelo de salida.',
      activities: [],
      extras: [],
      tags: [{ label: 'Vuelo', kind: 'flight' }],
      gallery: [],
      mealsIncluded: [],
    },
    {
      index: 2,
      date: '2026-08-18',
      title: 'Safari',
      summary: 'Día de safari.',
      accommodationId: 'lodge',
      activities: [{ id: 'a1', name: 'Safari', type: 'safari', placeId: 'serengeti' }],
      extras: [{ name: 'Globo', description: 'Opcional', optional: true, price: '500 €' }],
      tags: [{ label: 'Safari', kind: 'safari' }],
      gallery: [],
      mealsIncluded: ['Desayuno', 'Comida', 'Cena'],
    },
  ],
  phrases: [
    {
      id: 'saludos',
      title: 'Saludos',
      phrases: [{ es: 'Hola', target: 'Jambo', pron: 'YAM-bo' }],
    },
  ],
};
