import { useMemo, useState } from 'react';
import { trip } from '@/data';
import { usePersistentState } from '@/lib/usePersistentState';
import { todayInTimezone, formatLongDate, capitalize } from '@/lib/dates';
import {
  CATEGORIES,
  CATEGORY_LIST,
  CURRENCIES,
  DEFAULT_CATEGORY,
  breakdownForCurrency,
  dominantCurrency,
  formatAmount,
  groupByDay,
  migrateExpenses,
  totalsByCurrency,
} from '@/lib/expenses';
import type { CategoryId, Expense } from '@/lib/expenses';
import { PageHeader } from '@/components/PageHeader';
import { PlusIcon, CloseIcon } from '@/components/icons';
import { cn } from '@/lib/cn';

/** Today's local calendar date in the destination timezone (YYYY-MM-DD). */
function today(): string {
  return todayInTimezone(trip.destinationTimezone);
}

/** Per-currency category breakdown rendered as elegant CSS proportion bars. */
function CategoryBreakdown({ items }: { items: Expense[] }) {
  const totals = useMemo(() => totalsByCurrency(items), [items]);
  const [currency, setCurrency] = useState<string | null>(null);
  const active = currency ?? dominantCurrency(items) ?? totals[0]?.currency;
  if (!active || totals.length === 0) return null;

  const slices = breakdownForCurrency(items, active);
  if (slices.length === 0) return null;

  return (
    <section className="card space-y-4 p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold tracking-tightish text-ink-900">
          Por categoría
        </h2>
        {totals.length > 1 && (
          <div className="flex gap-1" role="group" aria-label="Moneda del desglose">
            {totals.map((t) => {
              const on = t.currency === active;
              return (
                <button
                  key={t.currency}
                  type="button"
                  onClick={() => setCurrency(t.currency)}
                  aria-pressed={on}
                  className={cn(
                    'rounded-pill px-3 py-1 text-xs font-semibold tracking-tightish',
                    on ? 'bg-brand-600 text-white' : 'bg-surface-muted text-ink-500',
                  )}
                >
                  {t.currency}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <ul className="space-y-3">
        {slices.map((s) => (
          <li key={s.category.id}>
            <div className="mb-1.5 flex items-center gap-2 text-sm">
              <s.category.icon width={18} height={18} className={cn('shrink-0', s.category.color)} />
              <span className="font-medium text-ink-800">{s.category.label}</span>
              <span className="ml-auto shrink-0 tabular-nums text-ink-500">
                {Math.round(s.share)}%
              </span>
              <span className="shrink-0 tabular-nums font-semibold text-ink-700">
                {formatAmount(s.total)}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-pill bg-surface-sunken">
              <div
                className={cn('h-full rounded-pill', s.category.bar)}
                style={{ width: `${Math.max(s.share, 3)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * On-device expense tracker. Records what the family spends, tagged by category
 * and date, with a per-currency category breakdown and totals grouped by day.
 * Everything is saved on this phone — no backend, no sharing.
 */
export function Expenses() {
  const [stored, setItems] = usePersistentState<Expense[]>(`expenses:${trip.id}`, []);
  // Read defensively: legacy rows may lack `category`/`date`.
  const items = useMemo(() => migrateExpenses(stored), [stored]);

  const [concept, setConcept] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<string>('EUR');
  const [category, setCategory] = useState<CategoryId>(DEFAULT_CATEGORY);

  const add = () => {
    const value = Number(amount.replace(',', '.'));
    if (!concept.trim() || !Number.isFinite(value) || value <= 0) return;
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const next: Expense = {
      id,
      concept: concept.trim(),
      amount: value,
      currency,
      category,
      date: today(),
    };
    setItems((prev) => [next, ...prev]);
    setConcept('');
    setAmount('');
  };

  const totals = totalsByCurrency(items);
  const groups = useMemo(() => groupByDay(items), [items]);

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

        <CategoryBreakdown items={items} />

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

          <fieldset>
            <legend className="eyebrow mb-2">Categoría</legend>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_LIST.map((c) => {
                const on = c.id === category;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    aria-pressed={on}
                    className={cn(
                      'tap inline-flex items-center gap-1.5 rounded-pill px-3 py-2 text-sm font-semibold tracking-tightish',
                      on
                        ? 'bg-brand-600 text-white'
                        : 'bg-surface-muted text-ink-700 active:bg-sand-100',
                    )}
                  >
                    <c.icon width={16} height={16} className={on ? 'text-white' : c.color} />
                    {c.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <button
            type="button"
            onClick={add}
            className="tap flex w-full items-center justify-center gap-2 rounded-pill bg-brand-600 py-3 font-semibold text-white active:scale-[0.99]"
          >
            <PlusIcon width={20} height={20} /> Añadir gasto
          </button>
        </section>

        {items.length > 0 ? (
          <div className="space-y-6">
            {groups.map((group) => (
              <section key={group.date ?? 'undated'} className="space-y-2">
                <div className="flex items-baseline justify-between gap-3 px-1">
                  <h2 className="font-display text-lg font-semibold tracking-tightish text-ink-900">
                    {group.date ? capitalize(formatLongDate(group.date)) : 'Sin fecha'}
                  </h2>
                  <div className="flex flex-wrap justify-end gap-x-3 gap-y-0.5 text-sm text-ink-500">
                    {group.subtotals.map((t) => (
                      <span key={t.currency} className="tabular-nums">
                        <span className="font-semibold text-ink-700">{formatAmount(t.total)}</span>{' '}
                        {t.currency}
                      </span>
                    ))}
                  </div>
                </div>
                <ul className="space-y-2">
                  {group.items.map((e) => {
                    const meta = CATEGORIES[e.category];
                    return (
                      <li key={e.id} className="card flex items-center gap-3 p-4">
                        <span
                          className={cn(
                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-surface-muted',
                            meta.color,
                          )}
                          aria-hidden
                        >
                          <meta.icon width={20} height={20} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-semibold text-ink-900">{e.concept}</span>
                          <span className="block text-xs text-ink-500">{meta.label}</span>
                        </span>
                        <span className="shrink-0 tabular-nums font-medium text-ink-700">
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
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        ) : (
          <p className="text-center text-ink-400">Aún no hay gastos anotados.</p>
        )}
      </div>
    </div>
  );
}
