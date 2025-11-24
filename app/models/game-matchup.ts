import type { LocalizedName } from './localized-name';
interface StatLeaderComparisonProps {
  playerId: number;
  headshot: string;
  positionCode: string;
  sweaterNumber: number;
  name: LocalizedName;
}

export interface StatLeaderProps extends StatLeaderComparisonProps {
  value: string;
}

export interface GoalieProps extends StatLeaderComparisonProps {
  gamesPlayed: number;
  seasonPoints: number;
  record: string;
  gaa: number;
  savePctg: number;
  shutouts: number;
}

interface TeamTotals {
  record: string;
  gaa: number;
  savePctg: number;
  shutouts: number;
  gamesPlayed: number;
}

interface TeamGoalieStats {
  teamTotals: TeamTotals;
  leaders: GoalieProps[];
}

export interface SkaterComparisonProps {
  contextLabel: string;
  contextSeason: number;
  leaders: {
    category: string;
    awayLeader: StatLeaderProps;
    homeLeader: StatLeaderProps;
  }[];
}

export interface GoalieComparisonProps {
  contextLabel: string;
  contextSeason: number;
  homeTeam: TeamGoalieStats;
  awayTeam: TeamGoalieStats;
}

export interface GameMatchup {
  season: number;
  gameType: number;
  skaterComparison: SkaterComparisonProps;
  goalieComparison: GoalieComparisonProps;
}
