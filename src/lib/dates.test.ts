import { describe, expect, it } from 'vitest';
import {
  addDays,
  daysBetween,
  formatDateRange,
  formatLongDate,
  todayInTimezone,
} from './dates';

describe('dates', () => {
  it('formats a long Spanish date (UTC-anchored, no drift)', () => {
    expect(formatLongDate('2026-06-14')).toBe('domingo 14 de junio');
  });

  it('formats a same-month range compactly', () => {
    expect(formatDateRange('2026-06-13', '2026-06-28')).toBe('13 — 28 de junio de 2026');
  });

  it('computes whole-day differences', () => {
    expect(daysBetween('2026-06-13', '2026-06-28')).toBe(15);
    expect(addDays('2026-06-13', 1)).toBe('2026-06-14');
  });

  it('resolves "today" in the destination timezone', () => {
    // 2026-06-14 23:30 UTC is already 2026-06-15 in Tokyo (UTC+9).
    const now = new Date('2026-06-14T23:30:00Z');
    expect(todayInTimezone('Asia/Tokyo', now)).toBe('2026-06-15');
    expect(todayInTimezone('UTC', now)).toBe('2026-06-14');
  });
});
