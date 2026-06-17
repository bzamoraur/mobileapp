import { useMemo, useState } from 'react';
import { trip } from '@/data';
import type { Place, PlaceCategory } from '@/data/schema';
import { PageHeader } from '@/components/PageHeader';
import { PlaceCard } from '@/components/PlaceCard';
import { SearchIcon, PinIcon } from '@/components/icons';
import { cn } from '@/lib/cn';

const CATEGORY_LABEL: Record<PlaceCategory, string> = {
  temple: 'Templos y santuarios',
  monument: 'Monumentos y miradores',
  market: 'Mercados y comida',
  food: 'Comida',
  nature: 'Naturaleza',
  shopping: 'Compras',
  museum: 'Museos',
  neighborhood: 'Barrios y zonas',
  other: 'Otros',
};

export function MapPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<PlaceCategory | 'all'>('all');

  const categoriesPresent = useMemo(() => {
    const set = new Set<PlaceCategory>();
    trip.places.forEach((p) => set.add(p.category));
    return [...set];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return trip.places.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        (p.info?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [query, category]);

  // Group by city, then by category.
  const byCity = useMemo(() => {
    const map = new Map<string, Map<PlaceCategory, Place[]>>();
    for (const p of filtered) {
      const cats = map.get(p.city) ?? new Map<PlaceCategory, Place[]>();
      const list = cats.get(p.category) ?? [];
      list.push(p);
      cats.set(p.category, list);
      map.set(p.city, cats);
    }
    return map;
  }, [filtered]);

  return (
    <div>
      <PageHeader title="Mapa de lugares" />
      <p className="px-5 text-ink-500">
        Todos los sitios del viaje: toca «Info» o ábrelos en Google Maps.
      </p>

      <div className="sticky top-0 z-10 space-y-3 bg-surface-muted/90 p-5 pt-3 backdrop-blur">
        <div className="relative">
          <SearchIcon
            width={20}
            height={20}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar lugar…"
            aria-label="Buscar lugar"
            className="w-full rounded-pill border border-surface-sunken bg-surface py-2.5 pl-10 pr-4 text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <FilterChip active={category === 'all'} onClick={() => setCategory('all')}>
            Todos
          </FilterChip>
          {categoriesPresent.map((c) => (
            <FilterChip key={c} active={category === c} onClick={() => setCategory(c)}>
              {CATEGORY_LABEL[c]}
            </FilterChip>
          ))}
        </div>
      </div>

      <div className="space-y-6 p-5 pt-0">
        {byCity.size === 0 && <p className="text-ink-500">No hay lugares que coincidan.</p>}
        {[...byCity.entries()].map(([city, cats]) => (
          <section key={city}>
            <h2 className="mb-2 flex items-center gap-1.5 text-lg font-bold text-ink-900">
              <PinIcon width={20} height={20} className="text-brand-600" /> {city}
            </h2>
            <div className="space-y-4">
              {[...cats.entries()].map(([cat, places]) => (
                <div key={cat}>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-500">
                    {CATEGORY_LABEL[cat]}
                  </h3>
                  <div className="space-y-2">
                    {places.map((p) => (
                      <PlaceCard key={p.id} place={p} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'tap whitespace-nowrap rounded-pill px-4 py-2 text-sm font-semibold transition',
        active ? 'bg-brand-600 text-white' : 'bg-surface text-ink-700 shadow-card',
      )}
    >
      {children}
    </button>
  );
}
