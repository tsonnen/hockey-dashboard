import { describe, it, expect } from '@jest/globals';
import { processRoster, mapHtPlayer, HockeyTechRow } from './mapping';

describe('HockeyTech Roster Mapping', () => {
  describe('mapHtPlayer', () => {
    it('should split fullName into firstName and lastName correctly', () => {
      const p: HockeyTechRow = {
        player_id: 123,
        name: 'Cloutier, Rafaël',
        position: 'F',
      };
      const result = mapHtPlayer(p);
      expect(result.firstName.default).toBe('Cloutier');
      expect(result.lastName.default).toBe('Rafaël');
    });

    it('should handle name without comma', () => {
      const p: HockeyTechRow = {
        player_id: 456,
        name: 'Danny Dupont',
        position: 'F',
      };
      const result = mapHtPlayer(p);
      expect(result.firstName.default).toBe('Danny');
      expect(result.lastName.default).toBe('Dupont');
    });

    it('should use first_name and last_name if available', () => {
      const p: HockeyTechRow = {
        player_id: 789,
        first_name: 'John',
        last_name: 'Doe',
        position: 'D',
      };
      const result = mapHtPlayer(p);
      expect(result.firstName.default).toBe('John');
      expect(result.lastName.default).toBe('Doe');
    });

    it('should map person_id to id if player_id is missing', () => {
      const p: HockeyTechRow = {
        person_id: 999,
        name: 'Test Player',
        position: 'F',
      };
      const result = mapHtPlayer(p);
      expect(result.id).toBe(999);
    });

    it('should construct headshot URL if clientCode is provided', () => {
      const p: HockeyTechRow = {
        player_id: 21_651,
        name: 'Rafaël Cloutier',
        position: 'F',
      };
      const result = mapHtPlayer(p, 'lhjmq');
      expect(result.headshot).toBe('https://assets.leaguestat.com/lhjmq/240x240/21651.jpg');
    });

    it('should use face_image from API if available', () => {
      const p: HockeyTechRow = {
        player_id: 123,
        name: 'Test Player',
        position: 'F',
        face_image: 'https://example.com/custom.jpg',
      };
      const result = mapHtPlayer(p, 'lhjmq');
      expect(result.headshot).toBe('https://example.com/custom.jpg');
    });

    it('should normalize detailed positions correctly', () => {
      expect(mapHtPlayer({ position: 'LW' }).positionCode).toBe('LW');
      expect(mapHtPlayer({ position: 'RW' }).positionCode).toBe('RW');
      expect(mapHtPlayer({ position: 'C' }).positionCode).toBe('C');
      expect(mapHtPlayer({ position: 'D' }).positionCode).toBe('D');
      expect(mapHtPlayer({ position: 'G' }).positionCode).toBe('G');
      expect(mapHtPlayer({ position: 'Left Wing' }).positionCode).toBe('LW');
      expect(mapHtPlayer({ position: 'Right Wing' }).positionCode).toBe('RW');
      expect(mapHtPlayer({ position: 'Center' }).positionCode).toBe('C');
      expect(mapHtPlayer({ position: 'Defense' }).positionCode).toBe('D');
      expect(mapHtPlayer({ position: 'Right Defense' }).positionCode).toBe('RD');
      expect(mapHtPlayer({ position: 'Left Defense' }).positionCode).toBe('LD');
      expect(mapHtPlayer({ position: 'GARBAGE' }).positionCode).toBe('F');
      expect(mapHtPlayer({ position: 'Goalie' }).positionCode).toBe('G');
    });
  });

  describe('processRoster', () => {
    it('should filter out staff based on keywords', () => {
      const players: HockeyTechRow[] = [
        { player_id: 1, name: 'Player One', position: 'F' },
        { player_id: 2, name: 'Coach Smith', role: 'Head Coach' },
        { player_id: 3, name: 'Danny Dupont', role: 'General Manager' },
        { player_id: 4, name: 'Staff Member', role: 'Equipment Manager' },
      ];
      const statsMap = new Map<string, HockeyTechRow>();

      const result = processRoster(players, statsMap);

      expect(result.forwards).toHaveLength(1);
      expect(result.forwards[0].lastName.default).toBe('One');
      expect(result.goalies).toHaveLength(0);
    });

    it('should skip rows without an ID', () => {
      const players: HockeyTechRow[] = [{ name: 'No ID Player', position: 'F' }];
      const statsMap = new Map<string, HockeyTechRow>();
      const result = processRoster(players, statsMap);
      expect(result.forwards).toHaveLength(0);
    });
  });
});
