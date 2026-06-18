import { useMemo, useState } from 'react';
import { trip } from '@/data';
import type { WildlifeSpecies } from '@/data/schema';
import { cn } from '@/lib/cn';
import { usePersistentState } from '@/lib/usePersistentState';
import { PageHeader } from '@/components/PageHeader';
import { Modal } from '@/components/Modal';
import { HeroImage } from '@/components/HeroImage';
import { BinocularsIcon, CheckIcon, PawIcon, PinIcon, ChevronRightIcon } from '@/components/icons';

type Seen = Record<string, boolean>;

function SpeciesRow({
  species,
  seen,
  onOpen,
  onToggle,
}: {
  species: WildlifeSpecies;
  seen: boolean;
  onOpen: () => void;
  onToggle: () => void;
}) {
  return (
    <div className={cn('card flex items-center gap-2 p-3 transition', seen && 'bg-moss-500/10')}>
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Ver ficha de ${species.name}`}
        className="tap flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        <HeroImage
          src={species.image}
          alt={species.name}
          seed={species.id}
          className="h-14 w-14 shrink-0 rounded-2xl"
        />
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline gap-2">
            <span className="font-semibold text-ink-900">{species.name}</span>
            {species.nameLocal && (
              <span className="text-sm italic text-ink-400">{species.nameLocal}</span>
            )}
          </span>
          {species.note && (
            <span className="mt-0.5 block truncate text-sm text-ink-500">{species.note}</span>
          )}
        </span>
        <ChevronRightIcon width={20} height={20} className="shrink-0 text-ink-300" />
      </button>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={seen}
        aria-label={seen ? `Marcar ${species.name} como no visto` : `Marcar ${species.name} como visto`}
        className={cn(
          'tap flex h-11 w-11 shrink-0 items-center justify-center rounded-pill border-2 transition',
          seen ? 'border-moss-500 bg-moss-500 text-white' : 'border-ink-300 text-ink-400',
        )}
      >
        {seen ? <CheckIcon width={22} height={22} /> : <PawIcon width={20} height={20} />}
      </button>
    </div>
  );
}

export function Wildlife() {
  const [seen, setSeen] = usePersistentState<Seen>(`wildlife:${trip.id}`, {});
  const [openId, setOpenId] = useState<string | null>(null);

  const big5 = useMemo(() => trip.wildlife.filter((s) => s.big5), []);
  const others = useMemo(() => trip.wildlife.filter((s) => !s.big5), []);
  const big5Seen = big5.filter((s) => seen[s.id]).length;

  const toggle = (id: string) => setSeen((prev) => ({ ...prev, [id]: !prev[id] }));
  const selected = openId ? trip.wildlife.find((s) => s.id === openId) : undefined;
  const selectedSeen = selected ? Boolean(seen[selected.id]) : false;

  const renderRow = (s: WildlifeSpecies) => (
    <SpeciesRow
      key={s.id}
      species={s}
      seen={Boolean(seen[s.id])}
      onOpen={() => setOpenId(s.id)}
      onToggle={() => toggle(s.id)}
    />
  );

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
            Toca un animal para ver su ficha. Marca el círculo cuando lo veáis: se guarda en este
            móvil.
          </p>
        </section>

        {big5.length > 0 && (
          <section>
            <h2 className="eyebrow mb-2">Los Cinco Grandes</h2>
            <div className="space-y-3">{big5.map(renderRow)}</div>
          </section>
        )}

        {others.length > 0 && (
          <section>
            <h2 className="eyebrow mb-2">Más fauna</h2>
            <div className="space-y-3">{others.map(renderRow)}</div>
          </section>
        )}
      </div>

      <Modal open={Boolean(selected)} onClose={() => setOpenId(null)} title={selected?.name ?? ''}>
        {selected && (
          <div>
            <div className="mb-3 flex items-center gap-2">
              {selected.nameLocal && <span className="italic text-ink-500">{selected.nameLocal}</span>}
              {selected.big5 && <span className="pill bg-brand-100 text-brand-700">Big Five</span>}
            </div>

            <HeroImage
              src={selected.image}
              alt={selected.name}
              seed={selected.id}
              className="aspect-[16/10] w-full rounded-card"
            />

            {selected.about && <p className="mt-4 leading-relaxed text-ink-700">{selected.about}</p>}
            {selected.note && (
              <p className="mt-2 flex items-start gap-1.5 text-sm text-ink-500">
                <PinIcon width={15} height={15} className="mt-0.5 shrink-0" />
                {selected.note}
              </p>
            )}

            {selected.fact && (
              <div className="mt-4 rounded-card bg-brand-50 p-4">
                <p className="eyebrow text-brand-700">¿Sabías que…?</p>
                <p className="mt-1 text-ink-800">{selected.fact}</p>
              </div>
            )}

            <button
              type="button"
              onClick={() => toggle(selected.id)}
              aria-pressed={selectedSeen}
              className={cn(
                'tap mt-5 flex w-full items-center justify-center gap-2 rounded-pill py-3 font-semibold text-white transition active:scale-[0.99]',
                selectedSeen ? 'bg-moss-500' : 'bg-brand-600',
              )}
            >
              <CheckIcon width={20} height={20} />
              {selectedSeen ? 'Visto ✓' : 'Marcar como visto'}
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
