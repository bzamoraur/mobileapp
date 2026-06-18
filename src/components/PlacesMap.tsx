import { useEffect, useMemo } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import type { LatLngBoundsExpression, LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Place } from '@/data/schema';
import { regionIcon } from '@/lib/leafletIcon';
import { mapsUrl } from '@/lib/maps';
import { PinIcon } from './icons';

/** A place guaranteed to carry coordinates (narrowed from `Place`). */
type LocatedPlace = Place & { lat: number; lng: number };

function hasCoords(p: Place): p is LocatedPlace {
  return typeof p.lat === 'number' && typeof p.lng === 'number';
}

/** Re-fits the map to the markers whenever the set of bounds changes. */
function FitBounds({ bounds }: { bounds: LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [36, 36] });
  }, [map, bounds]);
  return null;
}

/**
 * Interactive, offline-capable map of the trip's places.
 *
 * Tiles come from OpenStreetMap and are runtime-cached by the service worker
 * (see `vite.config.ts`), so any area the user has panned over once stays
 * available with no connectivity. Markers are themed `divIcon`s (no PNG assets,
 * sidestepping the Vite default-marker bug). Each marker opens a popup with the
 * place name and a link to Google Maps.
 */
export function PlacesMap({ places }: { places: Place[] }) {
  const located = useMemo(() => places.filter(hasCoords), [places]);

  const points = useMemo<LatLngTuple[]>(
    () => located.map((p) => [p.lat, p.lng]),
    [located],
  );

  // Bounds drive both the initial view and the fit-to-markers effect.
  const bounds = useMemo<LatLngBoundsExpression | null>(() => {
    if (points.length === 0) return null;
    if (points.length === 1) {
      const [lat, lng] = points[0]!;
      // A single point can't make a box; nudge a small frame around it.
      return [
        [lat - 0.4, lng - 0.4],
        [lat + 0.4, lng + 0.4],
      ];
    }
    return points;
  }, [points]);

  if (!bounds) return null;

  return (
    <MapContainer
      bounds={bounds}
      scrollWheelZoom={false}
      className="h-full w-full"
      // Tanzania + Zanzíbar; keep users from panning to empty ocean/space.
      minZoom={4}
      maxZoom={16}
      aria-label="Mapa interactivo de los lugares del viaje"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        maxZoom={19}
      />
      <FitBounds bounds={bounds} />
      {located.map((p) => (
        <Marker key={p.id} position={[p.lat, p.lng]} icon={regionIcon(p.region)}>
          <Popup>
            <div className="min-w-[10rem]">
              <p className="font-display text-base font-semibold leading-tight text-ink-900">
                {p.name}
              </p>
              <p className="mt-0.5 text-xs text-ink-500">{p.area}</p>
              <a
                href={mapsUrl(p.mapsQuery)}
                target="_blank"
                rel="noopener noreferrer"
                className="tap mt-2 inline-flex items-center justify-center gap-1.5 rounded-pill bg-ink-500/90 px-3 py-1.5 text-sm font-semibold text-white"
              >
                <PinIcon width={16} height={16} />
                Abrir en Google Maps
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
