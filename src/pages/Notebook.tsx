import { Link } from 'react-router-dom';
import { trip } from '@/data';
import { sortedDays, dayLabel } from '@/data/selectors';
import { formatDayMonth } from '@/lib/dates';
import { readPersisted } from '@/lib/usePersistentState';
import { PageHeader } from '@/components/PageHeader';
import { ChevronRightIcon } from '@/components/icons';

/** The whole trip journal in one place: every day that has a note, together. */
export function Notebook() {
  const entries = sortedDays(trip)
    .map((day) => ({ day, note: readPersisted<string>(`notes:${trip.id}:${day.index}`, '') }))
    .filter((e) => e.note.trim().length > 0);

  return (
    <div>
      <PageHeader title="Cuaderno" back />
      <div className="space-y-4 p-5 pt-2">
        <p className="text-ink-500">Todas tus notas del viaje, juntas.</p>
        {entries.length === 0 ? (
          <p className="card p-5 text-center text-ink-400">
            Aún no hay notas. Abre un día y escribe en «Mis notas».
          </p>
        ) : (
          entries.map(({ day, note }) => (
            <Link
              key={day.index}
              to={`/dias/${day.index}`}
              className="card tap block p-4 transition active:scale-[0.99]"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="eyebrow text-brand-600">
                    {dayLabel(day)} · {formatDayMonth(day.date)}
                  </p>
                  <p className="truncate font-semibold text-ink-900">{day.title}</p>
                </div>
                <ChevronRightIcon width={18} height={18} className="shrink-0 text-ink-300" />
              </div>
              <p className="mt-2 whitespace-pre-wrap text-ink-700">{note}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
