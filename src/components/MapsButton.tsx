import { mapsUrl } from '@/lib/maps';
import { PinIcon } from './icons';
import { cn } from '@/lib/cn';

/** Opens a Google Maps search in a new tab/the system maps app. */
export function MapsButton({
  query,
  label = 'Maps',
  className,
}: {
  query: string;
  label?: string;
  className?: string;
}) {
  return (
    <a
      href={mapsUrl(query)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'tap inline-flex items-center justify-center gap-1.5 rounded-pill bg-ink-500/90 px-4 py-2 text-sm font-semibold text-white transition active:scale-95',
        className,
      )}
    >
      <PinIcon width={18} height={18} />
      {label}
    </a>
  );
}
