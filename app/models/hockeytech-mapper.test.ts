import { describe, it, expect } from '@jest/globals';
import { GameState } from './game-state';
import { mapHockeyTechGameState, mapHockeyTechTeam } from './hockeytech-mapper';

describe('hockeytech-mapper', () => {
  describe('mapHockeyTechGameState', () => {
    const futureStartTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24h from now
    const pastStartTime = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(); // 2h ago
    const justStartedTime = new Date(Date.now() - 10 * 60 * 1000).toISOString(); // 10 mins ago
    const soonStartTime = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 mins from now

    it('maps numeric status 1 to FUTURE', () => {
      expect(mapHockeyTechGameState('1', futureStartTime)).toBe(GameState.FUTURE);
      expect(mapHockeyTechGameState('1', pastStartTime)).toBe(GameState.FUTURE);
    });

    it('maps numeric status 3 to OFFICIAL', () => {
      expect(mapHockeyTechGameState('3', pastStartTime)).toBe(GameState.OFFICIAL);
    });

    it('maps numeric status 4 to FINAL', () => {
      expect(mapHockeyTechGameState('4', pastStartTime)).toBe(GameState.FINAL);
    });

    it('maps numeric status 2 to LIVE if time is appropriate', () => {
      expect(mapHockeyTechGameState('2', justStartedTime)).toBe(GameState.LIVE);
      expect(mapHockeyTechGameState('2', soonStartTime)).toBe(GameState.LIVE); // Within buffer
    });

    it('maps numeric status 2 to FUTURE if too far in advance', () => {
      expect(mapHockeyTechGameState('2', futureStartTime)).toBe(GameState.FUTURE);
    });

    it('maps "Scheduled" to FUTURE', () => {
      expect(mapHockeyTechGameState('Scheduled', futureStartTime)).toBe(GameState.FUTURE);
    });

    it('maps "Official" to OFFICIAL', () => {
      expect(mapHockeyTechGameState('Official', pastStartTime)).toBe(GameState.OFFICIAL);
    });

    it('maps "Final" to FINAL', () => {
      expect(mapHockeyTechGameState('Final', pastStartTime)).toBe(GameState.FINAL);
      expect(mapHockeyTechGameState('Final OT', pastStartTime)).toBe(GameState.FINAL);
    });

    it('maps "In Progress" to LIVE if time is appropriate', () => {
      expect(mapHockeyTechGameState('In Progress (12:34 remaining in 1st)', justStartedTime)).toBe(GameState.LIVE);
    });

    it('maps "In Progress" to FUTURE if too far in advance', () => {
      expect(mapHockeyTechGameState('In Progress', futureStartTime)).toBe(GameState.FUTURE);
    });

    it('derives FUTURE for upcoming games with unknown status', () => {
      expect(mapHockeyTechGameState('Unknown', futureStartTime)).toBe(GameState.FUTURE);
    });

    it('derives LIVE for past games with unknown status', () => {
      expect(mapHockeyTechGameState('Unknown', pastStartTime)).toBe(GameState.LIVE);
    });
  });

  describe('mapHockeyTechTeam', () => {
    it('correctly maps team info and stats', () => {
      const info = {
        id: 1,
        city: 'City',
        nickname: 'Nicks',
        name: 'Full Name',
        logo: '/logo.png',
        abbreviation: 'ABC',
      };
      const stats = { goals: 5, shots: 30 };
      const team = mapHockeyTechTeam(info, stats);

      expect(team.id).toBe(1);
      expect(team.score).toBe(5);
      expect(team.sog).toBe(30);
      expect(team.abbrev).toBe('ABC');
      expect(team.name?.default).toBe('Full Name');
    });

    it('handles string IDs and scores', () => {
      const info = { id: '123', nickname: 'Nicks' };
      const stats = { goals: '3', shots: '25' };
      const team = mapHockeyTechTeam(info, stats);

      expect(team.id).toBe(123);
      expect(team.score).toBe(3);
      expect(team.sog).toBe(25);
    });

    it('generates abbreviation if missing', () => {
      const info = { id: 1, nickname: 'Hawks' };
      const team = mapHockeyTechTeam(info, { goals: 0 });
      expect(team.abbrev).toBe('HAW');
    });
  });
});
