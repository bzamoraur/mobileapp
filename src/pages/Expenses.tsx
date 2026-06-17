import { useState } from 'react';
import { trip } from '@/data';
import { usePersistentState } from '@/lib/usePersistentState';
import { PageHeader } from '@/components/PageHeader';
import { PlusIcon, CloseIcon } from '@/components/icons';

type Expense = { id: string; concept: string; amount: number; currency: string };

const CURRENCIES = ['EUR', 'USD', 'TZS'] as const;

function formatAmount(n: number): string {
  return new Intl.NumberFormat('es-ES', { maximumFractionDigits: 2 }).format(n);
}

/**
 * On-device expense tracker. Adds up what the family spends, grouped by currency
 * (EUR/USD/TZS). Everything is saved on this phone — no backend, no sharing.
 */
export function Expenses() {
  const [items, setItems] = usePersistentState<Expense[]>(`expenses:${trip.id}`, []);
  const [concept, setConcept] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<string>('EUR');

  const add = () => {
    const value = Number(amount.replace(',', '.'));
    if (!concept.trim() || !Number.isFinite(value) || value <= 0) return;
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setItems((prev) => [{ id, concept: concept.trim(), amount: value, currency }, ...prev]);
    setConcept('');
    setAmount('');
  };

  const totals = CURRENCIES.map((c) => ({
    currency: c,
    total: items.filter((e) => e.currency === c).reduce((sum, e) => sum + e.amount, 0),
  })).filter((t) => t.total > 0);

  return (
    <div>
      <PageHeader title="Gastos" />
      <div className="space-y-5 p-5 pt-2">
        <p className="text-ink-500">Lleva la cuenta de los gastos del viaje. Se guarda en este móvil.</p>

        {totals.length > 0 && (
          <section className="card flex flex-wrap gap-x-8 gap-y-2 bg-brand-50 p-4">
            {totals.map((t) => (
              <div key={t.currency}>
                <p className="eyebrow">{t.currency}</p>
                <p className="font-display text-2xl font-semibold text-brand-700">
                  {formatAmount(t.total)}
                </p>
              </div>
            ))}
          </section>
        )}

        <section className="card space-y-3 p-4">
          <input
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            placeholder="Concepto (p. ej. propinas, cena…)"
            className="w-full rounded-2xl border border-surface-sunken bg-surface-muted px-4 py-3 text-ink-900 outline-none focus:border-brand-500"
          />
          <div className="flex gap-2">
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="decimal"
              placeholder="Importe"
              className="min-w-0 flex-1 rounded-2xl border border-surface-sunken bg-surface-muted px-4 py-3 text-ink-900 outline-none focus:border-brand-500"
            />
            <label className="sr-only" htmlFor="expense-currency">
              Moneda
            </label>
            <select
              id="expense-currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="rounded-2xl border border-surface-sunken bg-surface-muted px-3 py-3 text-ink-900 outline-none focus:border-brand-500"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={add}
            className="tap flex w-full items-center justify-center gap-2 rounded-pill bg-brand-600 py-3 font-semibold text-white active:scale-[0.99]"
          >
            <PlusIcon width={20} height={20} /> Añadir gasto
          </button>
        </section>

        {items.length > 0 ? (
          <ul className="space-y-2">
            {items.map((e) => (
              <li key={e.id} className="card flex items-center gap-3 p-4">
                <p className="min-w-0 flex-1 truncate font-semibold text-ink-900">{e.concept}</p>
                <span className="shrink-0 font-medium text-ink-700">
                  {formatAmount(e.amount)} {e.currency}
                </span>
                <button
                  type="button"
                  onClick={() => setItems((prev) => prev.filter((x) => x.id !== e.id))}
                  aria-label={`Eliminar ${e.concept}`}
                  className="tap flex h-11 w-11 shrink-0 items-center justify-center rounded-pill text-ink-400 active:bg-sand-100 active:text-ink-700"
                >
                  <CloseIcon width={18} height={18} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-ink-400">Aún no hay gastos anotados.</p>
        )}
      </div>
    </div>
  );
}
