import { useState } from 'react';
import type { Activity, Trip } from '@/data/schema';
import { getPlace } from '@/data/selectors';
import { HeroImage } from './HeroImage';
import { Modal } from './Modal';
import { MapsButton } from './MapsButton';
import { InfoIcon } from './icons';
import { cn } from '@/lib/cn';

const TYPE_LABEL: Record<Activity['type'], string> = {
  sightseeing: 'Visita',
  food: 'Comida',
  shop: 'Tienda',
  transport: 'Traslado',
  experience: 'Experiencia',
  temple: 'Templo',
  viewpoint: 'Mirador',
  free: 'Libre',
};

export function ActivityCard({ activity, trip }: { activity: Activity; trip: Trip }) {
  const [open, setOpen] = useState(false);
  const place = getPlace(trip, activity.placeId);
  const image = activity.image ?? place?.image;
  const mapsQuery = activity.mapsQuery ?? place?.mapsQuery;
  const info = activity.info ?? place?.info;
  const hasMedia = Boolean(image);

  return (
    <article className={cn('card overflow-hidden', !hasMedia && 'p-4')}>
      {hasMedia && (
        <HeroImage src={image} alt={activity.name} seed={activity.id} className="aspect-[16/9]" />
      )}
      <div className={cn(hasMedia && 'p-4')}>
        <div className="mb-1 flex flex-wrap items-center gap-2 text-sm text-ink-500">
          <span className="pill bg-slate-100 text-ink-700">{TYPE_LABEL[activity.type]}</span>
          {activity.durationLabel && <span>· {activity.durationLabel}</span>}
          {activity.startTime && <span>· {activity.startTime}</span>}
        </div>
        <h3 className="text-lg font-bold leading-tight text-ink-900">{activity.name}</h3>
        {activity.description && <p className="mt-1 text-ink-700">{activity.description}</p>}

        {(info || mapsQuery) && (
          <div className="mt-3 flex gap-2">
            {info && (
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="tap inline-flex items-center gap-1.5 rounded-pill bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition active:scale-95"
              >
                <InfoIcon width={18} height={18} /> Info
              </button>
            )}
            {mapsQuery && <MapsButton query={mapsQuery} />}
          </div>
        )}
      </div>

      {info && (
        <Modal open={open} onClose={() => setOpen(false)} title={activity.name}>
          <p className="whitespace-pre-line leading-relaxed">{info}</p>
          {mapsQuery && (
            <div className="mt-4">
              <MapsButton query={mapsQuery} label="Abrir en Google Maps" />
            </div>
          )}
        </Modal>
      )}
    </article>
  );
}
