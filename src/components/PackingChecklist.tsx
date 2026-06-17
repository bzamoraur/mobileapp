import { useMemo } from 'react';
import { cn } from '@/lib/cn';
import { usePersistentState } from '@/lib/usePersistentState';
import { CheckIcon } from './icons';

type Checked = Record<string, boolean>;

/**
 * Interactive packing list: each item is tickable and the checked state is saved
 * on-device per trip, so it survives reloads and works offline. Items are keyed
 * by their text, so editing the list only resets the items that actually changed.
 */
export function PackingChecklist({ items, tripId }: { items: string[]; tripId: string }) {
  const [checked, setChecked] = usePersistentState<Checked>(`packing:${tripId}`, {});
  const doneCount = useMemo(() => items.filter((i) => checked[i]).length, [items, checked]);

  return (
    <div className="card p-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="eyebrow">
          {doneCount}/{items.length} listo
        </p>
        {doneCount > 0 && (
          <button
            type="button"
            onClick={() => setChecked({})}
            className="tap text-sm font-semibold text-ink-500 active:text-ink-700"
          >
            Reiniciar
          </button>
        )}
      </div>
      <ul>
        {items.map((item) => {
          const isOn = Boolean(checked[item]);
          return (
            <li key={item}>
              <button
                type="button"
                onClick={() => setChecked((prev) => ({ ...prev, [item]: !prev[item] }))}
                aria-pressed={isOn}
                className="tap flex w-full items-center gap-3 rounded-2xl px-1 py-2 text-left active:bg-sand-50"
              >
                <span
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition',
                    isOn ? 'border-moss-500 bg-moss-500 text-white' : 'border-ink-300',
                  )}
                >
                  {isOn && <CheckIcon width={16} height={16} />}
                </span>
                <span className={cn('text-ink-700', isOn && 'text-ink-400 line-through')}>{item}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
