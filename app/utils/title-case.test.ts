import { describe, it, expect } from '@jest/globals';
import { titleCase } from './title-case';

describe('titleCase', () => {
  it('converts lowercase string to title case', () => {
    expect(titleCase('hello world')).toBe('Hello World');
  });

  it('converts uppercase string to title case', () => {
    expect(titleCase('HELLO WORLD')).toBe('Hello World');
  });

  it('converts mixed case string to title case', () => {
    expect(titleCase('hElLo WoRlD')).toBe('Hello World');
  });

  it('handles single word', () => {
    expect(titleCase('goals')).toBe('Goals');
  });

  it('handles multiple spaces', () => {
    expect(titleCase('hello  world')).toBe('Hello  World');
  });

  it('handles empty string', () => {
    expect(titleCase('')).toBe('');
  });

  it('handles string with numbers', () => {
    expect(titleCase('player 99 stats')).toBe('Player 99 Stats');
  });

  it('converts common stat categories', () => {
    expect(titleCase('goals')).toBe('Goals');
    expect(titleCase('assists')).toBe('Assists');
    expect(titleCase('points')).toBe('Points');
  });

  it('handles hyphenated words', () => {
    expect(titleCase('power-play goals')).toBe('Power-play Goals');
  });

  it('handles string with special characters', () => {
    expect(titleCase('goals/assists')).toBe('Goals/assists');
  });

  it('preserves apostrophes', () => {
    expect(titleCase("player's stats")).toBe("Player's Stats");
  });
});
