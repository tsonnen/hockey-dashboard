import { describe, it, expect } from '@jest/globals';
import {
  convertHockeyTechGamePreview,
  type HockeyTechGamePreview,
} from './hockeytech-game-preview';

describe('hockeytech-game-preview', () => {
  describe('convertHockeyTechGamePreview', () => {
    const mockPreviewData: HockeyTechGamePreview = {
      GC: {
        Preview: {
          home_team: {
            team_id: '1',
            name: 'Test Home Hawks',
            city: 'Home City',
            team_code: 'HOM',
            nickname: 'Hawks',
            leadingScorers: [
              {
                player_id: '101',
                first_name: 'John',
                last_name: 'Doe',
                jersey_number: '99',
                goals: 25,
                assists: 30,
                points: 55,
                penalty_minutes: 10,
                rookie: '0',
              },
              {
                player_id: '102',
                first_name: 'Jane',
                last_name: 'Smith',
                jersey_number: '88',
                goals: 20,
                assists: 35,
                points: 55,
                penalty_minutes: 5,
                rookie: '0',
              },
            ],
          },
          visitor_team: {
            team_id: '2',
            name: 'Test Away Eagles',
            city: 'Away City',
            team_code: 'AWY',
            nickname: 'Eagles',
            leadingScorers: [
              {
                player_id: '201',
                first_name: 'Bob',
                last_name: 'Johnson',
                jersey_number: '77',
                goals: 30,
                assists: 25,
                points: 55,
                penalty_minutes: 15,
                rookie: '0',
              },
              {
                player_id: '202',
                first_name: 'Alice',
                last_name: 'Brown',
                jersey_number: '66',
                goals: 15,
                assists: 40,
                points: 55,
                penalty_minutes: 8,
                rookie: '1',
              },
            ],
          },
          current_season: {
            id: '2025',
            season_name: '2025-26 Regular Season',
          },
        },
      },
    };

    it('converts preview data correctly', () => {
      const result = convertHockeyTechGamePreview(mockPreviewData, 'ohl');

      expect(result.season).toBe(2025);
      expect(result.gameType).toBeUndefined();
      expect(result.skaterComparison).toBeDefined();
      expect(result.goalieComparison).toBeUndefined();
    });

    it('creates skater comparison with correct context', () => {
      const result = convertHockeyTechGamePreview(mockPreviewData, 'ohl');

      expect(result.skaterComparison?.contextLabel).toBe('2025-26 Regular Season');
      expect(result.skaterComparison?.contextSeason).toBe(2025);
    });

    it('identifies goal leaders correctly', () => {
      const result = convertHockeyTechGamePreview(mockPreviewData, 'ohl');
      const goalCategory = result.skaterComparison?.leaders.find((l) => l.category === 'Goals');

      expect(goalCategory).toBeDefined();
      expect(goalCategory?.homeLeader.playerId).toBe(101); // John Doe with 25 goals
      expect(goalCategory?.homeLeader.value).toBe('25');
      expect(goalCategory?.awayLeader.playerId).toBe(201); // Bob Johnson with 30 goals
      expect(goalCategory?.awayLeader.value).toBe('30');
    });

    it('identifies assist leaders correctly', () => {
      const result = convertHockeyTechGamePreview(mockPreviewData, 'ohl');
      const assistCategory = result.skaterComparison?.leaders.find((l) => l.category === 'Assists');

      expect(assistCategory).toBeDefined();
      expect(assistCategory?.homeLeader.playerId).toBe(102); // Jane Smith with 35 assists
      expect(assistCategory?.homeLeader.value).toBe('35');
      expect(assistCategory?.awayLeader.playerId).toBe(202); // Alice Brown with 40 assists
      expect(assistCategory?.awayLeader.value).toBe('40');
    });

    it('identifies point leaders correctly', () => {
      const result = convertHockeyTechGamePreview(mockPreviewData, 'ohl');
      const pointCategory = result.skaterComparison?.leaders.find((l) => l.category === 'Points');

      expect(pointCategory).toBeDefined();
      // All players have 55 points, so it should pick the first one after sorting
      expect(pointCategory?.homeLeader.playerId).toBeGreaterThan(0);
      expect(pointCategory?.homeLeader.value).toBe('55');
      expect(pointCategory?.awayLeader.value).toBe('55');
    });

    it('formats player names correctly', () => {
      const result = convertHockeyTechGamePreview(mockPreviewData, 'ohl');
      const goalCategory = result.skaterComparison?.leaders.find((l) => l.category === 'Goals');

      expect(goalCategory?.homeLeader.name.default).toBe('John Doe');
      expect(goalCategory?.awayLeader.name.default).toBe('Bob Johnson');
    });

    it('generates correct headshot URLs', () => {
      const result = convertHockeyTechGamePreview(mockPreviewData, 'ohl');
      const goalCategory = result.skaterComparison?.leaders.find((l) => l.category === 'Goals');

      expect(goalCategory?.homeLeader.headshot).toBe(
        'https://assets.leaguestat.com/ohl/120x160/101.jpg',
      );
      expect(goalCategory?.awayLeader.headshot).toBe(
        'https://assets.leaguestat.com/ohl/120x160/201.jpg',
      );
    });

    it('includes sweater numbers', () => {
      const result = convertHockeyTechGamePreview(mockPreviewData, 'ohl');
      const goalCategory = result.skaterComparison?.leaders.find((l) => l.category === 'Goals');

      expect(goalCategory?.homeLeader.sweaterNumber).toBe(99);
      expect(goalCategory?.awayLeader.sweaterNumber).toBe(77);
    });

    it('creates all three stat categories', () => {
      const result = convertHockeyTechGamePreview(mockPreviewData, 'ohl');

      expect(result.skaterComparison?.leaders).toHaveLength(3);
      const categories = result.skaterComparison?.leaders.map((l) => l.category);
      expect(categories).toContain('Goals');
      expect(categories).toContain('Assists');
      expect(categories).toContain('Points');
    });
  });
});
