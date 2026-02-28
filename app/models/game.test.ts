import { describe, it, expect } from '@jest/globals';
import { Game } from './game';
import { GameState } from './game-state';

describe('Game model', () => {
  it('should derive period from periodDescriptor if period is not present', () => {
    const gameData = {
      id: 123,
      gameState: GameState.LIVE,
      periodDescriptor: {
        number: 2,
        periodType: 'REG',
        maxRegulationPeriods: 3,
      },
    };
    const game = new Game(gameData);
    expect(game.period).toBe(2);
  });

  it('should use period if it is present, even if periodDescriptor is present', () => {
    const gameData = {
      id: 123,
      gameState: GameState.LIVE,
      period: 3,
      periodDescriptor: {
        number: 2,
        periodType: 'REG',
        maxRegulationPeriods: 3,
      },
    };
    const game = new Game(gameData);
    expect(game.period).toBe(3);
  });

  it('should show Final/OT for games that ended in overtime', () => {
    const gameData = {
      id: 123,
      gameState: GameState.FINAL,
      period: 4,
      periodDescriptor: {
        number: 4,
        periodType: 'OT',
        maxRegulationPeriods: 3,
      },
    };
    const game = new Game(gameData);
    expect(game.statusString).toBe('Final/OT');
  });

  it('should show Final/SO for games that ended in shootout', () => {
    const gameData = {
      id: 124,
      gameState: GameState.FINAL,
      period: 5,
      periodDescriptor: {
        number: 5,
        periodType: 'SO',
        maxRegulationPeriods: 3,
      },
    };
    const game = new Game(gameData);
    expect(game.statusString).toBe('Final/SO');
  });

  describe('periodName', () => {
    it('should return Period X for regulation periods', () => {
      const game = new Game({ period: 1 });
      expect(game.periodName).toBe('Period 1');
    });

    it('should return OT for first overtime', () => {
      const game = new Game({ period: 4, regPeriods: 3 });
      expect(game.periodName).toBe('OT');
    });

    it('should return 2OT for second overtime', () => {
      const game = new Game({ period: 5, regPeriods: 3 });
      expect(game.periodName).toBe('2OT');
    });

    it('should return Shootout for shootout', () => {
      const game = new Game({
        period: 5,
        periodDescriptor: { number: 5, periodType: 'SO', maxRegulationPeriods: 3 },
      });
      expect(game.periodName).toBe('Shootout');
    });
  });
});
