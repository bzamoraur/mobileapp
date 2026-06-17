import { Navigate, useParams } from 'react-router-dom';
import { trip } from '@/data';
import { getAccommodation, getDayByIndex } from '@/data/selectors';
import { HeroImage } from '@/components/HeroImage';
import { TagRow } from '@/components/Tag';
import { ActivityCard } from '@/components/ActivityCard';
import { MapsButton } from '@/components/MapsButton';
import { PageHeader } from '@/components/PageHeader';
import { BedIcon, InfoIcon } from '@/components/icons';
import { capitalize, formatLongDate } from '@/lib/dates';

export function DayDetail() {
  const { index } = useParams();
  const dayIndex = Number(index);
  const day = Number.isFinite(dayIndex) ? getDayByIndex(trip, dayIndex) : undefined;

  if (!day) return <Navigate to="/dias" replace />;

  const accommodation = getAccommodation(trip, day.accommodationId);

  return (
    <div>
      <PageHeader title={`Día ${day.index}`} back />

      <div className="space-y-5 p-5 pt-2">
        <HeroImage src={day.image} alt={day.title} seed={`day-${day.index}`} className="aspect-[16/9] rounded-card">
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4 text-white">
            <p className="text-sm text-white/80">{capitalize(formatLongDate(day.date))}</p>
            <h2 className="text-2xl font-bold leading-tight">{day.title}</h2>
            {day.city && <p className="mt-0.5 text-white/80">{day.city}</p>}
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
            <h3 className="text-lg font-bold text-ink-900">Actividades del día</h3>
            {day.activities.map((a) => (
              <ActivityCard key={a.id} activity={a} trip={trip} />
            ))}
          </section>
        )}

        {day.mealsIncluded.length > 0 && (
          <section className="card p-4">
            <h3 className="font-bold text-ink-900">Comidas incluidas</h3>
            <ul className="mt-1 list-inside list-disc text-ink-700">
              {day.mealsIncluded.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </section>
        )}

        {accommodation && (
          <section className="card flex items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-sm font-medium uppercase tracking-wide text-ink-500">
                <BedIcon width={16} height={16} /> Dormís en
              </p>
              <p className="mt-1 truncate text-lg font-bold text-ink-900">{accommodation.name}</p>
              <p className="text-ink-500">{accommodation.city}</p>
            </div>
            <MapsButton query={accommodation.mapsQuery} />
          </section>
        )}
      </div>
    </div>
  );
}
