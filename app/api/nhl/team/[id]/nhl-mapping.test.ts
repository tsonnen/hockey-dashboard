import { describe, it, expect } from '@jest/globals';
import { normalizeNhlPosition } from './mapping';

describe('NHL Position Mapping', () => {
  it('should normalize L to LW', () => {
    expect(normalizeNhlPosition('L')).toBe('LW');
  });

  it('should normalize R to RW', () => {
    expect(normalizeNhlPosition('R')).toBe('RW');
  });

  it('should preserve C, D, G', () => {
    expect(normalizeNhlPosition('C')).toBe('C');
    expect(normalizeNhlPosition('D')).toBe('D');
    expect(normalizeNhlPosition('G')).toBe('G');
  });

  it('should return original value for unknown positions', () => {
    expect(normalizeNhlPosition('X')).toBe('X');
  });
});
