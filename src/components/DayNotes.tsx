import { useId } from 'react';
import { trip } from '@/data';
import { usePersistentState } from '@/lib/usePersistentState';
import { PencilIcon } from './icons';

/** Per-day personal note, saved on-device (private to this phone). */
export function DayNotes({ dayIndex }: { dayIndex: number }) {
  const id = useId();
  const [note, setNote] = usePersistentState<string>(`notes:${trip.id}:${dayIndex}`, '');

  return (
    <section className="card p-4">
      <label htmlFor={id} className="flex items-center gap-2 font-bold text-ink-900">
        <PencilIcon width={18} height={18} className="text-brand-600" />
        Mis notas
      </label>
      <p className="mt-0.5 text-sm text-ink-500">Privadas, guardadas en este móvil.</p>
      <textarea
        id={id}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
        placeholder="Apunta recuerdos, gastos o lo que no quieras olvidar…"
        className="mt-3 w-full resize-y rounded-2xl border border-surface-sunken bg-surface-muted px-4 py-3 text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
      />
    </section>
  );
}
