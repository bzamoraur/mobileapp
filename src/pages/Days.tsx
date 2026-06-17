import { trip } from '@/data';
import { sortedDays, getCurrentDayDate } from '@/data/selectors';
import { PageHeader } from '@/components/PageHeader';
import { DayCard } from '@/components/DayCard';
import { formatDateRange } from '@/lib/dates';

export function Days() {
  const days = sortedDays(trip);
  const today = getCurrentDayDate(trip);

  return (
    <div>
      <PageHeader title="Itinerario" />
      <p className="px-5 text-ink-500">
        {days.length} días · {formatDateRange(trip.startDate, trip.endDate)}
      </p>
      <div className="space-y-4 p-5">
        {days.map((day) => (
          <DayCard key={day.index} day={day} isToday={day.date === today} />
        ))}
      </div>
    </div>
  );
}
