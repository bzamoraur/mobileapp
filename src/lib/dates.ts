/**
 * Date helpers. The app's notion of "today" is the calendar date in the
 * destination timezone, so "Hoy" highlights the right day even while the
 * traveller is mid-flight across timezones.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

/** Returns the YYYY-MM-DD date in a given IANA timezone for `now`. */
export function todayInTimezone(timezone: string, now: Date = new Date()): string {
  // en-CA gives an ISO-like YYYY-MM-DD formatting.
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return fmt.format(now);
}

/** Parses a YYYY-MM-DD string into a UTC-anchored Date (no TZ drift). */
export function parseISODate(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}

/** Whole-day difference (b - a), both YYYY-MM-DD. */
export function daysBetween(a: string, b: string): number {
  return Math.round((parseISODate(b).getTime() - parseISODate(a).getTime()) / DAY_MS);
}

/** Adds `n` days to a YYYY-MM-DD string, returning YYYY-MM-DD. */
export function addDays(iso: string, n: number): string {
  const d = new Date(parseISODate(iso).getTime() + n * DAY_MS);
  return d.toISOString().slice(0, 10);
}

const LONG = new Intl.DateTimeFormat('es-ES', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
});

const SHORT = new Intl.DateTimeFormat('es-ES', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
});

/** "domingo 14 de junio" (some ICU builds add a comma after the weekday). */
export function formatLongDate(iso: string): string {
  return LONG.format(parseISODate(iso)).replace(',', '');
}

/** "14 de junio" */
export function formatDayMonth(iso: string): string {
  const d = parseISODate(iso);
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(d);
}

/** "13 — 28 de junio de 2026" style range. */
export function formatDateRange(startIso: string, endIso: string): string {
  const s = parseISODate(startIso);
  const e = parseISODate(endIso);
  const sameMonth = s.getUTCMonth() === e.getUTCMonth() && s.getUTCFullYear() === e.getUTCFullYear();
  const month = new Intl.DateTimeFormat('es-ES', { month: 'long', timeZone: 'UTC' }).format(e);
  const year = e.getUTCFullYear();
  if (sameMonth) {
    return `${s.getUTCDate()} — ${e.getUTCDate()} de ${month} de ${year}`;
  }
  return `${formatDayMonth(startIso)} — ${formatDayMonth(endIso)} de ${year}`;
}

/** Capitalises the first letter (Spanish weekday strings are lowercase). */
export function capitalize(s: string): string {
  return s.length ? s[0]!.toUpperCase() + s.slice(1) : s;
}

export { SHORT };
