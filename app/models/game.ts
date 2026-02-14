import startTime from '@/app/utils/start-time';

import type { GameMatchup } from './game-matchup';
import { GameState } from './game-state';
import { GameSummary } from './game-summary';
import type { LocalizedName } from './localized-name';
import type { PeriodDescriptor } from './period-descriptor';
import type { Play } from './play';
import { Team } from './team';
import type { TvBroadcast } from './tv-broadcast';

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
  gameState: GameState;
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
  matchup?: GameMatchup;

  // HockeyTech specific fields
  gameNumber?: number;
  gameId?: string;
  gameUuid?: string;
  startTime?: string;
  endTime?: string;
  status?: string;
  statusCode?: number;
  homeTeamScore?: number;
  awayTeamScore?: number;
  plays: Play[];

  constructor(data: Partial<Game>) {
    this.id = data.id ?? 0;
    this.season = data.season ?? 0;
    this.gameType = data.gameType ?? 0;
    this.gameDate = data.gameDate;
    this.neutralSite = data.neutralSite ?? false;
    this.league = data.league ?? '';
    
    const venueData = this.getVenueData(data);
    this.venue = venueData.venue;
    this.venueLocation = venueData.venueLocation;
    this.venueUTCOffset = venueData.venueUTCOffset;
    this.venueTimezone = venueData.venueTimezone;

    const timeData = this.getTimeData(data);
    this.startTimeUTC = timeData.startTimeUTC;
    this.easternUTCOffset = timeData.easternUTCOffset;
    this.clock = timeData.clock;

    const teamData = this.getTeamData(data);
    this.awayTeam = teamData.awayTeam;
    this.homeTeam = teamData.homeTeam;

    const linkData = this.getLinkData(data);
    this.ticketsLink = linkData.ticketsLink;
    this.ticketsLinkFr = linkData.ticketsLinkFr;
    this.gameCenterLink = linkData.gameCenterLink;

    const stateData = this.getGameStateData(data);
    this.gameState = stateData.gameState;
    this.gameScheduleState = stateData.gameScheduleState;
    this.periodDescriptor = stateData.periodDescriptor;
    this.period = stateData.period;
    this.status = stateData.status;
    this.statusCode = stateData.statusCode;

    const miscData = this.getMiscData(data);
    this.tvBroadcasts = miscData.tvBroadcasts;
    this.situation = miscData.situation;
    this.limitedScoring = miscData.limitedScoring;
    this.shootoutInUse = miscData.shootoutInUse;
    this.maxPeriods = miscData.maxPeriods;
    this.regPeriods = miscData.regPeriods;
    this.otInUse = miscData.otInUse;
    this.tiesInUse = miscData.tiesInUse;
    this.summary = miscData.summary;
    this.matchup = miscData.matchup;
    this.plays = miscData.plays;
  }

  private getVenueData(data: Partial<Game>) {
    return {
      venue: data.venue ?? { default: '' },
      venueLocation: data.venueLocation,
      venueUTCOffset: data.venueUTCOffset ?? '',
      venueTimezone: data.venueTimezone ?? '',
    };
  }

  private getTimeData(data: Partial<Game>) {
    return {
      startTimeUTC: data.startTimeUTC ?? '',
      easternUTCOffset: data.easternUTCOffset ?? '',
      clock: data.clock,
    };
  }

  private getTeamData(data: Partial<Game>) {
    return {
      awayTeam: data.awayTeam ? new Team(data.awayTeam) : new Team({}),
      homeTeam: data.homeTeam ? new Team(data.homeTeam) : new Team({}),
    };
  }

  private getLinkData(data: Partial<Game>) {
    return {
      ticketsLink: data.ticketsLink ?? '',
      ticketsLinkFr: data.ticketsLinkFr ?? '',
      gameCenterLink: data.gameCenterLink ?? '',
    };
  }

  private getGameStateData(data: Partial<Game>) {
    return {
      gameState: data.gameState ?? GameState.FUTURE,
      gameScheduleState: data.gameScheduleState ?? '',
      periodDescriptor: data.periodDescriptor ?? {
        number: 0,
        periodType: '',
        maxRegulationPeriods: 0,
      },
      period: data.period,
      status: data.status,
      statusCode: data.statusCode,
    };
  }

  private getMiscData(data: Partial<Game>) {
    return {
      tvBroadcasts: data.tvBroadcasts ?? [],
      situation: data.situation,
      limitedScoring: data.limitedScoring ?? false,
      shootoutInUse: data.shootoutInUse ?? false,
      maxPeriods: data.maxPeriods ?? 3,
      regPeriods: data.regPeriods ?? 3,
      otInUse: data.otInUse ?? false,
      tiesInUse: data.tiesInUse ?? false,
      summary: data.summary ? new GameSummary(data.summary) : undefined,
      matchup: data.matchup,
      plays: data.plays ?? [],
    };
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
      case GameState.OFFICIAL: {
        return 'Final';
      }
      case GameState.LIVE: {
        return 'Live';
      }
      case GameState.CRITICAL: {
        return 'CRITICAL';
      }
      default: {
        return startTime(this.startTimeUTC);
      }
    }
  }
}
