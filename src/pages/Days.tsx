import { trip } from '@/data';
import { sortedDays, getCurrentDayDate, dayCoversDate } from '@/data/selectors';
import { PageHeader } from '@/components/PageHeader';
import { DayCard } from '@/components/DayCard';
import { formatDateRange } from '@/lib/dates';
import type { Day } from '@/data/schema';

/** Editorial chapters that group the itinerary into its two halves. */
const CHAPTERS: { title: string; subtitle: string; upTo: number }[] = [
  { title: 'El safari', subtitle: 'Tarangire · Manyara · Ngorongoro · Serengeti · Mara', upTo: 8 },
  { title: 'Zanzíbar', subtitle: 'Playas de Kendwa · Stone Town · regreso', upTo: 99 },
];

export function Days() {
  const days = sortedDays(trip);
  const today = getCurrentDayDate(trip);

  const chapters = CHAPTERS.map((c, i) => {
    const from = i === 0 ? 0 : CHAPTERS[i - 1]!.upTo;
    return { ...c, days: days.filter((d) => d.index > from && d.index <= c.upTo) };
  }).filter((c) => c.days.length > 0);

  return (
    <div>
      <PageHeader title="Itinerario" />
      <p className="px-5 text-ink-500">
        {days.length} etapas · {formatDateRange(trip.startDate, trip.endDate)}
      </p>

      <div className="space-y-7 p-5">
        {chapters.map((chapter) => (
          <section key={chapter.title}>
            <div className="mb-3">
              <h2 className="font-display text-2xl font-semibold tracking-tightish text-ink-900">
                {chapter.title}
              </h2>
              <p className="text-sm text-ink-500">{chapter.subtitle}</p>
            </div>
            <div className="space-y-4">
              {chapter.days.map((day: Day) => (
                <DayCard key={day.index} day={day} isToday={dayCoversDate(day, today)} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
