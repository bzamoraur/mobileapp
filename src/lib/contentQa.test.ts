import { describe, it, expect } from 'vitest';
import { tripSchema, type Trip } from '../data/schema';
import { sampleTrip } from '../data/trip.sample';
import { contentQa } from './contentQa';

/** A fresh, schema-valid Trip to mutate per case (so cases don't bleed). */
const base = (): Trip => tripSchema.parse(sampleTrip);

describe('contentQa', () => {
  it('passes a clean trip with no errors', () => {
    expect(contentQa(base()).errors).toEqual([]);
  });

  it('flags leftover placeholder text in a real trip', () => {
    const t = base();
    t.places[0]!.name = 'Lugar de ejemplo';
    expect(contentQa(t).errors.join(' ')).toMatch(/Placeholder/);
  });

  it('does NOT flag placeholders in the blank template', () => {
    const t = base();
    t.id = 'nuevo-viaje';
    t.places[0]!.name = 'Lugar de ejemplo';
    expect(contentQa(t).errors).toEqual([]);
  });

  it('flags a day date outside the trip range', () => {
    const t = base();
    t.days[0]!.date = '2030-01-01';
    expect(contentQa(t).errors.join(' ')).toMatch(/outside the trip range/);
  });

  it('flags null-island coordinates', () => {
    const t = base();
    t.places[0]!.lat = 0;
    t.places[0]!.lng = 0;
    expect(contentQa(t).errors.join(' ')).toMatch(/\(0,0\)/);
  });

  it('flags a placeholder link', () => {
    const t = base();
    t.accommodations[0]!.website = 'https://example.com/';
    expect(contentQa(t).errors.join(' ')).toMatch(/placeholder URL/);
  });
});
