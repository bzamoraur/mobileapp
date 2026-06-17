import { Link } from 'react-router-dom';
import { trip } from '@/data';
import { getCurrentDay, getAccommodation, nextDay, sortedDays } from '@/data/selectors';
import { formatDateRange, formatLongDate, todayInTimezone } from '@/lib/dates';
import { HeroImage } from '@/components/HeroImage';
import { DayCard } from '@/components/DayCard';
import { MapsButton } from '@/components/MapsButton';
import { BedIcon, PlaneIcon, ShieldIcon, PinIcon, ChevronRightIcon } from '@/components/icons';
import type { ComponentType, SVGProps } from 'react';

function QuickLink({
  to,
  label,
  Icon,
}: {
  to: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}) {
  return (
    <Link to={to} className="card tap flex flex-col items-center gap-2 px-3 py-5 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-pill bg-brand-50 text-brand-600">
        <Icon width={24} height={24} />
      </span>
      <span className="font-semibold text-ink-900">{label}</span>
    </Link>
  );
}

export function Home() {
  const today = todayInTimezone(trip.destinationTimezone);
  const current = getCurrentDay(trip);
  // Before the trip starts, feature the first day; during, feature today.
  const featured = current ?? sortedDays(trip)[0]!;
  const tonight = getAccommodation(trip, featured.accommodationId);
  const tomorrow = nextDay(trip, featured.index);

  return (
    <div>
      {/* Hero */}
      <HeroImage
        src={trip.heroImage}
        alt={trip.title}
        seed={trip.id}
        className="aspect-[5/3] rounded-b-card"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 to-ink-900/10" />
        <div className="absolute inset-x-0 bottom-0 p-5 pt-[env(safe-area-inset-top)] text-white">
          <h1 className="font-display text-4xl font-bold drop-shadow">{trip.title}</h1>
          <p className="mt-1 text-white/90">{formatDateRange(trip.startDate, trip.endDate)}</p>
        </div>
      </HeroImage>

      <div className="space-y-5 p-5">
        <section>
          <p className="mb-2 flex items-center gap-2 font-semibold text-brand-600">
            <PinIcon width={18} height={18} />
            {current ? `Hoy, ${formatLongDate(today)}` : 'Tu primer día'}
          </p>
          <DayCard day={featured} isToday={Boolean(current)} />
        </section>

        {tonight && (
          <section className="card flex items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-sm font-medium uppercase tracking-wide text-ink-500">
                <BedIcon width={16} height={16} /> Esta noche dormís en
              </p>
              <p className="mt-1 truncate text-lg font-bold text-ink-900">{tonight.name}</p>
              <p className="text-ink-500">{tonight.city}</p>
            </div>
            <MapsButton query={tonight.mapsQuery} />
          </section>
        )}

        {tomorrow && (
          <Link to={`/dias/${tomorrow.index}`} className="card tap flex items-center gap-2 p-4">
            <p className="flex-1 text-ink-700">
              <span className="font-semibold text-ink-900">Mañana:</span> {tomorrow.title}
            </p>
            <ChevronRightIcon width={20} height={20} className="text-ink-400" />
          </Link>
        )}

        <section>
          <div className="grid grid-cols-2 gap-3">
            {trip.flights.length > 0 && <QuickLink to="/vuelos" label="Vuelos" Icon={PlaneIcon} />}
            {trip.insurance && <QuickLink to="/seguro" label="Seguro" Icon={ShieldIcon} />}
            {trip.accommodations.length > 0 && (
              <QuickLink to="/alojamientos" label="Alojamientos" Icon={BedIcon} />
            )}
            <QuickLink to="/mapa" label="Mapa" Icon={PinIcon} />
          </div>
        </section>
      </div>
    </div>
  );
}
