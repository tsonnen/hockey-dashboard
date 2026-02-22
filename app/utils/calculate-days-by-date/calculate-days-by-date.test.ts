import { describe, it, expect } from '@jest/globals';
import { calculateDaysByDate } from './calculate-days-by-date';
import { jest } from '@jest/globals';

describe('Utils', () => {
  describe('calculateDaysByDate', () => {
    it('calculates days back and ahead correctly for past dates', () => {
      const expectedDaysBack = 10;
      const expectedDaysAhead = 0;

      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - expectedDaysBack);
      const { daysBack, daysAhead } = calculateDaysByDate(targetDate);

      expect(daysBack).toBe(expectedDaysBack);
      expect(daysAhead).toBe(expectedDaysAhead);
    });

    it('calculates days back and ahead correctly for future dates', () => {
      const expectedDaysBack = 0;
      const expectedDaysAhead = 10;

      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + expectedDaysAhead);
      const { daysBack, daysAhead } = calculateDaysByDate(targetDate);

      expect(daysBack).toBe(expectedDaysBack);
      expect(daysAhead).toBe(expectedDaysAhead);
    });

    it('handles past daylight savings time change correctly', () => {
      jest.useFakeTimers().setSystemTime(new Date('2019-11-04'));
      const targetDate = new Date('2019-11-02');
      const { daysBack, daysAhead } = calculateDaysByDate(targetDate);
      expect(daysBack).toBe(2);
      expect(daysAhead).toBe(0);
    });

    it('handles future daylight savings time change correctly', () => {
      jest.useFakeTimers().setSystemTime(new Date('2026-03-07'));
      const targetDate = new Date('2026-03-09');
      const { daysBack, daysAhead } = calculateDaysByDate(targetDate);
      expect(daysBack).toBe(0);
      expect(daysAhead).toBe(2);
    });

    it('handles the specific reported case: 2026-02-22 seen from 2026-02-21', () => {
      // Mock "today" as 2026-02-21 17:35:13-08:00
      // In UTC, this is Feb 22, 01:35:13.
      jest.useFakeTimers().setSystemTime(new Date('2026-02-21T17:35:13-08:00'));

      // This mimics route.ts logic:
      const dateParam = '2026-02-22';
      const parsed = new Date(Date.parse(dateParam)); // 2026-02-22T00:00:00Z
      const inputToUtil = new Date(
        parsed.getUTCFullYear(),
        parsed.getUTCMonth(),
        parsed.getUTCDate(),
      ); // 2026-02-22 00:00:00 LOCAL

      const { daysBack, daysAhead } = calculateDaysByDate(inputToUtil);

      // Even if UTC is already Feb 22, relative to the local context (Feb 21),
      // the date is still 1 day ahead.
      expect(daysBack).toBe(0);
      expect(daysAhead).toBe(1);
    });

    it('returns zeros for the same day regardless of time', () => {
      const todayBase = '2026-02-21';
      const targetDate = new Date(2026, 1, 21); // Feb 21 Local Midnight

      // Morning
      jest.useFakeTimers().setSystemTime(new Date(`${todayBase}T08:00:00`));
      let result = calculateDaysByDate(targetDate);
      expect(result.daysBack).toBe(0);
      expect(result.daysAhead).toBe(0);

      // Night
      jest.useFakeTimers().setSystemTime(new Date(`${todayBase}T23:59:59`));
      result = calculateDaysByDate(targetDate);
      expect(result.daysBack).toBe(0);
      expect(result.daysAhead).toBe(0);
    });
  });
});
