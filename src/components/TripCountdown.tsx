import { trip } from '@/data';
import { getCurrentDay } from '@/data/selectors';
import { daysBetween, todayInTimezone } from '@/lib/dates';
import { SparkleIcon } from './icons';

/**
 * Pre-trip countdown banner for the Home screen. Renders only before the trip
 * starts (and only if the `countdown` feature is on). Once a day covers "today",
 * the trip is under way and the Home "Hoy" section takes over, so this hides.
 */
export function TripCountdown() {
  if (!trip.features.countdown) return null;
  if (getCurrentDay(trip)) return null; // trip already under way

  const today = todayInTimezone(trip.destinationTimezone);
  const days = daysBetween(today, trip.startDate);
  if (days <= 0) return null; // trip is over

  const label = days === 1 ? '¡Mañana empieza el viaje!' : `Faltan ${days} días para el viaje`;

  return (
    <section className="card flex items-center gap-4 bg-brand-50 p-4">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-pill bg-brand-600 text-white">
        <span className="font-display text-xl font-semibold leading-none">{days}</span>
      </span>
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 font-semibold text-brand-700">
          <SparkleIcon width={16} height={16} /> {label}
        </p>
        <p className="text-sm text-ink-500">Prepara la mochila y repasa lo que falta.</p>
      </div>
    </section>
  );
}
