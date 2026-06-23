import type { Place, Trip } from '../data/schema';

export interface ContentQaResult {
  errors: string[];
  warnings: string[];
}

/** The id written by `npm run new-trip` — a deliberately-blank placeholder trip. */
const BLANK_ID = 'nuevo-viaje';

/** Strings the blank template / scaffolding leaves behind; never in a real trip. */
const PLACEHOLDERS = [
  'nuevo-viaje',
  'Tu próximo viaje',
  'Lugar de ejemplo',
  'Actividad de ejemplo',
  'Edita src/data/trip.ts',
  'STALE-MARKER',
];

/** Hosts that signal an un-filled link rather than a real one. */
const BAD_HOST = /(?:example\.(?:com|org|net)|localhost|your-domain|changeme|xxxx)/i;

const asDay = (s: string): number => Date.parse(`${s}T00:00:00`);

type Located = Place & { lat: number; lng: number };
const isLocated = (p: Place): p is Located =>
  typeof p.lat === 'number' && typeof p.lng === 'number';

/** Great-circle distance in km (haversine). */
const km = (aLat: number, aLng: number, bLat: number, bLng: number): number => {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

/**
 * Heuristic content checks that complement schema validation (`validate:trip`).
 * Validation proves the data parses and references resolve; this catches
 * mistakes a generator/import can make that still parse: leftover placeholder
 * text, day dates outside the trip range, null-island / outlier coordinates, and
 * broken or placeholder links. `errors` should fail a gate; `warnings` advise.
 */
export function contentQa(trip: Trip): ContentQaResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const isBlank = trip.id === BLANK_ID;

  // 1) Placeholder sentinels — a real (non-blank) trip should contain none.
  if (!isBlank) {
    const blob = JSON.stringify(trip);
    for (const p of PLACEHOLDERS) {
      if (blob.includes(p)) errors.push(`Placeholder text left in content: "${p}"`);
    }
  }

  // 2) Day dates inside [startDate, endDate]; chronological by index.
  const start = asDay(trip.startDate);
  const end = asDay(trip.endDate);
  let prev = -Infinity;
  for (const d of [...trip.days].sort((a, b) => a.index - b.index)) {
    const t = asDay(d.date);
    if (t < start || t > end) {
      errors.push(
        `Day ${d.index} (${d.date}) is outside the trip range ${trip.startDate}…${trip.endDate}`,
      );
    }
    if (d.endDate !== undefined && asDay(d.endDate) < t) {
      errors.push(`Day ${d.index} endDate ${d.endDate} precedes its date ${d.date}`);
    }
    if (t < prev) {
      warnings.push(`Day ${d.index} (${d.date}) is earlier than the previous day — check ordering`);
    }
    prev = t;
  }

  // 3) Coordinates: no null island; flag per-region outliers (lenient).
  const located = trip.places.filter(isLocated);
  for (const p of located) {
    if (p.lat === 0 && p.lng === 0) {
      errors.push(`Place "${p.name}" sits at (0,0) — almost certainly wrong coordinates`);
    }
  }
  const byRegion = new Map<string, Located[]>();
  for (const p of located) {
    byRegion.set(p.region, [...(byRegion.get(p.region) ?? []), p]);
  }
  for (const [region, ps] of byRegion) {
    if (ps.length < 3) continue; // too few to define a cluster
    const cLat = ps.reduce((s, p) => s + p.lat, 0) / ps.length;
    const cLng = ps.reduce((s, p) => s + p.lng, 0) / ps.length;
    for (const p of ps) {
      const dist = km(cLat, cLng, p.lat, p.lng);
      if (dist > 700) {
        warnings.push(
          `Place "${p.name}" is ${Math.round(dist)} km from the "${region}" cluster — possible wrong/swapped coordinates`,
        );
      }
    }
  }

  // 4) Link sanity (static; reachability is a separate, network-gated check).
  const links: { where: string; url: string }[] = [];
  for (const j of trip.journeys) {
    if (j.checkInUrl) links.push({ where: `journey ${j.id} checkInUrl`, url: j.checkInUrl });
  }
  for (const a of trip.accommodations) {
    if (a.website) links.push({ where: `accommodation ${a.id} website`, url: a.website });
  }
  const visa = trip.practical?.visa;
  if (visa) links.push({ where: 'practical.visa', url: visa.url });
  trip.practical?.links.forEach((l, i) => {
    links.push({ where: `practical.links[${i}]`, url: l.url });
  });
  for (const { where, url } of links) {
    if (!/^https?:\/\//i.test(url)) errors.push(`Link (${where}) is not http(s): ${url}`);
    else if (BAD_HOST.test(url)) errors.push(`Link (${where}) looks like a placeholder URL: ${url}`);
    else if (/^http:\/\//i.test(url)) warnings.push(`Link (${where}) uses http (prefer https): ${url}`);
  }

  // 5) Soft presence checks.
  if (trip.places.length === 0) warnings.push('No places — the Map screen will be empty.');
  if (trip.phrases.length === 0) warnings.push('No phrases — the Phrasebook will be empty.');

  return { errors, warnings };
}
