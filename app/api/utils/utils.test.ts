import { describe, it, expect } from '@jest/globals';
import { calculateDaysByDate } from './utils';

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
  });
});
