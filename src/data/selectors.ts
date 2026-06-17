import { todayInTimezone } from '@/lib/dates';
import type { Trip, Day, Accommodation, Place } from './schema';

/** Whether a calendar date falls within a day's span (single or multi-day). */
export function dayCoversDate(d: Day, date: string): boolean {
  const end = d.endDate ?? d.date;
  return date >= d.date && date <= end;
}

/** The trip day matching "today" in the destination timezone, if any. */
export function getCurrentDay(trip: Trip, now: Date = new Date()): Day | undefined {
  const today = todayInTimezone(trip.destinationTimezone, now);
  return trip.days.find((d) => dayCoversDate(d, today));
}

export function getCurrentDayDate(trip: Trip, now: Date = new Date()): string {
  return todayInTimezone(trip.destinationTimezone, now);
}

export function getDayByIndex(trip: Trip, index: number): Day | undefined {
  return trip.days.find((d) => d.index === index);
}

export function getAccommodation(trip: Trip, id: string | undefined): Accommodation | undefined {
  if (!id) return undefined;
  return trip.accommodations.find((a) => a.id === id);
}

export function getPlace(trip: Trip, id: string | undefined): Place | undefined {
  if (!id) return undefined;
  return trip.places.find((p) => p.id === id);
}

export function sortedDays(trip: Trip): Day[] {
  return [...trip.days].sort((a, b) => a.index - b.index);
}

/** The next itinerary day after the given one (handles multi-day spans). */
export function nextDay(trip: Trip, day: Day): Day | undefined {
  const after = day.lastIndex ?? day.index;
  return sortedDays(trip).find((d) => d.index > after);
}

/** Display label for a day: "Día 5" or "Días 9–12". */
export function dayLabel(d: Day): string {
  return d.lastIndex && d.lastIndex !== d.index
    ? `Días ${d.index}–${d.lastIndex}`
    : `Día ${d.index}`;
}
