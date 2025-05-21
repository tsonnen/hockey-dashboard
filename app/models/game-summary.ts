import { LocalizedName } from "./localized-name";
import { PeriodDescriptor } from "./period-descriptor";

interface Player {
  playerId: number;
  firstName: LocalizedName;
  lastName: LocalizedName;
  name: LocalizedName;
  assistsToDate?: number;
  sweaterNumber?: number;
  position?: string;
  goals?: number;
  assists?: number;
  points?: number;
  goalsAgainstAverage?: number;
  savePctg?: number;
}

interface Goal {
  situationCode: string;
  eventId: number;
  strength: string;
  playerId: number;
  firstName: LocalizedName;
  lastName: LocalizedName;
  name: LocalizedName;
  teamAbbrev: LocalizedName;
  headshot: string;
  highlightClipSharingUrl?: string;
  highlightClip?: number;
  goalsToDate: number;
  awayScore: number;
  homeScore: number;
  leadingTeamAbbrev?: LocalizedName;
  timeInPeriod: string;
  shotType: string;
  goalModifier: string;
  assists: Player[];
  pptReplayUrl: string;
  homeTeamDefendingSide: string;
  isHome: boolean;
}

interface Penalty {
  timeInPeriod: string;
  type: string;
  duration: number;
  committedByPlayer: LocalizedName;
  teamAbbrev: LocalizedName;
  drawnBy: LocalizedName;
  descKey: string;
}

interface PeriodGoals {
  periodDescriptor: PeriodDescriptor;
  goals: Goal[];
}

interface PeriodPenalties {
  periodDescriptor: PeriodDescriptor;
  penalties: Penalty[];
}

interface StarPlayer extends Player {
  star: number;
  teamAbbrev: string;
  headshot: string;
}

export interface GameSummary {
  scoring: PeriodGoals[];
  shootout: any[];
  threeStars: StarPlayer[];
  penalties: PeriodPenalties[];
} 