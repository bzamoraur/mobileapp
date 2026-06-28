import { describe, expect, it } from 'vitest';
import { tripSchema } from './schema';
import { sampleTrip } from './trip.sample';
import { trip as realTrip } from './trip';

// Parse once to a fully-defaulted object we can safely mutate in tests.
const base = tripSchema.parse(sampleTrip);

describe('tripSchema', () => {
  it('accepts the sample trip', () => {
    expect(tripSchema.safeParse(sampleTrip).success).toBe(true);
  });

  it('accepts the real trip', () => {
    const res = tripSchema.safeParse(realTrip);
    if (!res.success) console.error(res.error.issues);
    expect(res.success).toBe(true);
  });

  it('rejects an unknown accommodationId reference', () => {
    const bad = structuredClone(base);
    bad.days[1]!.accommodationId = 'does-not-exist';
    const res = tripSchema.safeParse(bad);
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues.some((i) => i.message.includes('accommodationId'))).toBe(true);
    }
  });

  it('rejects an unknown activity placeId reference', () => {
    const bad = structuredClone(base);
    bad.days[1]!.activities[0]!.placeId = 'nope';
    expect(tripSchema.safeParse(bad).success).toBe(false);
  });

  it('rejects an end date before the start date', () => {
    const bad = structuredClone(base);
    bad.endDate = '2026-08-01';
    expect(tripSchema.safeParse(bad).success).toBe(false);
  });

  it('rejects a malformed date', () => {
    const bad = structuredClone(base);
    bad.startDate = '17-08-2026';
    expect(tripSchema.safeParse(bad).success).toBe(false);
  });

  it('defaults feature flags to on when omitted', () => {
    expect(base.features.countdown).toBe(true);
    expect(base.features.packingChecklist).toBe(true);
    expect(base.features.wildlifeTracker).toBe(true);
    expect(base.features.journal).toBe(true);
    expect(base.features.expenses).toBe(true);
    expect(base.features.currencyConverter).toBe(true);
    expect(base.features.emergency).toBe(true);
    expect(base.features.documents).toBe(true);
  });

  it('defaults wildlife to an empty list when omitted', () => {
    expect(base.wildlife).toEqual([]);
  });

  it('parses wildlife species, defaulting big5 to false', () => {
    const res = tripSchema.safeParse({
      ...sampleTrip,
      wildlife: [
        { id: 'lion', name: 'León', nameLocal: 'Simba', big5: true },
        { id: 'zebra', name: 'Cebra' },
      ],
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.wildlife[0]!.big5).toBe(true);
      expect(res.data.wildlife[1]!.big5).toBe(false);
    }
  });

  it('defaults collections to an empty list when omitted', () => {
    expect(base.collections).toEqual([]);
  });

  it('parses a collection, defaulting item.highlight to false and icon to "star"', () => {
    const res = tripSchema.safeParse({
      ...sampleTrip,
      collections: [
        {
          id: 'monumentos',
          title: 'Monumentos',
          items: [
            { id: 'm1', name: 'Catedral', highlight: true },
            { id: 'm2', name: 'Plaza' },
          ],
        },
      ],
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.collections[0]!.icon).toBe('star');
      expect(res.data.collections[0]!.items[0]!.highlight).toBe(true);
      expect(res.data.collections[0]!.items[1]!.highlight).toBe(false);
    }
  });

  it('rejects a collection item with an unknown placeId', () => {
    const res = tripSchema.safeParse({
      ...sampleTrip,
      collections: [{ id: 'c', title: 'C', items: [{ id: 'i', name: 'X', placeId: 'nope' }] }],
    });
    expect(res.success).toBe(false);
  });

  it('rejects duplicate collection ids', () => {
    const res = tripSchema.safeParse({
      ...sampleTrip,
      collections: [
        { id: 'dup', title: 'A', items: [{ id: 'a', name: 'A' }] },
        { id: 'dup', title: 'B', items: [{ id: 'b', name: 'B' }] },
      ],
    });
    expect(res.success).toBe(false);
  });
});
