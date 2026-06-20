import type { Accommodation } from '@/data/schema';
import { Modal } from './Modal';
import { HeroImage } from './HeroImage';
import { directionsUrl } from '@/lib/maps';
import { BedIcon, GlobeIcon, PhoneIcon, PinIcon } from './icons';

/**
 * Hotel detail sheet: opened by tapping the lodge on a day, or from the
 * Accommodations list. Shows room/board/nights, description, and quick actions
 * (turn-by-turn directions, website, phone).
 */
export function AccommodationDetail({
  accommodation,
  open,
  onClose,
}: {
  accommodation: Accommodation | undefined;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title={accommodation?.name ?? ''}>
      {accommodation && (
        <div>
          <p className="-mt-1 mb-3 text-ink-500">{accommodation.area}</p>
          <HeroImage
            src={accommodation.image}
            alt={accommodation.name}
            seed={accommodation.id}
            className="aspect-[16/10] w-full rounded-card"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {accommodation.nights.map((n, i) => (
              <span key={i} className="pill bg-sand-200 text-ink-700">
                <BedIcon width={14} height={14} /> {n}
              </span>
            ))}
            {accommodation.board && (
              <span className="pill bg-amber-100/70 text-amber-800">{accommodation.board}</span>
            )}
            {accommodation.roomType && (
              <span className="pill bg-brand-50 text-brand-700">{accommodation.roomType}</span>
            )}
          </div>
          {accommodation.description && (
            <p className="mt-3 leading-relaxed text-ink-700">{accommodation.description}</p>
          )}
          {accommodation.address && (
            <p className="mt-2 text-sm text-ink-500">{accommodation.address}</p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={directionsUrl(accommodation.mapsQuery)}
              target="_blank"
              rel="noopener noreferrer"
              className="tap inline-flex items-center gap-1.5 rounded-pill bg-brand-600 px-4 py-2 text-sm font-semibold text-white active:scale-95"
            >
              <PinIcon width={18} height={18} /> Cómo llegar
            </a>
            {accommodation.website && (
              <a
                href={accommodation.website}
                target="_blank"
                rel="noopener noreferrer"
                className="tap inline-flex items-center gap-1.5 rounded-pill bg-sand-200 px-4 py-2 text-sm font-semibold text-ink-700 active:scale-95"
              >
                <GlobeIcon width={18} height={18} /> Web
              </a>
            )}
            {accommodation.phone && (
              <a
                href={`tel:${accommodation.phone.replace(/\s/g, '')}`}
                className="tap inline-flex items-center gap-1.5 rounded-pill bg-emerald-500 px-4 py-2 text-sm font-semibold text-white active:scale-95"
              >
                <PhoneIcon width={18} height={18} /> Llamar
              </a>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
