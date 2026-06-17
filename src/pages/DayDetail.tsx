import { Navigate, useParams } from 'react-router-dom';
import { trip } from '@/data';
import { getAccommodation, getDayByIndex, dayLabel } from '@/data/selectors';
import { HeroImage } from '@/components/HeroImage';
import { TagRow } from '@/components/Tag';
import { ActivityCard } from '@/components/ActivityCard';
import { ExtrasList } from '@/components/ExtrasList';
import { MapsButton } from '@/components/MapsButton';
import { PageHeader } from '@/components/PageHeader';
import { DayNotes } from '@/components/DayNotes';
import { BedIcon, BinocularsIcon, InfoIcon } from '@/components/icons';
import { capitalize, formatDayMonth, formatLongDate } from '@/lib/dates';

export function DayDetail() {
  const { index } = useParams();
  const dayIndex = Number(index);
  const day = Number.isFinite(dayIndex) ? getDayByIndex(trip, dayIndex) : undefined;

  if (!day) return <Navigate to="/dias" replace />;

  const accommodation = getAccommodation(trip, day.accommodationId);
  const dateText =
    day.endDate && day.endDate !== day.date
      ? `${capitalize(formatDayMonth(day.date))} – ${formatDayMonth(day.endDate)}`
      : capitalize(formatLongDate(day.date));

  return (
    <div>
      <PageHeader title={dayLabel(day)} back />

      <div className="space-y-6 p-5 pt-2">
        <HeroImage
          src={day.image}
          alt={day.title}
          seed={`day-${day.index}`}
          className="aspect-[16/10] rounded-card"
        >
          <div className="scrim" />
          <div className="absolute inset-x-0 bottom-0 p-4 text-white">
            {day.area && <p className="eyebrow text-white/75">{day.area}</p>}
            <h2 className="font-display text-3xl font-semibold leading-tight tracking-tightish">
              {day.title}
            </h2>
            <p className="mt-0.5 text-sm text-white/80">{dateText}</p>
          </div>
        </HeroImage>

        <TagRow tags={day.tags} />

        {day.description && <p className="leading-relaxed text-ink-700">{day.description}</p>}

        {day.transitNotes && (
          <section className="card flex gap-3 p-4">
            <InfoIcon width={20} height={20} className="mt-0.5 shrink-0 text-brand-600" />
            <div>
              <p className="font-semibold text-ink-900">Cómo empezar</p>
              <p className="text-ink-700">{day.transitNotes}</p>
            </div>
          </section>
        )}

        {day.activities.length > 0 && (
          <section className="space-y-3">
            <h3 className="flex items-center gap-2 text-lg font-bold text-ink-900">
              <BinocularsIcon width={20} height={20} className="text-brand-600" />
              El plan del día
            </h3>
            {day.activities.map((a) => (
              <ActivityCard key={a.id} activity={a} trip={trip} />
            ))}
          </section>
        )}

        <ExtrasList extras={day.extras} trip={trip} />

        {day.mealsIncluded.length > 0 && (
          <section className="card p-4">
            <h3 className="font-bold text-ink-900">Comidas incluidas</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {day.mealsIncluded.map((m, i) => (
                <span key={i} className="pill bg-amber-100/70 text-amber-800">
                  {m}
                </span>
              ))}
            </div>
          </section>
        )}

        {accommodation && (
          <section className="card flex items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="eyebrow flex items-center gap-1.5">
                <BedIcon width={15} height={15} /> Dormís en
              </p>
              <p className="mt-1 truncate text-lg font-bold text-ink-900">{accommodation.name}</p>
              <p className="text-ink-500">{accommodation.area}</p>
            </div>
            <MapsButton query={accommodation.mapsQuery} />
          </section>
        )}

        {trip.features.journal && <DayNotes dayIndex={day.index} />}
      </div>
    </div>
  );
}
