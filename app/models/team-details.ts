import { LocalizedName } from './localized-name';

export interface Player {
  id: number;
  firstName: LocalizedName;
  lastName: LocalizedName;
  sweaterNumber?: number;
  positionCode?: string;
  headshot?: string;
  // Stats
  gamesPlayed?: number;
  goals?: number;
  assists?: number;
  points?: number;
  plusMinus?: number;
  pim?: number;
}

export interface TeamRecord {
  wins: number;
  losses: number;
  ot?: number;
  ties?: number;
  points?: number;
  streakCode?: string; // e.g. "W3", "L1"
  streakCount?: number;
}

export interface ScheduledGame {
  id: number;
  date: string;
  startTime: string;
  homeTeam: {
    id: number;
    abbrev: string;
    logo?: string;
    score?: number;
  };
  awayTeam: {
    id: number;
    abbrev: string;
    logo?: string;
    score?: number;
  };
  gameState?: string;
}

export interface TeamDetails {
  id: number | string;
  abbrev: string;
  name: LocalizedName;
  logo?: string;
  
  roster: {
    forwards: Player[];
    defensemen: Player[];
    goalies: Player[];
  };

  record?: TeamRecord;
  upcomingSchedule?: ScheduledGame[];
  last10Schedule?: ScheduledGame[];
}
