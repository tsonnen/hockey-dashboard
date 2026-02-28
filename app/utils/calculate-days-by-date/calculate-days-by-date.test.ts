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
  });
});
