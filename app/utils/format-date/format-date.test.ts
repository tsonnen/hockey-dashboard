import { formatDate, formatLocalDate, parseLocalDate } from './format-date';
import { describe, it, expect } from '@jest/globals';

describe('formatDate', () => {
  it('formats a date string correctly', () => {
    // Using a date that is unlikely to shift to another day in most timezones for this test
    const date = '2026-02-21T12:00:00Z';
    const formatted = formatDate(date);
    // Since we don't know the test environment locale/timezone for sure,
    // we check for parts that should be present.
    expect(formatted).toContain('2026');
    expect(formatted).toContain('February');
  });

  it('handles empty input', () => {
    expect(formatDate('')).toBe('');
  });

  it('handles invalid date input', () => {
    const formatted = formatDate('invalid-date');
    expect(formatted).toBe('Invalid Date');
  });
});

describe('formatLocalDate', () => {
  it('formats a Date object to local ISO date string', () => {
    const date = new Date(2026, 1, 21); // February 21, 2026
    expect(formatLocalDate(date)).toBe('2026-02-21');
  });

  it('formats a UTC string to local ISO date string', () => {
    // Create a date that might be different in UTC vs local
    // If we are in UTC+4, 2026-02-21T22:00:00Z is 2026-02-22T02:00:00+04:00
    const dateStr = '2026-02-21T22:00:00Z';
    const d = new Date(dateStr);
    const expected = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    expect(formatLocalDate(dateStr)).toBe(expected);
  });

  it('handles single digit months and days', () => {
    const date = new Date(2026, 0, 5); // January 5, 2026
    expect(formatLocalDate(date)).toBe('2026-01-05');
  });
});

describe('parseLocalDate', () => {
  it('parses a date string correctly as local midnight', () => {
    const dateStr = '2026-02-28';
    const parsed = parseLocalDate(dateStr);
    expect(parsed.getFullYear()).toBe(2026);
    expect(parsed.getMonth()).toBe(1); // February is 1
    expect(parsed.getDate()).toBe(28);
    expect(parsed.getHours()).toBe(0);
  });

  it('handles single digit months and days', () => {
    const dateStr = '2026-01-05';
    const parsed = parseLocalDate(dateStr);
    expect(parsed.getFullYear()).toBe(2026);
    expect(parsed.getMonth()).toBe(0);
    expect(parsed.getDate()).toBe(5);
  });
});
