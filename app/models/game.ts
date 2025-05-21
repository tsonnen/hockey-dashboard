import { Team } from "./team";
import { LocalizedName } from "./localized-name";
import { TvBroadcast } from "./tv-broadcast";
import { PeriodDescriptor } from "./period-descriptor";
import startTime from "../utils/start-time";
import { GameSummary } from "./game-summary";

interface GameClock {
  timeRemaining: string;
  secondsRemaining: number;
  running: boolean;
  inIntermission: boolean;
}

interface GameSituation {
  homeTeam: {
    abbrev: string;
    situationDescriptions?: string[];
    strength: number;
  };
  awayTeam: {
    abbrev: string;
    strength: number;
  };
  situationCode: string;
}

interface VenueLocation {
  default: string;
}

export enum GameState {
  FUTURE = "FUT",
  CRITICAL = "CRIT",
  LIVE = "LIVE",
  FINAL = "FINAL",
  OFFICIAL = "OFF",
}

export class Game {
  id: number;
  season: number;
  gameType: number;
  gameDate?: string;
  venue: LocalizedName;
  neutralSite: boolean;
  startTimeUTC: string;
  easternUTCOffset: string;
  venueUTCOffset: string;
  venueTimezone: string;
  gameState: string;
  gameScheduleState: string;
  tvBroadcasts: TvBroadcast[];
  awayTeam: Team;
  homeTeam: Team;
  periodDescriptor: PeriodDescriptor;
  ticketsLink: string;
  ticketsLinkFr: string;
  gameCenterLink: string;
  league: string;
  clock?: GameClock;
  period?: number;
  situation?: GameSituation;
  venueLocation?: VenueLocation;
  limitedScoring?: boolean;
  shootoutInUse?: boolean;
  maxPeriods?: number;
  regPeriods?: number;
  otInUse?: boolean;
  tiesInUse?: boolean;
  summary?: GameSummary;

  constructor(data: Partial<Game>) {
    this.id = data.id ?? 0;
    this.season = data.season ?? 0;
    this.gameType = data.gameType ?? 0;
    this.gameDate = data.gameDate;
    this.venue = data.venue ?? { default: "" };
    this.neutralSite = data.neutralSite ?? false;
    this.startTimeUTC = data.startTimeUTC ?? "";
    this.easternUTCOffset = data.easternUTCOffset ?? "";
    this.venueUTCOffset = data.venueUTCOffset ?? "";
    this.venueTimezone = data.venueTimezone ?? "";
    this.gameState = data.gameState ?? "";
    this.gameScheduleState = data.gameScheduleState ?? "";
    this.tvBroadcasts = data.tvBroadcasts ?? [];
    this.awayTeam = data.awayTeam ? new Team(data.awayTeam) : new Team({});
    this.homeTeam = data.homeTeam ? new Team(data.homeTeam) : new Team({});
    this.periodDescriptor = data.periodDescriptor ?? {
      number: 0,
      periodType: "",
      maxRegulationPeriods: 0,
    };
    this.ticketsLink = data.ticketsLink ?? "";
    this.ticketsLinkFr = data.ticketsLinkFr ?? "";
    this.gameCenterLink = data.gameCenterLink ?? "";
    this.clock = data.clock;
    this.period = data.period;
    this.situation = data.situation;
    this.league = data.league ?? "";
    this.venueLocation = data.venueLocation;
    this.limitedScoring = data.limitedScoring ?? false;
    this.shootoutInUse = data.shootoutInUse ?? false;
    this.maxPeriods = data.maxPeriods ?? 3;
    this.regPeriods = data.regPeriods ?? 3;
    this.otInUse = data.otInUse ?? false;
    this.tiesInUse = data.tiesInUse ?? false;
    this.summary = data.summary;
  }

  get gameInProgress(): boolean {
    return this.gameState === GameState.LIVE;
  }

  get gameStarted(): boolean {
    return this.gameState !== GameState.FUTURE;
  }

  get statusString(): string {
    switch (this.gameState) {
      case GameState.FINAL:
      case GameState.OFFICIAL:
        return "Final";
      case GameState.LIVE:
        return "Live";
      case GameState.CRITICAL:
        return "CRITICAL";
      default:
        return startTime(this.startTimeUTC);
    }
  }
}
