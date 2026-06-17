import { Link } from 'react-router-dom';
import { trip } from '@/data';
import { getCurrentDay, getAccommodation, nextDay, sortedDays } from '@/data/selectors';
import { formatDateRange, formatLongDate, todayInTimezone } from '@/lib/dates';
import { HeroImage } from '@/components/HeroImage';
import { DayCard } from '@/components/DayCard';
import { MapsButton } from '@/components/MapsButton';
import { TripCountdown } from '@/components/TripCountdown';
import {
  BedIcon,
  PlaneIcon,
  ShieldIcon,
  PinIcon,
  PawIcon,
  WalletIcon,
  ChevronRightIcon,
  SunsetIcon,
} from '@/components/icons';
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
    <Link
      to={to}
      className="card tap flex flex-col items-center gap-2 px-3 py-4 text-center transition active:scale-[0.98]"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-pill bg-brand-50 text-brand-600">
        <Icon width={24} height={24} />
      </span>
      <span className="text-sm font-semibold text-ink-900">{label}</span>
    </Link>
  );
}

export function Home() {
  const today = todayInTimezone(trip.destinationTimezone);
  const current = getCurrentDay(trip);
  const featured = current ?? sortedDays(trip)[0]!;
  const tonight = getAccommodation(trip, featured.accommodationId);
  const tomorrow = nextDay(trip, featured);

  return (
    <div>
      <HeroImage src={trip.heroImage} alt={trip.title} seed={trip.id} className="aspect-[4/5] rounded-b-card">
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/20 to-ink-900/10" />
        <div className="absolute inset-x-0 bottom-0 p-5 pt-10 text-white">
          {trip.agency && <p className="eyebrow text-white/70">{trip.agency.name}</p>}
          <h1 className="font-display text-[2.6rem] font-semibold leading-[1.05] tracking-tightish drop-shadow-sm">
            {trip.title}
          </h1>
          {trip.subtitle && <p className="mt-1 text-white/90">{trip.subtitle}</p>}
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-white/80">
            <SunsetIcon width={16} height={16} />
            {formatDateRange(trip.startDate, trip.endDate)}
          </p>
        </div>
      </HeroImage>

      <div className="space-y-6 p-5">
        <TripCountdown />

        {trip.summary && <p className="leading-relaxed text-ink-700">{trip.summary}</p>}

        <section>
          <p className="mb-2 flex items-center gap-2 font-semibold text-brand-600">
            <PinIcon width={18} height={18} />
            {current ? `Hoy · ${formatLongDate(today)}` : 'Tu viaje empieza así'}
          </p>
          <DayCard day={featured} isToday={Boolean(current)} />
        </section>

        {tonight && (
          <section className="card flex items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="eyebrow flex items-center gap-1.5">
                <BedIcon width={15} height={15} /> Esta noche dormís en
              </p>
              <p className="mt-1 truncate text-lg font-bold text-ink-900">{tonight.name}</p>
              <p className="text-ink-500">{tonight.area}</p>
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
          <h2 className="eyebrow mb-2">Accesos rápidos</h2>
          <div className="grid grid-cols-2 gap-3">
            {trip.journeys.length > 0 && <QuickLink to="/vuelos" label="Vuelos" Icon={PlaneIcon} />}
            {trip.accommodations.length > 0 && (
              <QuickLink to="/alojamientos" label="Alojamientos" Icon={BedIcon} />
            )}
            <QuickLink to="/mapa" label="Mapa" Icon={PinIcon} />
            {trip.features.wildlifeTracker && trip.wildlife.length > 0 && (
              <QuickLink to="/fauna" label="Fauna" Icon={PawIcon} />
            )}
            {trip.features.expenses && <QuickLink to="/gastos" label="Gastos" Icon={WalletIcon} />}
            {trip.insurance && <QuickLink to="/seguro" label="Seguro" Icon={ShieldIcon} />}
          </div>
        </section>
      </div>
    </div>
  );
}
