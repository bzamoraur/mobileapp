import { describe, expect, it } from 'vitest';
import {
  breakdownForCurrency,
  dominantCurrency,
  groupByDay,
  migrateExpenses,
  totalsByCurrency,
  toCategory,
  type Expense,
} from './expenses';

const e = (over: Partial<Expense> & Pick<Expense, 'id' | 'amount' | 'currency'>): Expense => ({
  concept: 'x',
  category: 'otros',
  ...over,
});

describe('migrateExpenses', () => {
  it('defaults missing category to "otros" and keeps no date', () => {
    const [row] = migrateExpenses([{ id: '1', concept: 'Cena', amount: 10, currency: 'EUR' }]);
    expect(row).toEqual({ id: '1', concept: 'Cena', amount: 10, currency: 'EUR', category: 'otros' });
    expect(row && 'date' in row).toBe(false);
  });

  it('coerces unknown categories to "otros" and preserves valid ones + date', () => {
    const rows = migrateExpenses([
      { id: '1', concept: 'a', amount: 5, currency: 'USD', category: 'bogus', date: '2026-06-20' },
      { id: '2', concept: 'b', amount: 6, currency: 'USD', category: 'comida' },
    ]);
    expect(rows[0]).toMatchObject({ category: 'otros', date: '2026-06-20' });
    expect(rows[1]).toMatchObject({ category: 'comida' });
  });

  it('drops malformed rows and tolerates non-arrays', () => {
    expect(migrateExpenses(null)).toEqual([]);
    expect(migrateExpenses('nope')).toEqual([]);
    const rows = migrateExpenses([
      { id: '1', concept: 'ok', amount: 3, currency: 'EUR' },
      { id: 2, concept: 'bad id', amount: 3, currency: 'EUR' },
      { id: '3', amount: 3, currency: 'EUR' },
      { id: '4', concept: 'NaN', amount: Number.NaN, currency: 'EUR' },
      null,
    ]);
    expect(rows.map((r) => r.id)).toEqual(['1']);
  });
});

describe('toCategory', () => {
  it('narrows known values, defaults the rest', () => {
    expect(toCategory('propinas')).toBe('propinas');
    expect(toCategory(undefined)).toBe('otros');
    expect(toCategory('???')).toBe('otros');
  });
});

describe('totalsByCurrency', () => {
  it('sums per currency, omits empties, keeps EUR/USD/TZS order', () => {
    const items = [
      e({ id: '1', amount: 10, currency: 'TZS' }),
      e({ id: '2', amount: 5, currency: 'EUR' }),
      e({ id: '3', amount: 2, currency: 'EUR' }),
    ];
    expect(totalsByCurrency(items)).toEqual([
      { currency: 'EUR', total: 7 },
      { currency: 'TZS', total: 10 },
    ]);
  });
});

describe('dominantCurrency', () => {
  it('picks the currency with the most spend', () => {
    const items = [
      e({ id: '1', amount: 1000, currency: 'TZS' }),
      e({ id: '2', amount: 50, currency: 'EUR' }),
    ];
    expect(dominantCurrency(items)).toBe('TZS');
    expect(dominantCurrency([])).toBeUndefined();
  });
});

describe('breakdownForCurrency', () => {
  it('returns category shares largest-first for one currency only', () => {
    const items = [
      e({ id: '1', amount: 30, currency: 'EUR', category: 'comida' }),
      e({ id: '2', amount: 10, currency: 'EUR', category: 'propinas' }),
      e({ id: '3', amount: 999, currency: 'USD', category: 'compras' }),
    ];
    const slices = breakdownForCurrency(items, 'EUR');
    expect(slices.map((s) => s.category.id)).toEqual(['comida', 'propinas']);
    expect(slices[0]?.share).toBeCloseTo(75);
    expect(slices[1]?.share).toBeCloseTo(25);
  });

  it('is empty when the currency has no spend', () => {
    expect(breakdownForCurrency([], 'EUR')).toEqual([]);
  });
});

describe('groupByDay', () => {
  it('groups by day, most recent first, undated bucket last, with subtotals', () => {
    const items = [
      e({ id: '1', amount: 5, currency: 'EUR', date: '2026-06-21' }),
      e({ id: '2', amount: 3, currency: 'EUR', date: '2026-06-20' }),
      e({ id: '3', amount: 2, currency: 'EUR', date: '2026-06-21' }),
      e({ id: '4', amount: 9, currency: 'USD' }), // legacy / undated
    ];
    const groups = groupByDay(items);
    expect(groups.map((g) => g.date)).toEqual(['2026-06-21', '2026-06-20', null]);
    expect(groups[0]?.subtotals).toEqual([{ currency: 'EUR', total: 7 }]);
    expect(groups[2]?.date).toBeNull();
    expect(groups[2]?.subtotals).toEqual([{ currency: 'USD', total: 9 }]);
  });
});
