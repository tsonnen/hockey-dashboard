import { Game } from "./game";
import { Team } from "./team";
import { PeriodGoals, GameSummary } from "./game-summary";

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
  coaches: Array<{
    firstName: string;
    lastName: string;
    role: string;
  }>;
  skaters: HockeyTechPlayer[];
  goalies: HockeyTechPlayer[];
  goalieLog: Array<{
    info: HockeyTechPlayer["info"];
    stats: HockeyTechPlayer["stats"];
    periodStart: { id: string; shortName: string; longName: string };
    timeStart: string;
    periodEnd: { id: string; shortName: string; longName: string };
    timeEnd: string;
    result: string;
  }>;
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
    teamStats: any[];
  };
}

export interface HockeyTechGoal {
  game_goal_id: string;
  team: HockeyTechTeam["info"];
  period: { id: string; shortName: string; longName: string };
  time: string;
  scorerGoalNumber: string;
  scoredBy: HockeyTechPlayer["info"];
  assists: HockeyTechPlayer["info"][];
  assistNumbers: string[];
  properties: {
    isPowerPlay: string;
    isShortHanded: string;
    isEmptyNet: string;
    isPenaltyShot: string;
    isInsuranceGoal: string;
    isGameWinningGoal: string;
  };
  plus_players: HockeyTechPlayer["info"][];
  minus_players: HockeyTechPlayer["info"][];
}

export interface HockeyTechPenalty {
  game_penalty_id: number;
  period: { id: string; shortName: string; longName: string };
  time: string;
  againstTeam: HockeyTechTeam["info"];
  minutes: number;
  description: string;
  ruleNumber: string;
  takenBy: HockeyTechPlayer["info"];
  servedBy: HockeyTechPlayer["info"];
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
  referees: Array<{
    firstName: string;
    lastName: string;
    jerseyNumber: number;
    role: string;
  }>;
  linesmen: Array<{
    firstName: string;
    lastName: string;
    jerseyNumber: number;
    role: string;
  }>;
  scorekeepers: any[];
  mostValuablePlayers: Array<{
    team: HockeyTechTeam["info"];
    player: HockeyTechPlayer;
    isGoalie: boolean;
    playerImage: string;
    homeTeam: number;
  }>;
  hasShootout: boolean;
  homeTeam: HockeyTechTeam;
  visitingTeam: HockeyTechTeam;
  periods: HockeyTechPeriod[];
  penaltyShots: {
    homeTeam: any[];
    visitingTeam: any[];
  };
  featuredPlayer: {
    team: HockeyTechTeam["info"];
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

export function convertHockeyTechGameDetails(data: HockeyTechGameDetails, league: string): Partial<Game> {
  const periodGoals = data.periods.map(period => ({
    periodDescriptor: {
      number: parseInt(period.info.id),
      periodType: period.info.longName,
      maxRegulationPeriods: 3,
    },
    goals: period.goals.map(goal => ({
      situationCode: goal.properties.isPowerPlay === "1" ? "PP" : "EV",
      eventId: parseInt(goal.game_goal_id),
      strength: goal.properties.isPowerPlay === "1" ? "PP" : "EV",
      playerId: goal.scoredBy.id,
      firstName: { default: goal.scoredBy.firstName },
      lastName: { default: goal.scoredBy.lastName },
      name: { default: `${goal.scoredBy.firstName} ${goal.scoredBy.lastName}` },
      teamAbbrev: { default: goal.team.abbreviation },
      headshot: goal.scoredBy.playerImageURL,
      goalsToDate: parseInt(goal.scorerGoalNumber),
      awayScore: parseInt(period.stats.visitingGoals),
      homeScore: parseInt(period.stats.homeGoals),
      timeInPeriod: goal.time,
      shotType: "",
      goalModifier: "",
      assists: goal.assists.map(assist => ({
        playerId: assist.id,
        firstName: { default: assist.firstName },
        lastName: { default: assist.lastName },
        name: { default: `${assist.firstName} ${assist.lastName}` },
      })),
      pptReplayUrl: "",
      homeTeamDefendingSide: "",
      isHome: goal.team.id === data.homeTeam.info.id,
    })),
  }));

  return {
    id: data.details.id,
    season: parseInt(data.details.seasonId),
    gameType: 2, // Regular season
    gameDate: data.details.date,
    venue: { default: data.details.venue },
    neutralSite: false,
    startTimeUTC: data.details.GameDateISO8601,
    gameState: data.details.status,
    homeTeam: new Team({
      id: data.homeTeam.info.id,
      placeName: { default: data.homeTeam.info.city },
      commonName: { default: data.homeTeam.info.nickname },
      name: { default: data.homeTeam.info.name },
      logo: data.homeTeam.info.logo,
      score: data.homeTeam.stats.goals,
      abbrev: data.homeTeam.info.abbreviation,
      awaySplitSquad: false,
      radioLink: "",
      odds: [],
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
      radioLink: "",
      odds: [],
    }),
    ticketsLink: data.details.ticketsUrl,
    league,
    summary: new GameSummary({
      scoring: periodGoals,
      shootout: [],
      threeStars: data.mostValuablePlayers.map((mvp, index) => ({
        playerId: mvp.player.info.id,
        firstName: { default: mvp.player.info.firstName },
        lastName: { default: mvp.player.info.lastName },
        name: { default: `${mvp.player.info.firstName} ${mvp.player.info.lastName}` },
        star: index + 1,
        teamAbbrev: mvp.team.abbreviation,
        headshot: mvp.playerImage,
      })),
      penalties: data.periods.map(period => ({
        periodDescriptor: {
          number: parseInt(period.info.id),
          periodType: period.info.longName,
          maxRegulationPeriods: 3,
        },
        penalties: period.penalties.map(penalty => ({
          timeInPeriod: penalty.time,
          type: penalty.description,
          duration: penalty.minutes,
          committedByPlayer: { default: `${penalty.takenBy.firstName} ${penalty.takenBy.lastName}` },
          teamAbbrev: { default: penalty.againstTeam.abbreviation },
          drawnBy: { default: "" },
          descKey: penalty.description,
        })),
      })),
    }),
  };
} 