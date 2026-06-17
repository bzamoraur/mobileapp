import { useState } from 'react';
import type { Place } from '@/data/schema';
import { HeroImage } from './HeroImage';
import { Modal } from './Modal';
import { MapsButton } from './MapsButton';
import { InfoIcon } from './icons';

export function PlaceCard({ place }: { place: Place }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="card flex items-center gap-3 p-3">
      <HeroImage
        src={place.image}
        alt={place.name}
        seed={place.id}
        className="h-16 w-16 shrink-0 rounded-2xl"
      />
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-bold text-ink-900">{place.name}</h3>
        <p className="truncate text-sm text-ink-500">{place.city}</p>
        <div className="mt-2 flex gap-2">
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
