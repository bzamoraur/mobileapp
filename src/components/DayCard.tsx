import { Link } from 'react-router-dom';
import type { Day } from '@/data/schema';
import { HeroImage } from './HeroImage';
import { TagRow } from './Tag';
import { ChevronRightIcon } from './icons';
import { capitalize, formatLongDate } from '@/lib/dates';
import { cn } from '@/lib/cn';

export function DayCard({ day, isToday = false }: { day: Day; isToday?: boolean }) {
  return (
    <article className="card overflow-hidden">
      <HeroImage
        src={day.image}
        alt={day.title}
        seed={`day-${day.index}`}
        className="aspect-[16/9]"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-ink-900/10 to-transparent" />
        <span className="absolute left-3 top-3 rounded-pill bg-ink-900/70 px-3 py-1 text-xs font-semibold text-white">
          Día {day.index}
        </span>
        {isToday && (
          <span className="absolute right-3 top-3 rounded-pill bg-brand-600 px-3 py-1 text-xs font-bold text-white">
            HOY
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <p className="text-sm/5 text-white/80">{capitalize(formatLongDate(day.date))}</p>
          <h3 className="mt-0.5 text-lg font-bold leading-tight">{day.title}</h3>
        </div>
      </HeroImage>

      <div className="space-y-3 p-4">
        <TagRow tags={day.tags} />
        <p className="text-ink-700">{day.summary}</p>
        <Link
          to={`/dias/${day.index}`}
          className={cn(
            'tap inline-flex items-center gap-1 font-semibold',
            isToday ? 'text-brand-600' : 'text-ink-500',
          )}
        >
          Ver día completo
          <ChevronRightIcon width={18} height={18} />
        </Link>
      </div>
    </article>
  );
}
