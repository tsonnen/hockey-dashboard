import { describe, it, expect } from '@jest/globals';
import {
  convertHockeyTechGameDetails,
  type HockeyTechGameDetails,
} from './hockeytech-game-details';
import { GameState } from './game-state';

describe('hockeytech-game-details', () => {
  describe('convertHockeyTechGameDetails', () => {
    const mockHockeyTechData: HockeyTechGameDetails = {
      details: {
        id: 12_345,
        date: '2026-01-02',
        gameNumber: '1',
        venue: 'Test Arena',
        attendance: 5000,
        startTime: '7:00 PM',
        endTime: '9:30 PM',
        duration: '2:30',
        gameReportUrl: 'https://example.com/report',
        textBoxscoreUrl: 'https://example.com/boxscore',
        ticketsUrl: 'https://example.com/tickets',
        started: '1',
        final: '0',
        publicNotes: '',
        status: 'Scheduled',
        seasonId: '2025',
        floHockeyUrl: '',
        GameDateISO8601: '2026-01-02T19:00:00Z',
        mvpType: 0,
        htvGameId: 0,
      },
      referees: [],
      linesmen: [],
      mostValuablePlayers: [
        {
          team: {
            id: 1,
            name: 'Test Home',
            city: 'Home City',
            nickname: 'Hawks',
            abbreviation: 'HOM',
            logo: '/home-logo.png',
            divisionName: 'Test Division',
          },
          player: {
            info: {
              id: 101,
              firstName: 'John',
              lastName: 'Doe',
              jerseyNumber: 99,
              position: 'C',
              birthDate: '2000-01-01',
              playerImageURL: '/player1.jpg',
            },
            stats: {
              goals: 2,
              assists: 1,
              points: 3,
              penaltyMinutes: 0,
              plusMinus: 2,
              faceoffAttempts: 10,
              faceoffWins: 6,
            },
            starting: 0,
            status: '',
          },
          isGoalie: false,
          playerImage: '/player1.jpg',
          homeTeam: 1,
        },
      ],
      hasShootout: false,
      homeTeam: {
        info: {
          id: 1,
          name: 'Test Home',
          city: 'Home City',
          nickname: 'Hawks',
          abbreviation: 'HOM',
          logo: '/home-logo.png',
          divisionName: 'Test Division',
        },
        stats: {
          shots: 30,
          goals: 3,
          hits: 20,
          powerPlayGoals: 1,
          powerPlayOpportunities: 3,
          goalCount: 3,
          assistCount: 5,
          penaltyMinuteCount: 6,
          infractionCount: 3,
        },
        media: {
          audioUrl: '',
          videoUrl: '',
          webcastUrl: '',
        },
        coaches: [],
        skaters: [],
        goalies: [],
        goalieLog: [],
        seasonStats: {
          seasonId: '2025',
          teamRecord: {
            wins: 10,
            losses: 5,
            ties: 2,
            OTWins: 1,
            OTLosses: 1,
            SOLosses: 0,
            formattedRecord: '10-5-2',
          },
        },
      },
      visitingTeam: {
        info: {
          id: 2,
          name: 'Test Away',
          city: 'Away City',
          nickname: 'Eagles',
          abbreviation: 'AWY',
          logo: '/away-logo.png',
          divisionName: 'Test Division',
        },
        stats: {
          shots: 25,
          goals: 2,
          hits: 18,
          powerPlayGoals: 0,
          powerPlayOpportunities: 2,
          goalCount: 2,
          assistCount: 3,
          penaltyMinuteCount: 4,
          infractionCount: 2,
        },
        media: {
          audioUrl: '',
          videoUrl: '',
          webcastUrl: '',
        },
        coaches: [],
        skaters: [],
        goalies: [],
        goalieLog: [],
        seasonStats: {
          seasonId: '2025',
          teamRecord: {
            wins: 8,
            losses: 7,
            ties: 1,
            OTWins: 0,
            OTLosses: 2,
            SOLosses: 1,
            formattedRecord: '8-7-1',
          },
        },
      },
      periods: [
        {
          info: { id: '1', shortName: '1st', longName: '1st Period' },
          stats: {
            homeGoals: '1',
            homeShots: '10',
            visitingGoals: '0',
            visitingShots: '8',
          },
          goals: [
            {
              game_goal_id: '1',
              team: {
                id: 1,
                name: 'Test Home',
                city: 'Home City',
                nickname: 'Hawks',
                abbreviation: 'HOM',
                logo: '/home-logo.png',
                divisionName: 'Test Division',
              },
              period: { id: '1', shortName: '1st', longName: '1st Period' },
              time: '5:30',
              scorerGoalNumber: '15',
              scoredBy: {
                id: 101,
                firstName: 'John',
                lastName: 'Doe',
                jerseyNumber: 99,
                position: 'C',
                birthDate: '2000-01-01',
                playerImageURL: '/player1.jpg',
              },
              assists: [],
              assistNumbers: [],
              properties: {
                isPowerPlay: '0',
                isShortHanded: '0',
                isEmptyNet: '0',
                isPenaltyShot: '0',
                isInsuranceGoal: '0',
                isGameWinningGoal: '1',
              },
              plus_players: [],
              minus_players: [],
            },
          ],
          penalties: [],
        },
      ],
      penaltyShots: {
        homeTeam: [],
        visitingTeam: [],
      },
      featuredPlayer: {
        team: {
          id: 1,
          name: 'Test Home',
          city: 'Home City',
          nickname: 'Hawks',
          abbreviation: 'HOM',
          logo: '/home-logo.png',
          divisionName: 'Test Division',
        },
        player: {
          info: {
            id: 101,
            firstName: 'John',
            lastName: 'Doe',
            jerseyNumber: 99,
            position: 'C',
            birthDate: '2000-01-01',
            playerImageURL: '/player1.jpg',
          },
          stats: {
            goals: 2,
            assists: 1,
            points: 3,
            penaltyMinutes: 0,
            plusMinus: 2,
            faceoffAttempts: 10,
            faceoffWins: 6,
          },
          starting: 0,
          status: '',
        },
        isGoalie: false,
        playerImage: '/player1.jpg',
        homeTeam: 1,
        sponsor: {
          name: undefined,
          image: undefined,
        },
      },
    };

    it('converts scheduled game correctly', () => {
      const result = convertHockeyTechGameDetails(mockHockeyTechData, 'ohl');

      expect(result.id).toBe(12_345);
      expect(result.season).toBe(2025);
      expect(result.gameState).toBe(GameState.FUTURE);
      expect(result.league).toBe('ohl');
      expect(result.homeTeam?.abbrev).toBe('HOM');
      expect(result.awayTeam?.abbrev).toBe('AWY');
    });

    it('converts final game status correctly', () => {
      const finalData = {
        ...mockHockeyTechData,
        details: { ...mockHockeyTechData.details, status: 'Final' },
      };

      const result = convertHockeyTechGameDetails(finalData, 'ohl');
      expect(result.gameState).toBe(GameState.FINAL);
    });

    it('converts final OT game status correctly', () => {
      const finalOTData = {
        ...mockHockeyTechData,
        details: { ...mockHockeyTechData.details, status: 'Final OT' },
      };

      const result = convertHockeyTechGameDetails(finalOTData, 'ohl');
      expect(result.gameState).toBe(GameState.FINAL);
    });

    it('converts official game status correctly', () => {
      const officialData = {
        ...mockHockeyTechData,
        details: { ...mockHockeyTechData.details, status: 'Official' },
      };

      const result = convertHockeyTechGameDetails(officialData, 'ohl');
      expect(result.gameState).toBe(GameState.OFFICIAL);
    });

    it('converts live game with clock and period', () => {
      const liveData = {
        ...mockHockeyTechData,
        details: {
          ...mockHockeyTechData.details,
          status: 'In Progress (12:34 remaining in 2nd)',
        },
      };

      const result = convertHockeyTechGameDetails(liveData, 'ohl');
      expect(result.gameState).toBe(GameState.LIVE);
      expect(result.clock?.timeRemaining).toBe('12:34');
      expect(result.clock?.secondsRemaining).toBe(754);
      expect(result.clock?.running).toBe(true);
      expect(result.period).toBe(2);
    });

    it('converts overtime period correctly', () => {
      const overtimeData = {
        ...mockHockeyTechData,
        details: {
          ...mockHockeyTechData.details,
          status: 'In Progress (5:00 remaining in OT)',
        },
      };

      const result = convertHockeyTechGameDetails(overtimeData, 'ohl');
      expect(result.period).toBe(4);
    });

    it('converts goals with power play situation', () => {
      const ppGoalData = {
        ...mockHockeyTechData,
        periods: [
          {
            ...mockHockeyTechData.periods[0],
            goals: [
              {
                ...mockHockeyTechData.periods[0].goals[0],
                properties: {
                  ...mockHockeyTechData.periods[0].goals[0].properties,
                  isPowerPlay: '1',
                },
              },
            ],
          },
        ],
      };

      const result = convertHockeyTechGameDetails(ppGoalData, 'ohl');
      expect(result.summary?.scoring[0].goals[0].situationCode).toBe('PP');
      expect(result.summary?.scoring[0].goals[0].strength).toBe('PP');
    });

    it('calculates shots on goal correctly', () => {
      const result = convertHockeyTechGameDetails(mockHockeyTechData, 'ohl');
      expect(result.homeTeam?.sog).toBe(10);
      expect(result.awayTeam?.sog).toBe(8);
    });

    it('converts three stars correctly', () => {
      const result = convertHockeyTechGameDetails(mockHockeyTechData, 'ohl');
      expect(result.summary?.threeStars).toHaveLength(1);
      expect(result.summary?.threeStars[0].playerId).toBe(101);
      expect(result.summary?.threeStars[0].star).toBe(1);
    });

    it('handles game with no clock info', () => {
      const result = convertHockeyTechGameDetails(mockHockeyTechData, 'ohl');
      expect(result.clock).toBeUndefined();
      expect(result.period).toBeUndefined();
    });
  });
});
