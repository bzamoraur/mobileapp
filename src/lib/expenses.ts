/**
 * Pure helpers for the on-device expense tracker: the fixed category set, a
 * defensive reader that tolerates legacy stored rows (no `category`/`date`),
 * and the derived reads that power the per-currency category breakdown and the
 * day-grouped list. Kept framework-free so it is easy to unit-test.
 */
import type { ComponentType, SVGProps } from 'react';
import {
  ForkKnifeIcon,
  CarIcon,
  BedIcon,
  ActivityIcon,
  BagIcon,
  TipIcon,
  DotsIcon,
} from '@/components/icons';

/** The fixed, ordered set of expense categories. */
export const CATEGORY_IDS = [
  'comida',
  'transporte',
  'alojamiento',
  'actividades',
  'compras',
  'propinas',
  'otros',
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

/** Fallback category for new rows and for legacy rows missing one. */
export const DEFAULT_CATEGORY: CategoryId = 'otros';

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export type CategoryMeta = {
  id: CategoryId;
  /** Spanish label shown in the UI. */
  label: string;
  icon: IconComponent;
  /** Tailwind text colour for the glyph (warm palette). */
  color: string;
  /** Tailwind background for the proportion bar / icon chip. */
  bar: string;
};

export const CATEGORIES: Record<CategoryId, CategoryMeta> = {
  comida: { id: 'comida', label: 'Comida', icon: ForkKnifeIcon, color: 'text-brand-600', bar: 'bg-brand-500' },
  transporte: { id: 'transporte', label: 'Transporte', icon: CarIcon, color: 'text-moss-600', bar: 'bg-moss-500' },
  alojamiento: { id: 'alojamiento', label: 'Alojamiento', icon: BedIcon, color: 'text-sky-700', bar: 'bg-sky-500' },
  actividades: { id: 'actividades', label: 'Actividades', icon: ActivityIcon, color: 'text-amber-600', bar: 'bg-amber-500' },
  compras: { id: 'compras', label: 'Compras', icon: BagIcon, color: 'text-rose-600', bar: 'bg-rose-500' },
  propinas: { id: 'propinas', label: 'Propinas', icon: TipIcon, color: 'text-emerald-600', bar: 'bg-emerald-500' },
  otros: { id: 'otros', label: 'Otros', icon: DotsIcon, color: 'text-ink-500', bar: 'bg-ink-400' },
};

/** Category list in display order. */
export const CATEGORY_LIST: CategoryMeta[] = CATEGORY_IDS.map((id) => CATEGORIES[id]);

export const CURRENCIES = ['EUR', 'USD', 'TZS'] as const;
export type Currency = (typeof CURRENCIES)[number];

/** A stored expense. `date` is a local `YYYY-MM-DD`; absent on legacy rows. */
export type Expense = {
  id: string;
  concept: string;
  amount: number;
  currency: string;
  category: CategoryId;
  date?: string;
};

/** Narrows an unknown value to a known category, defaulting to `otros`. */
export function toCategory(value: unknown): CategoryId {
  return CATEGORY_IDS.includes(value as CategoryId) ? (value as CategoryId) : DEFAULT_CATEGORY;
}

/**
 * Reads a possibly-legacy stored array into well-formed `Expense`s. Rows from
 * before categories/dates existed get `category: 'otros'` and keep no `date`
 * (they fall into the "Sin fecha" bucket). Malformed rows are dropped, never
 * thrown on.
 */
export function migrateExpenses(raw: unknown): Expense[] {
  if (!Array.isArray(raw)) return [];
  const out: Expense[] = [];
  for (const row of raw as unknown[]) {
    if (typeof row !== 'object' || row === null) continue;
    const r = row as Record<string, unknown>;
    if (typeof r.id !== 'string' || typeof r.concept !== 'string') continue;
    if (typeof r.amount !== 'number' || !Number.isFinite(r.amount)) continue;
    if (typeof r.currency !== 'string') continue;
    const expense: Expense = {
      id: r.id,
      concept: r.concept,
      amount: r.amount,
      currency: r.currency,
      category: toCategory(r.category),
    };
    // exactOptionalPropertyTypes: only set `date` when we actually have one.
    if (typeof r.date === 'string' && r.date) expense.date = r.date;
    out.push(expense);
  }
  return out;
}

export type CurrencyTotal = { currency: string; total: number };

/** Per-currency grand totals (only currencies with spend), in CURRENCIES order. */
export function totalsByCurrency(items: Expense[]): CurrencyTotal[] {
  const sums = new Map<string, number>();
  for (const e of items) sums.set(e.currency, (sums.get(e.currency) ?? 0) + e.amount);
  const ordered: string[] = [...CURRENCIES, ...sums.keys()];
  const seen = new Set<string>();
  const out: CurrencyTotal[] = [];
  for (const c of ordered) {
    if (seen.has(c)) continue;
    seen.add(c);
    const total = sums.get(c);
    if (total && total > 0) out.push({ currency: c, total });
  }
  return out;
}

/** The currency with the most total spend (used as the breakdown default). */
export function dominantCurrency(items: Expense[]): string | undefined {
  return totalsByCurrency(items).reduce<CurrencyTotal | undefined>(
    (best, t) => (!best || t.total > best.total ? t : best),
    undefined,
  )?.currency;
}

export type CategorySlice = {
  category: CategoryMeta;
  total: number;
  /** Share of this currency's spend, 0–100. */
  share: number;
};

/**
 * Category breakdown for a single currency, largest first, omitting empty
 * categories. Shares are percentages of that currency's total.
 */
export function breakdownForCurrency(items: Expense[], currency: string): CategorySlice[] {
  const sums = new Map<CategoryId, number>();
  let grand = 0;
  for (const e of items) {
    if (e.currency !== currency) continue;
    sums.set(e.category, (sums.get(e.category) ?? 0) + e.amount);
    grand += e.amount;
  }
  if (grand <= 0) return [];
  const slices: CategorySlice[] = [];
  for (const id of CATEGORY_IDS) {
    const total = sums.get(id) ?? 0;
    if (total <= 0) continue;
    slices.push({ category: CATEGORIES[id], total, share: (total / grand) * 100 });
  }
  return slices.sort((a, b) => b.total - a.total);
}

export type DayGroup = {
  /** `YYYY-MM-DD`, or `null` for the undated ("Sin fecha") bucket. */
  date: string | null;
  items: Expense[];
  /** Per-currency subtotal for this day, in CURRENCIES order. */
  subtotals: CurrencyTotal[];
};

/**
 * Groups expenses by day with per-currency subtotals. Most recent day first;
 * the undated bucket (legacy rows) always sorts last. Item order within a day
 * is preserved (callers pass newest-first).
 */
export function groupByDay(items: Expense[]): DayGroup[] {
  const order: (string | null)[] = [];
  const buckets = new Map<string | null, Expense[]>();
  for (const e of items) {
    const key = e.date ?? null;
    let bucket = buckets.get(key);
    if (!bucket) {
      bucket = [];
      buckets.set(key, bucket);
      order.push(key);
    }
    bucket.push(e);
  }
  order.sort((a, b) => {
    if (a === b) return 0;
    if (a === null) return 1; // undated last
    if (b === null) return -1;
    return a < b ? 1 : -1; // most recent date first
  });
  return order.map((date) => {
    const groupItems = buckets.get(date) ?? [];
    return { date, items: groupItems, subtotals: totalsByCurrency(groupItems) };
  });
}

/** Formats a numeric amount with Spanish grouping (no currency symbol). */
export function formatAmount(n: number): string {
  return new Intl.NumberFormat('es-ES', { maximumFractionDigits: 2 }).format(n);
}
