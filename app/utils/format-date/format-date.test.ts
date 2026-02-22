import { formatDate } from './format-date';
import { describe, it, expect } from '@jest/globals';

describe('formatDate', () => {
  it('formats a date string correctly', () => {
    // Note: The specific output of toLocaleDateString can depend on the locale.
    // In a test environment, it's usually US English.
    const date = '2026-02-21T17:54:05-08:00';
    const formatted = formatDate(date);
    expect(formatted).toContain('Saturday');
    expect(formatted).toContain('February 21');
    expect(formatted).toContain('2026');
  });

  it('handles empty input', () => {
    expect(formatDate('')).toBe('');
  });

  it('handles invalid date input', () => {
    const formatted = formatDate('invalid-date');
    // For an invalid date, toLocaleDateString usually returns "Invalid Date"
    expect(formatted).toBe('Invalid Date');
  });
});
