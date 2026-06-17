import { todayInTimezone } from '@/lib/dates';
import type { Trip, Day, Accommodation, Place } from './schema';

/** The trip day matching "today" in the destination timezone, if any. */
export function getCurrentDay(trip: Trip, now: Date = new Date()): Day | undefined {
  const today = todayInTimezone(trip.destinationTimezone, now);
  return trip.days.find((d) => d.date === today);
}

/** Index of today's day in the sorted days array, or -1. */
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

/** Days sorted by their index (defensive — input order shouldn't matter). */
export function sortedDays(trip: Trip): Day[] {
  return [...trip.days].sort((a, b) => a.index - b.index);
}

/** The day immediately after the given one, if present. */
export function nextDay(trip: Trip, index: number): Day | undefined {
  return getDayByIndex(trip, index + 1);
}
