import { useState } from 'react';
import type { Place } from '@/data/schema';
import { HeroImage } from './HeroImage';
import { Modal } from './Modal';
import { MapsButton } from './MapsButton';
import { InfoIcon } from './icons';

export function PlaceCard({ place }: { place: Place }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="card flex items-stretch gap-3 overflow-hidden p-3">
      <HeroImage
        src={place.image}
        alt={place.name}
        seed={place.id}
        className="h-24 w-24 shrink-0 rounded-2xl"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="font-bold leading-tight text-ink-900">{place.name}</h3>
        <p className="text-sm text-ink-500">{place.area}</p>
        {place.info && <p className="mt-1 line-clamp-2 text-sm text-ink-700">{place.info}</p>}
        <div className="mt-auto flex gap-2 pt-2">
          {place.info && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="tap inline-flex items-center gap-1.5 rounded-pill bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white active:scale-95"
            >
              <InfoIcon width={16} height={16} /> Info
            </button>
          )}
          <MapsButton query={place.mapsQuery} />
        </div>
      </div>

      {place.info && (
        <Modal open={open} onClose={() => setOpen(false)} title={place.name}>
          {place.address && <p className="mb-2 text-sm text-ink-500">{place.address}</p>}
          <p className="whitespace-pre-line leading-relaxed">{place.info}</p>
          <div className="mt-4">
            <MapsButton query={place.mapsQuery} label="Abrir en Google Maps" />
          </div>
        </Modal>
      )}
    </article>
  );
}
