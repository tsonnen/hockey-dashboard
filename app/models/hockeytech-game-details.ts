import type { Game } from '@/app/models/game';
import { GameState } from '@/app/models/game-state';
import { GameSummary } from '@/app/models/game-summary';
import { Team } from '@/app/models/team';

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
      name: string | null;
      image: string | null;
    };
  };
}

function mapGameDetailsStatusToGameState(status: string): GameState {
  switch (status) {
    case 'Scheduled': {
      return GameState.FUTURE;
    }
    case 'In Progress': {
      return GameState.LIVE;
    }
    case 'Final': {
      return GameState.FINAL;
    }
    case 'Official': {
      return GameState.OFFICIAL;
    }
    default: {
      return GameState.FUTURE;
    }
  }
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

  return {
    id: data.details.id,
    season: Number.parseInt(data.details.seasonId),
    gameType: 2, // Regular season
    gameDate: data.details.date,
    venue: { default: data.details.venue },
    neutralSite: false,
    startTimeUTC: data.details.GameDateISO8601,
    gameState: mapGameDetailsStatusToGameState(data.details.status),
    homeTeam: new Team({
      id: data.homeTeam.info.id,
      placeName: { default: data.homeTeam.info.city },
      commonName: { default: data.homeTeam.info.nickname },
      name: { default: data.homeTeam.info.name },
      logo: data.homeTeam.info.logo,
      score: data.homeTeam.stats.goals,
      abbrev: data.homeTeam.info.abbreviation,
      awaySplitSquad: false,
      radioLink: '',
      odds: [],
      sog: homeSOG,
    }),
    awayTeam: new Team({
      id: data.visitingTeam.info.id,
      placeName: { default: data.visitingTeam.info.city },
      commonName: { default: data.visitingTeam.info.nickname },
      name: { default: data.visitingTeam.info.name },
      logo: data.visitingTeam.info.logo,
      score: data.visitingTeam.stats.goals,
      abbrev: data.visitingTeam.info.abbreviation,
      awaySplitSquad: false,
      radioLink: '',
      odds: [],
      sog: awaySOG,
    }),
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
