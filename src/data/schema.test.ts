import { describe, expect, it } from 'vitest';
import { tripSchema } from './schema';
import { sampleTrip } from './trip.sample';

describe('tripSchema', () => {
  it('accepts the sample trip', () => {
    expect(tripSchema.safeParse(sampleTrip).success).toBe(true);
  });

  it('rejects an unknown accommodationId reference', () => {
    const bad = structuredClone(sampleTrip);
    bad.days[1]!.accommodationId = 'does-not-exist';
    const res = tripSchema.safeParse(bad);
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues.some((i) => i.message.includes('accommodationId'))).toBe(true);
    }
  });

  it('rejects an unknown activity placeId reference', () => {
    const bad = structuredClone(sampleTrip);
    bad.days[2]!.activities[0]!.placeId = 'nope';
    expect(tripSchema.safeParse(bad).success).toBe(false);
  });

  it('rejects an end date before the start date', () => {
    const bad = structuredClone(sampleTrip);
    bad.endDate = '2026-06-01';
    expect(tripSchema.safeParse(bad).success).toBe(false);
  });

  it('rejects a malformed date', () => {
    const bad = structuredClone(sampleTrip);
    bad.startDate = '13-06-2026';
    expect(tripSchema.safeParse(bad).success).toBe(false);
  });
});
