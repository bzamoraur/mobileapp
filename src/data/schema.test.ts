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
});
