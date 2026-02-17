import { formatTime } from './format-time';
import { describe, it, expect } from '@jest/globals';

describe('formatTime', () => {
  it('formats seconds correctly into MM:SS format', () => {
    expect(formatTime(125)).toBe('2:05');
  });

  it('pads single digit seconds with zero', () => {
    expect(formatTime(61)).toBe('1:01');
  });

  it('handles zero seconds', () => {
    expect(formatTime(0)).toBeUndefined();
  });

  it('handles undefined input', () => {
    expect(formatTime()).toBeUndefined();
  });

  it('handles exactly 60 seconds', () => {
    expect(formatTime(60)).toBe('1:00');
  });

  it('handles large values', () => {
    expect(formatTime(3661)).toBe('61:01');
  });

  it('rounds decimal seconds', () => {
    expect(formatTime(125.6)).toBe('2:06');
  });

  it('formats typical ice time values', () => {
    // 18:32 = 1112 seconds
    expect(formatTime(1112)).toBe('18:32');
  });
});
