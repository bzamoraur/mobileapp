import { trip } from '@/data';
import type { Flight } from '@/data/schema';
import { PageHeader } from '@/components/PageHeader';
import { CopyField } from '@/components/CopyField';
import { PlaneIcon } from '@/components/icons';

function FlightCard({ flight }: { flight: Flight }) {
  const dirLabel = flight.direction === 'outbound' ? 'Vuelo de ida' : 'Vuelo de vuelta';
  return (
    <article className="card overflow-hidden">
      <div className="flex items-center gap-2 bg-ink-700 px-4 py-3 text-white">
        <PlaneIcon width={18} height={18} />
        <div>
          <p className="text-xs uppercase tracking-wide text-white/70">{dirLabel}</p>
          <p className="font-bold">
            {flight.from.city} → {flight.to.city}
          </p>
          <p className="text-sm text-white/80">
            {flight.airline} · {flight.flightNumber}
          </p>
        </div>
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-2xl font-bold text-ink-900">{flight.departLocal}</p>
          <span className="text-ink-400">→</span>
          <p className="whitespace-nowrap text-right text-2xl font-bold text-ink-900">
            {flight.arriveLocal}
            {flight.arrivalDayOffset > 0 && (
              <span className="text-sm font-semibold text-ink-500"> +{flight.arrivalDayOffset}d</span>
            )}
          </p>
        </div>
        <div className="flex items-start justify-between gap-3 text-sm text-ink-500">
          <p className="max-w-[45%]">
            {flight.from.name} ({flight.from.code})
          </p>
          <p className="max-w-[45%] text-right">
            {flight.to.name} ({flight.to.code})
          </p>
        </div>
        {(flight.durationLabel || flight.baggage) && (
          <p className="text-sm text-ink-500">
            {[flight.durationLabel && `Duración: ${flight.durationLabel}`, flight.baggage]
              .filter(Boolean)
              .join(' · ')}
          </p>
        )}
        <CopyField label="Número de vuelo" value={flight.flightNumber} />
      </div>
    </article>
  );
}

export function Flights() {
  return (
    <div>
      <PageHeader title="Vuelos" back />
      <div className="space-y-4 p-5 pt-2">
        {trip.flights.map((f) => (
          <FlightCard key={f.id} flight={f} />
        ))}
      </div>
    </div>
  );
}
