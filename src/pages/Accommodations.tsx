import { trip } from '@/data';
import { PageHeader } from '@/components/PageHeader';
import { HeroImage } from '@/components/HeroImage';
import { MapsButton } from '@/components/MapsButton';
import { BedIcon, GlobeIcon } from '@/components/icons';

export function Accommodations() {
  return (
    <div>
      <PageHeader title="Alojamientos" back />
      <div className="space-y-5 p-5 pt-2">
        {trip.accommodations.map((a) => (
          <article key={a.id} className="card overflow-hidden">
            <HeroImage src={a.image} alt={a.name} seed={a.id} className="aspect-[16/10]">
              <div className="scrim" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <p className="eyebrow text-white/75">{a.area}</p>
                <h2 className="font-display text-2xl font-semibold leading-tight tracking-tightish">
                  {a.name}
                </h2>
              </div>
            </HeroImage>
            <div className="space-y-3 p-4">
              <div className="flex flex-wrap gap-2">
                {a.nights.map((n, i) => (
                  <span key={i} className="pill bg-sand-200 text-ink-700">
                    <BedIcon width={14} height={14} /> {n}
                  </span>
                ))}
                {a.board && <span className="pill bg-amber-100/70 text-amber-800">{a.board}</span>}
                {a.roomType && <span className="pill bg-brand-50 text-brand-700">{a.roomType}</span>}
              </div>

              {a.description && <p className="text-ink-700">{a.description}</p>}
              {a.address && <p className="text-sm text-ink-500">{a.address}</p>}

              <div className="flex flex-wrap gap-2 pt-1">
                <MapsButton query={a.mapsQuery} />
                {a.website && (
                  <a
                    href={a.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tap inline-flex items-center gap-1.5 rounded-pill bg-sand-200 px-4 py-2 text-sm font-semibold text-ink-700 active:scale-95"
                  >
                    <GlobeIcon width={18} height={18} /> Web
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
