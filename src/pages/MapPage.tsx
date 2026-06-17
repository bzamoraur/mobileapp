import { useMemo, useState } from 'react';
import { trip } from '@/data';
import type { Place, PlaceCategory } from '@/data/schema';
import { PageHeader } from '@/components/PageHeader';
import { PlaceCard } from '@/components/PlaceCard';
import { placeCategoryMeta } from '@/components/meta';
import { SearchIcon, PinIcon } from '@/components/icons';
import { cn } from '@/lib/cn';

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
        p.area.toLowerCase().includes(q) ||
        (p.info?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [query, category]);

  // Group by region (Safari / Zanzíbar) preserving first-seen order.
  const byRegion = useMemo(() => {
    const map = new Map<string, Place[]>();
    for (const p of filtered) {
      const list = map.get(p.region) ?? [];
      list.push(p);
      map.set(p.region, list);
    }
    return map;
  }, [filtered]);

  return (
    <div>
      <PageHeader title="Mapa de lugares" />
      <p className="px-5 text-ink-500">
        Todos los sitios del viaje. Toca «Info» o ábrelos en Google Maps.
      </p>

      <div className="sticky top-0 z-10 space-y-3 bg-sand-50/90 p-5 pt-3 backdrop-blur">
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
            className="w-full rounded-pill border border-sand-200 bg-surface py-2.5 pl-10 pr-4 text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <FilterChip active={category === 'all'} onClick={() => setCategory('all')}>
            Todos
          </FilterChip>
          {categoriesPresent.map((c) => (
            <FilterChip key={c} active={category === c} onClick={() => setCategory(c)}>
              {placeCategoryMeta[c].label}
            </FilterChip>
          ))}
        </div>
      </div>

      <div className="space-y-6 p-5 pt-0">
        {byRegion.size === 0 && <p className="text-ink-500">No hay lugares que coincidan.</p>}
        {[...byRegion.entries()].map(([region, places]) => (
          <section key={region}>
            <h2 className="mb-2 flex items-center gap-1.5 font-display text-2xl font-semibold tracking-tightish text-ink-900">
              <PinIcon width={20} height={20} className="text-brand-600" /> {region}
            </h2>
            <div className="space-y-2">
              {places.map((p) => (
                <PlaceCard key={p.id} place={p} />
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
        active ? 'bg-brand-600 text-white' : 'bg-surface text-ink-700 shadow-soft',
      )}
    >
      {children}
    </button>
  );
}
