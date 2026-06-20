import { trip } from '@/data';
import type { Journey } from '@/data/schema';
import { PageHeader } from '@/components/PageHeader';
import { CopyField } from '@/components/CopyField';
import { PlaneIcon, GlobeIcon } from '@/components/icons';
import { capitalize, formatLongDate } from '@/lib/dates';

function JourneyCard({ journey }: { journey: Journey }) {
  const dirLabel =
    journey.direction === 'outbound' ? 'Ida' : journey.direction === 'return' ? 'Vuelta' : 'Vuelo';
  return (
    <article className="card overflow-hidden">
      <div className="flex items-center justify-between gap-2 bg-ink-800 px-4 py-3 text-white">
        <div className="min-w-0">
          <p className="eyebrow text-white/60">{dirLabel}</p>
          <p className="truncate font-bold">{journey.label ?? dirLabel}</p>
          <p className="text-sm text-white/70">{capitalize(formatLongDate(journey.date))}</p>
        </div>
        <PlaneIcon width={22} height={22} className="shrink-0 text-white/80" />
      </div>

      <div className="space-y-4 p-4">
        {journey.legs.map((leg, i) => (
          <div key={i}>
            {i > 0 && (
              <p className="mb-3 text-center text-xs font-medium uppercase tracking-wide text-ink-400">
                · escala en {journey.legs[i - 1]!.to.city} ·
              </p>
            )}
            <div className="flex items-center justify-between gap-2">
              <p className="text-2xl font-bold text-ink-900">{leg.departLocal}</p>
              <div className="flex-1 px-2 text-center text-xs text-ink-400">
                <p>{leg.flightNumber}</p>
                <div className="my-1 border-t border-dashed border-ink-300" />
                {leg.durationLabel && <p>{leg.durationLabel}</p>}
              </div>
              <p className="whitespace-nowrap text-right text-2xl font-bold text-ink-900">
                {leg.arriveLocal}
                {leg.arrivalDayOffset > 0 && (
                  <span className="text-sm font-semibold text-ink-500"> +{leg.arrivalDayOffset}d</span>
                )}
              </p>
            </div>
            <div className="flex items-start justify-between gap-3 text-sm text-ink-500">
              <p className="max-w-[45%]">
                {leg.from.city} · {leg.from.code}
              </p>
              <p className="max-w-[45%] text-right">
                {leg.to.city} · {leg.to.code}
              </p>
            </div>
            <p className="mt-1 text-xs text-ink-400">
              {leg.airline}
              {leg.aircraft ? ` · ${leg.aircraft}` : ''}
            </p>
          </div>
        ))}

        {journey.baggage && <p className="text-sm text-ink-500">🧳 {journey.baggage}</p>}
        <div className="flex flex-wrap gap-2">
          {journey.legs.map((leg, i) => (
            <CopyField key={i} label={`Vuelo ${leg.from.code}→${leg.to.code}`} value={leg.flightNumber} />
          ))}
        </div>

        {journey.checkInUrl && (
          <a
            href={journey.checkInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="tap inline-flex items-center justify-center gap-1.5 rounded-pill bg-brand-600 px-4 py-2 text-sm font-semibold text-white active:scale-95"
          >
            <GlobeIcon width={18} height={18} /> Check-in online
          </a>
        )}
      </div>
    </article>
  );
}

export function Flights() {
  const agency = trip.agency;
  return (
    <div>
      <PageHeader title="Vuelos" back />
      <div className="space-y-4 p-5 pt-2">
        {agency && (agency.bookingRef || agency.locator) && (
          <section className="card p-4">
            <p className="eyebrow mb-2">Tu reserva</p>
            <div className="flex flex-wrap gap-2">
              {agency.bookingRef && <CopyField label="Referencia" value={agency.bookingRef} />}
              {agency.locator && <CopyField label="Localizador" value={agency.locator} />}
            </div>
          </section>
        )}
        {trip.journeys.map((j) => (
          <JourneyCard key={j.id} journey={j} />
        ))}
        <p className="px-1 text-sm text-ink-500">
          Check-in online 48–24 h antes en ethiopianairlines.com con el localizador o el número de
          billete.
        </p>
      </div>
    </div>
  );
}
