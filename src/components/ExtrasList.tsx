import type { Extra, Trip } from '@/data/schema';
import { getPlace } from '@/data/selectors';
import { MapsButton } from './MapsButton';
import { SparkleIcon } from './icons';

/**
 * "Cosas adicionales que ver o hacer" at a stop — extra sights and optional
 * (payable) excursions, the latter clearly badged with their price.
 */
export function ExtrasList({ extras, trip }: { extras: Extra[]; trip: Trip }) {
  if (extras.length === 0) return null;
  return (
    <section>
      <h3 className="mb-1 flex items-center gap-2 text-lg font-bold text-ink-900">
        <SparkleIcon width={20} height={20} className="text-brand-600" />
        También puedes ver
      </h3>
      <p className="mb-3 text-sm text-ink-500">Ideas y excursiones para esta parada.</p>
      <ul className="space-y-2">
        {extras.map((e, i) => {
          const place = getPlace(trip, e.placeId);
          const mapsQuery = e.mapsQuery ?? place?.mapsQuery;
          return (
            <li key={i} className="card flex items-start gap-3 p-4">
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" aria-hidden />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-ink-900">{e.name}</p>
                  {e.optional && (
                    <span className="pill bg-amber-100 text-amber-800">
                      Opcional{e.price ? ` · ${e.price}` : ''}
                    </span>
                  )}
                </div>
                {e.description && <p className="mt-0.5 text-sm text-ink-700">{e.description}</p>}
                {mapsQuery && (
                  <div className="mt-2">
                    <MapsButton query={mapsQuery} label="Ver en mapa" />
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
