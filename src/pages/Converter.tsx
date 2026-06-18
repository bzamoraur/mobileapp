import { useMemo, useState } from 'react';
import { trip } from '@/data';
import { cn } from '@/lib/cn';
import { PageHeader } from '@/components/PageHeader';

function format(n: number): string {
  return new Intl.NumberFormat('es-ES', { maximumFractionDigits: 2 }).format(n);
}

/**
 * Offline currency converter driven by a baked-in rate snapshot
 * (`practical.exchange`). Rates are approximate and clearly labelled as such.
 */
export function Converter() {
  const ex = trip.practical?.exchange;

  const rates = useMemo(() => {
    const m: Record<string, { label?: string | undefined; rate: number }> = {};
    if (ex) {
      m[ex.base] = { rate: 1 };
      for (const r of ex.rates) m[r.code] = { label: r.label, rate: r.perBase };
    }
    return m;
  }, [ex]);

  const codes = Object.keys(rates);
  const [from, setFrom] = useState(ex?.base ?? '');
  const [amount, setAmount] = useState('100');

  if (!ex) {
    return (
      <div>
        <PageHeader title="Cambio de moneda" />
        <p className="p-5 text-ink-500">No hay tipos de cambio para este viaje.</p>
      </div>
    );
  }

  const value = Number(amount.replace(',', '.'));
  const valid = Number.isFinite(value) && value >= 0;
  const inBase = valid ? value / (rates[from]?.rate ?? 1) : 0;

  return (
    <div>
      <PageHeader title="Cambio de moneda" />
      <div className="space-y-5 p-5 pt-2">
        <section className="card space-y-3 p-4">
          <label className="sr-only" htmlFor="amount">
            Cantidad
          </label>
          <input
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal"
            className="w-full rounded-2xl border border-surface-sunken bg-surface-muted px-4 py-3 text-2xl font-semibold text-ink-900 outline-none focus:border-brand-500"
          />
          <div className="flex flex-wrap gap-2">
            {codes.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFrom(c)}
                className={cn(
                  'tap rounded-pill px-4 py-2 text-sm font-semibold transition',
                  c === from ? 'bg-brand-600 text-white' : 'bg-sand-100 text-ink-700',
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-2">
          {codes
            .filter((c) => c !== from)
            .map((c) => (
              <div key={c} className="card flex items-baseline justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="font-semibold text-ink-900">{c}</p>
                  {rates[c]?.label && <p className="truncate text-sm text-ink-500">{rates[c]?.label}</p>}
                </div>
                <p className="shrink-0 font-display text-2xl font-semibold text-brand-700">
                  {valid ? format(inBase * (rates[c]?.rate ?? 1)) : '—'}
                </p>
              </div>
            ))}
        </section>

        <p className="text-center text-sm text-ink-400">
          Tipos {ex.updated ?? 'aproximados'}. Orientativos: el cambio real varía.
        </p>
      </div>
    </div>
  );
}
