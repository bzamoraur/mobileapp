import { Link } from 'react-router-dom';
import type { Day } from '@/data/schema';
import { dayLabel } from '@/data/selectors';
import { HeroImage } from './HeroImage';
import { TagRow } from './Tag';
import { ChevronRightIcon } from './icons';
import { capitalize, formatDayMonth, formatLongDate } from '@/lib/dates';
import { cn } from '@/lib/cn';

function dateText(day: Day): string {
  if (day.endDate && day.endDate !== day.date) {
    return `${capitalize(formatDayMonth(day.date))} – ${formatDayMonth(day.endDate)}`;
  }
  return capitalize(formatLongDate(day.date));
}

export function DayCard({ day, isToday = false }: { day: Day; isToday?: boolean }) {
  return (
    <Link to={`/dias/${day.index}`} className="card block overflow-hidden">
      <HeroImage src={day.image} alt={day.title} seed={`day-${day.index}`} className="aspect-[3/2]">
        <div className="scrim" />
        <span className="absolute left-3 top-3 rounded-pill bg-ink-900/65 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          {dayLabel(day)}
        </span>
        {isToday && (
          <span className="absolute right-3 top-3 rounded-pill bg-brand-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
            Hoy
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          {day.area && <p className="eyebrow text-white/75">{day.area}</p>}
          <h3 className="mt-0.5 font-display text-2xl font-semibold leading-tight tracking-tightish">
            {day.title}
          </h3>
          <p className="mt-0.5 text-sm text-white/80">{dateText(day)}</p>
        </div>
      </HeroImage>

      <div className="space-y-3 p-4">
        <TagRow tags={day.tags} />
        <p className="text-ink-700">{day.summary}</p>
        <span
          className={cn(
            'inline-flex items-center gap-1 font-semibold',
            isToday ? 'text-brand-600' : 'text-ink-500',
          )}
        >
          Ver día completo
          <ChevronRightIcon width={18} height={18} />
        </span>
      </div>
    </Link>
  );
}
