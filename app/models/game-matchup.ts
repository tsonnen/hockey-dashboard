import { LocalizedName } from "./localized-name";
import { Team } from "./team";
import { TvBroadcast } from "./tv-broadcast";

interface PlayerStats {
  playerId: number;
  teamId: number;
  sweaterNumber: number;
  name: LocalizedName;
  position?: string;
  gamesPlayed?: number;
  goals?: number;
  assists?: number;
  points?: number;
  plusMinus?: number;
  pim?: number;
  avgPoints?: number;
  avgTimeOnIce?: string;
  gameWinningGoals?: number;
  shots?: number;
  shootingPctg?: number;
  faceoffWinningPctg?: number;
  powerPlayGoals?: number;
  blockedShots?: number;
  hits?: number;
}

interface GoalieStats extends PlayerStats {
  wins?: number;
  losses?: number;
  otLosses?: number;
  shotsAgainst?: number;
  goalsAgainst?: number;
  goalsAgainstAvg?: number;
  savePctg?: number;
  shutouts?: number;
  saves?: number;
  toi?: string;
}

interface TeamTotals {
  record: string;
  gaa: number;
  savePctg: number;
  shutouts: number;
  gamesPlayed: number;
}

interface TeamLeaders {
  teamTotals: TeamTotals;
  leaders: GoalieStats[];
}

interface SkaterComparison {
  contextLabel: string;
  contextSeason: number;
  leaders: {
    category: string;
    awayLeader: PlayerStats;
    homeLeader: PlayerStats;
  }[];
}

interface GoalieComparison {
  contextLabel: string;
  contextSeason: number;
  homeTeam: TeamLeaders;
  awayTeam: TeamLeaders;
}

interface PlayoffsRecord {
  record: string;
  streakType: string;
  streak: number;
}

interface SkaterSeasonStats {
  contextLabel: string;
  contextSeason: number;
  skaters: PlayerStats[];
}

interface GoalieSeasonStats {
  contextLabel: string;
  contextSeason: number;
  goalies: GoalieStats[];
}

export interface GameMatchup {
    season: number;
    gameType: number;
    skaterComparison: SkaterComparison;
    goalieComparison: GoalieComparison;
    playoffsRecord: {
      awayTeam: PlayoffsRecord;
      homeTeam: PlayoffsRecord;
    };
    skaterSeasonStats: SkaterSeasonStats;
    goalieSeasonStats: GoalieSeasonStats;
} 