import type { ComponentType, SVGProps } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { trip } from '@/data';
import type { CollectionItem } from '@/data/schema';
import { cn } from '@/lib/cn';
import { usePersistentState } from '@/lib/usePersistentState';
import { PageHeader } from '@/components/PageHeader';
import { Modal } from '@/components/Modal';
import { HeroImage } from '@/components/HeroImage';
import { MapsButton } from '@/components/MapsButton';
import { collectionIconMeta } from '@/components/meta';
import { CheckIcon, PinIcon, ChevronRightIcon } from '@/components/icons';

type Done = Record<string, boolean>;
type IconCmp = ComponentType<SVGProps<SVGSVGElement>>;

const capitalize = (s: string) => (s ? `${s[0]!.toUpperCase()}${s.slice(1)}` : s);

function ItemRow({
  item,
  Icon,
  done,
  verb,
  onOpen,
  onToggle,
}: {
  item: CollectionItem;
  Icon: IconCmp;
  done: boolean;
  verb: string;
  onOpen: () => void;
  onToggle: () => void;
}) {
  return (
    <div className={cn('card flex items-center gap-2 p-3 transition', done && 'bg-moss-500/10')}>
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Ver ficha de ${item.name}`}
        className="tap flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        <HeroImage
          src={item.image}
          alt={item.name}
          seed={item.id}
          className="h-14 w-14 shrink-0 rounded-2xl"
        />
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline gap-2">
            <span className="font-semibold text-ink-900">{item.name}</span>
            {item.subtitle && <span className="text-sm italic text-ink-400">{item.subtitle}</span>}
          </span>
          {item.note && (
            <span className="mt-0.5 block truncate text-sm text-ink-500">{item.note}</span>
          )}
        </span>
        <ChevronRightIcon width={20} height={20} className="shrink-0 text-ink-300" />
      </button>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={done}
        aria-label={done ? `Marcar ${item.name} como pendiente` : `Marcar ${item.name} como ${verb}`}
        className={cn(
          'tap flex h-11 w-11 shrink-0 items-center justify-center rounded-pill border-2 transition',
          done ? 'border-moss-500 bg-moss-500 text-white' : 'border-ink-300 text-ink-400',
        )}
      >
        {done ? <CheckIcon width={22} height={22} /> : <Icon width={20} height={20} />}
      </button>
    </div>
  );
}

/** Generic tick-off collection (monuments, photos, dishes…). Route: /coleccion/:id */
export function Collection() {
  const { id } = useParams();
  const [done, setDone] = usePersistentState<Done>(`collection:${trip.id}:${id ?? ''}`, {});
  const [openId, setOpenId] = useState<string | null>(null);

  const collection = trip.collections.find((c) => c.id === id);
  if (!collection) {
    return (
      <div>
        <PageHeader title="Colección" />
        <p className="p-5 text-ink-500">No encontramos esta colección.</p>
      </div>
    );
  }

  const Icon = collectionIconMeta[collection.icon];
  const verb = collection.verb ?? 'visto';
  const highlights = collection.items.filter((it) => it.highlight);
  const rest = collection.items.filter((it) => !it.highlight);
  const doneCount = collection.items.filter((it) => done[it.id]).length;

  const toggle = (itemId: string) => setDone((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  const selected = openId ? collection.items.find((it) => it.id === openId) : undefined;
  const selectedDone = selected ? Boolean(done[selected.id]) : false;
  const selectedMaps =
    selected?.mapsQuery ??
    (selected?.placeId
      ? trip.places.find((p) => p.id === selected.placeId)?.mapsQuery
      : undefined);

  const renderRow = (it: CollectionItem) => (
    <ItemRow
      key={it.id}
      item={it}
      Icon={Icon}
      done={Boolean(done[it.id])}
      verb={verb}
      onOpen={() => setOpenId(it.id)}
      onToggle={() => toggle(it.id)}
    />
  );

  return (
    <div>
      <PageHeader title={collection.title} />
      <div className="space-y-6 p-5 pt-2">
        <section className="card bg-brand-50 p-4">
          <p className="flex items-center gap-2 font-semibold text-brand-700">
            <Icon width={20} height={20} />
            Habéis {verb} {doneCount} de {collection.items.length}
            {collection.unit ? ` ${collection.unit}` : ''}
          </p>
          <p className="mt-1 text-sm text-ink-500">
            {collection.intro ??
              'Toca un elemento para ver su ficha. Marca el círculo cuando lo completéis: se guarda en este móvil.'}
          </p>
        </section>

        {highlights.length > 0 && (
          <section>
            <h2 className="eyebrow mb-2">{collection.highlightTitle ?? 'Imprescindibles'}</h2>
            <div className="space-y-3">{highlights.map(renderRow)}</div>
          </section>
        )}

        {rest.length > 0 && (
          <section>
            {highlights.length > 0 && (
              <h2 className="eyebrow mb-2">{collection.restTitle ?? 'Más'}</h2>
            )}
            <div className="space-y-3">{rest.map(renderRow)}</div>
          </section>
        )}
      </div>

      <Modal open={Boolean(selected)} onClose={() => setOpenId(null)} title={selected?.name ?? ''}>
        {selected && (
          <div>
            {(selected.subtitle || selected.highlight) && (
              <div className="mb-3 flex items-center gap-2">
                {selected.subtitle && (
                  <span className="italic text-ink-500">{selected.subtitle}</span>
                )}
                {selected.highlight && (
                  <span className="pill bg-brand-100 text-brand-700">
                    {collection.highlightTitle ?? 'Imprescindible'}
                  </span>
                )}
              </div>
            )}

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

            {selectedMaps && (
              <div className="mt-4">
                <MapsButton query={selectedMaps} />
              </div>
            )}

            <button
              type="button"
              onClick={() => toggle(selected.id)}
              aria-pressed={selectedDone}
              className={cn(
                'tap mt-5 flex w-full items-center justify-center gap-2 rounded-pill py-3 font-semibold text-white transition active:scale-[0.99]',
                selectedDone ? 'bg-moss-500' : 'bg-brand-600',
              )}
            >
              <CheckIcon width={20} height={20} />
              {selectedDone ? `${capitalize(verb)} ✓` : `Marcar como ${verb}`}
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
