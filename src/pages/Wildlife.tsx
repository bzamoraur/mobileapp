import { useMemo } from 'react';
import { trip } from '@/data';
import type { WildlifeSpecies } from '@/data/schema';
import { cn } from '@/lib/cn';
import { usePersistentState } from '@/lib/usePersistentState';
import { PageHeader } from '@/components/PageHeader';
import { BinocularsIcon, CheckIcon, PawIcon } from '@/components/icons';

type Seen = Record<string, boolean>;

function SpeciesCard({
  species,
  seen,
  onToggle,
}: {
  species: WildlifeSpecies;
  seen: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={seen}
      className={cn(
        'card tap flex w-full items-center gap-3 p-4 text-left transition active:scale-[0.99]',
        seen && 'bg-moss-500/10',
      )}
    >
      <span
        className={cn(
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-pill border-2 transition',
          seen ? 'border-moss-500 bg-moss-500 text-white' : 'border-ink-300 text-ink-400',
        )}
      >
        {seen ? <CheckIcon width={22} height={22} /> : <PawIcon width={22} height={22} />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline gap-2">
          <span className={cn('font-semibold text-ink-900', seen && 'text-moss-700')}>
            {species.name}
          </span>
          {species.nameLocal && (
            <span className="text-sm italic text-ink-400">{species.nameLocal}</span>
          )}
        </span>
        {species.note && <span className="mt-0.5 block text-sm text-ink-500">{species.note}</span>}
      </span>
    </button>
  );
}

export function Wildlife() {
  const [seen, setSeen] = usePersistentState<Seen>(`wildlife:${trip.id}`, {});
  const big5 = useMemo(() => trip.wildlife.filter((s) => s.big5), []);
  const others = useMemo(() => trip.wildlife.filter((s) => !s.big5), []);
  const big5Seen = big5.filter((s) => seen[s.id]).length;

  const toggle = (id: string) => setSeen((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div>
      <PageHeader title="Fauna · Big Five" />
      <div className="space-y-6 p-5 pt-2">
        <section className="card bg-brand-50 p-4">
          <p className="flex items-center gap-2 font-semibold text-brand-700">
            <BinocularsIcon width={20} height={20} />
            Habéis visto {big5Seen} de {big5.length} del Big Five
          </p>
          <p className="mt-1 text-sm text-ink-500">
            Marca cada animal cuando lo veáis. Se guarda en este móvil.
          </p>
        </section>

        {big5.length > 0 && (
          <section>
            <h2 className="eyebrow mb-2">Los Cinco Grandes</h2>
            <div className="space-y-3">
              {big5.map((s) => (
                <SpeciesCard
                  key={s.id}
                  species={s}
                  seen={Boolean(seen[s.id])}
                  onToggle={() => toggle(s.id)}
                />
              ))}
            </div>
          </section>
        )}

        {others.length > 0 && (
          <section>
            <h2 className="eyebrow mb-2">Más fauna</h2>
            <div className="space-y-3">
              {others.map((s) => (
                <SpeciesCard
                  key={s.id}
                  species={s}
                  seen={Boolean(seen[s.id])}
                  onToggle={() => toggle(s.id)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
