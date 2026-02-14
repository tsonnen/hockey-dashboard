import type { Game } from '@/app/models/game';
import { GameSummary } from '@/app/models/game-summary';
import { Team } from '@/app/models/team';
import { mapHockeyTechGameState, mapHockeyTechTeam } from './hockeytech-mapper';

export interface HockeyTechPlayer {
  info: {
    id: number;
    firstName: string;
    lastName: string;
    jerseyNumber: number;
    position: string;
    birthDate: string;
    playerImageURL: string;
  };
  stats: {
    goals: number;
    assists: number;
    points: number;
    penaltyMinutes: number;
    plusMinus: number;
    faceoffAttempts: number;
    faceoffWins: number;
    shots?: number;
    hits?: number;
    blockedShots?: number;
    toi?: string;
    timeOnIce?: string;
    shotsAgainst?: number;
    goalsAgainst?: number;
    saves?: number;
  };
  starting: number;
  status: string;
}

export interface HockeyTechTeam {
  info: {
    id: number;
    name: string;
    city: string;
    nickname: string;
    abbreviation: string;
    logo: string;
    divisionName: string;
  };
  stats: {
    shots: number;
    goals: number;
    hits: number;
    powerPlayGoals: number;
    powerPlayOpportunities: number;
    goalCount: number;
    assistCount: number;
    penaltyMinuteCount: number;
    infractionCount: number;
  };
  media: {
    audioUrl: string;
    videoUrl: string;
    webcastUrl: string;
  };
  coaches: {
    firstName: string;
    lastName: string;
    role: string;
  }[];
  skaters: HockeyTechPlayer[];
  goalies: HockeyTechPlayer[];
  goalieLog: {
    info: HockeyTechPlayer['info'];
    stats: HockeyTechPlayer['stats'];
    periodStart: { id: string; shortName: string; longName: string };
    timeStart: string;
    periodEnd: { id: string; shortName: string; longName: string };
    timeEnd: string;
    result: string;
  }[];
  seasonStats: {
    seasonId: string | null;
    teamRecord: {
      wins: number;
      losses: number;
      ties: number;
      OTWins: number;
      OTLosses: number;
      SOLosses: number;
      formattedRecord: string;
    };
  };
}

export interface HockeyTechGoal {
  game_goal_id: string;
  team: HockeyTechTeam['info'];
  period: { id: string; shortName: string; longName: string };
  time: string;
  scorerGoalNumber: string;
  scoredBy: HockeyTechPlayer['info'];
  assists: HockeyTechPlayer['info'][];
  assistNumbers: string[];
  properties: {
    isPowerPlay: string;
    isShortHanded: string;
    isEmptyNet: string;
    isPenaltyShot: string;
    isInsuranceGoal: string;
    isGameWinningGoal: string;
  };
  plus_players: HockeyTechPlayer['info'][];
  minus_players: HockeyTechPlayer['info'][];
}

export interface HockeyTechPenalty {
  game_penalty_id: number;
  period: { id: string; shortName: string; longName: string };
  time: string;
  againstTeam: HockeyTechTeam['info'];
  minutes: number;
  description: string;
  ruleNumber: string;
  takenBy?: HockeyTechPlayer['info'];
  servedBy: HockeyTechPlayer['info'];
  isPowerPlay: boolean;
  isBench: boolean;
}

export interface HockeyTechPeriod {
  info: { id: string; shortName: string; longName: string };
  stats: {
    homeGoals: string;
    homeShots: string;
    visitingGoals: string;
    visitingShots: string;
  };
  goals: HockeyTechGoal[];
  penalties: HockeyTechPenalty[];
}

export interface HockeyTechGameDetails {
  details: {
    id: number;
    date: string;
    gameNumber: string;
    venue: string;
    attendance: number;
    startTime: string;
    endTime: string;
    duration: string;
    gameReportUrl: string;
    textBoxscoreUrl: string;
    ticketsUrl: string;
    started: string;
    final: string;
    publicNotes: string;
    status: string;
    seasonId: string;
    floHockeyUrl: string;
    GameDateISO8601: string;
    mvpType: number;
    htvGameId: number;
  };
  referees: {
    firstName: string;
    lastName: string;
    jerseyNumber: number;
    role: string;
  }[];
  linesmen: {
    firstName: string;
    lastName: string;
    jerseyNumber: number;
    role: string;
  }[];
  mostValuablePlayers: {
    team: HockeyTechTeam['info'];
    player: HockeyTechPlayer;
    isGoalie: boolean;
    playerImage: string;
    homeTeam: number;
  }[];
  hasShootout: boolean;
  homeTeam: HockeyTechTeam;
  visitingTeam: HockeyTechTeam;
  periods: HockeyTechPeriod[];
  penaltyShots: {
    homeTeam: Team[];
    visitingTeam: Team[];
  };
  featuredPlayer: {
    team: HockeyTechTeam['info'];
    player: HockeyTechPlayer;
    isGoalie: boolean;
    playerImage: string | null;
    homeTeam: number;
    sponsor: {
      name: string | null | undefined;
      image: string | null | undefined;
    };
  };
}

export function convertHockeyTechGameDetails(
  data: HockeyTechGameDetails,
  league: string,
): Partial<Game> {
  const currentScore = { home: 0, away: 0 };
  const periodStats = data.periods.map((period) => {
    return {
      periodDescriptor: {
        number: Number.parseInt(period.info.id),
        periodType: period.info.longName,
        maxRegulationPeriods: 3,
      },
      goals: period.goals.map((goal) => {
        const isHome = goal.team.id === data.homeTeam.info.id;
        if (isHome) {
          currentScore.home++;
        } else {
          currentScore.away++;
        }
        return {
          situationCode: goal.properties.isPowerPlay === '1' ? 'PP' : 'EV',
          eventId: Number.parseInt(goal.game_goal_id),
          strength: goal.properties.isPowerPlay === '1' ? 'PP' : 'EV',
          playerId: goal.scoredBy.id,
          firstName: { default: goal.scoredBy.firstName },
          lastName: { default: goal.scoredBy.lastName },
          name: { default: `${goal.scoredBy.firstName} ${goal.scoredBy.lastName}` },
          teamAbbrev: { default: goal.team.abbreviation },
          headshot: goal.scoredBy.playerImageURL,
          goalsToDate: Number.parseInt(goal.scorerGoalNumber),
          awayScore: currentScore.away,
          homeScore: currentScore.home,
          timeInPeriod: goal.time,
          shotType: '',
          goalModifier: '',
          assists: goal.assists.map((assist) => ({
            playerId: assist.id,
            firstName: { default: assist.firstName },
            lastName: { default: assist.lastName },
            name: { default: `${assist.firstName} ${assist.lastName}` },
          })),
          pptReplayUrl: '',
          homeTeamDefendingSide: '',
          isHome,
        };
      }),
      homeShots: Number.parseInt(period.stats.homeShots),
      awayShots: Number.parseInt(period.stats.visitingShots),
    };
  });

  let awaySOG = 0;
  let homeSOG = 0;
  for (const period of periodStats) {
    awaySOG += period.awayShots;
    homeSOG += period.homeShots;
  }

  // Parse clock and period from details.status
  let clock:
    | { timeRemaining: string; secondsRemaining: number; running: boolean; inIntermission: boolean }
    | undefined;
  let period: number | undefined;
  if (data.details.status) {
    // Pattern: "In Progress (MM:SS remaining in {period})"
    const timeMatch = data.details.status.match(/\((\d+:\d+) remaining/);
    const periodMatch = data.details.status.match(/remaining in (\w+)\)/);

    if (timeMatch) {
      const timeRemaining = timeMatch[1];
      const [minutes, seconds] = timeRemaining.split(':').map(Number);
      clock = {
        timeRemaining,
        secondsRemaining: minutes * 60 + seconds,
        running: true,
        inIntermission: false,
      };
    }

    if (periodMatch) {
      const periodStr = periodMatch[1];
      // Convert period string to number: 1st→1, 2nd→2, 3rd→3, OT→4, 2OT→5, etc.
      if (periodStr === 'OT') {
        period = 4;
      } else if (/^\d+OT$/.test(periodStr)) {
        const overtimeNumber = Number.parseInt(periodStr);
        period = 3 + overtimeNumber;
      } else {
        // Extract number from "1st", "2nd", "3rd"
        const periodNum = Number.parseInt(periodStr);
        if (!Number.isNaN(periodNum)) {
          period = periodNum;
        }
      }
    }
  }

  return {
    id: data.details.id,
    season: Number.parseInt(data.details.seasonId),
    gameType: undefined,
    gameDate: data.details.date,
    venue: { default: data.details.venue },
    neutralSite: false,
    startTimeUTC: data.details.GameDateISO8601,
    gameState: mapHockeyTechGameState(data.details.status, data.details.GameDateISO8601),
    clock,
    period,
    homeTeam: mapHockeyTechTeam(data.homeTeam.info, { ...data.homeTeam.stats, shots: homeSOG }),
    awayTeam: mapHockeyTechTeam(data.visitingTeam.info, { ...data.visitingTeam.stats, shots: awaySOG }),
    ticketsLink: data.details.ticketsUrl,
    league,
    summary: new GameSummary({
      scoring: periodStats,
      shootout: [],
      threeStars: data.mostValuablePlayers.map((mvp, index) => ({
        playerId: mvp.player.info.id,
        firstName: { default: mvp.player.info.firstName },
        lastName: { default: mvp.player.info.lastName },
        name: {
          default: `${mvp.player.info.firstName} ${mvp.player.info.lastName}`,
        },
        star: index + 1,
        teamAbbrev: mvp.team.abbreviation,
        headshot: mvp.playerImage,
      })),
      penalties: data.periods.map((period) => ({
        periodDescriptor: {
          number: Number.parseInt(period.info.id),
          periodType: period.info.longName,
          maxRegulationPeriods: 3,
        },
        penalties: period.penalties.map((penalty) => ({
          timeInPeriod: penalty.time,
          type: penalty.description,
          duration: penalty.minutes,
          committedByPlayer: {
            default: `${penalty.takenBy?.firstName} ${penalty.takenBy?.lastName}`,
          },
          teamAbbrev: { default: penalty.againstTeam.abbreviation },
          drawnBy: { default: '' },
          descKey: penalty.description,
        })),
      })),
    }),
  };
}
