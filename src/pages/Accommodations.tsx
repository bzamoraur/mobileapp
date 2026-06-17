import { trip } from '@/data';
import { PageHeader } from '@/components/PageHeader';
import { HeroImage } from '@/components/HeroImage';
import { MapsButton } from '@/components/MapsButton';
import { ContactButton } from '@/components/ContactButton';

export function Accommodations() {
  return (
    <div>
      <PageHeader title="Alojamientos" back />
      <div className="space-y-4 p-5 pt-2">
        {trip.accommodations.map((a) => (
          <article key={a.id} className="card overflow-hidden">
            <HeroImage src={a.image} alt={a.name} seed={a.id} className="aspect-[16/9]">
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <h2 className="text-xl font-bold">{a.name}</h2>
                <p className="text-white/80">{a.city}</p>
              </div>
            </HeroImage>
            <div className="space-y-2 p-4">
              {a.address && <p className="text-ink-700">{a.address}</p>}
              {a.nights.length > 0 && (
                <p className="text-ink-500">Noches: {a.nights.join(', ')}</p>
              )}
              <div className="flex flex-wrap gap-2 pt-1">
                <MapsButton query={a.mapsQuery} />
              </div>
              {a.phone && (
                <ContactButton
                  contact={{ label: 'Teléfono', value: a.phone, channel: 'call' }}
                />
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
