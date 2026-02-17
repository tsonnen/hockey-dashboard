import type { HockeyTechRow } from '../api/hockeytech/types';
import type { ScheduledGame } from './team-details';
import { GameState } from './game-state';
import { Team } from './team';

const TIME_BUFFER_MS = 10 * 60 * 1000;

function mapNumericStatus(status: string, gameStart: Date): GameState | undefined {
  const now = new Date();
  switch (status) {
    case '1': {
      return GameState.FUTURE;
    }
    case '3': {
      return GameState.OFFICIAL;
    }
    case '4': {
      return GameState.FINAL;
    }
    case '2': {
      if (gameStart.getTime() - now.getTime() > TIME_BUFFER_MS) {
        return GameState.FUTURE;
      }
      return GameState.LIVE;
    }
    default: {
      return undefined;
    }
  }
}

function mapStringStatus(status: string, gameStart: Date): GameState | undefined {
  const now = new Date();
  if (status === 'scheduled') return GameState.FUTURE;
  if (status === 'official') return GameState.OFFICIAL;
  if (status.includes('final')) return GameState.FINAL;
  if (status.includes('in progress')) {
    if (gameStart.getTime() - now.getTime() > TIME_BUFFER_MS) {
      return GameState.FUTURE;
    }
    return GameState.LIVE;
  }
  return undefined;
}

/**
 * Maps a HockeyTech game status to a GameState, incorporating start time for more accurate derivation.
 * @param status The status reported by HockeyTech (could be numeric ID or string)
 * @param startTimeUTC The UTC start time of the game
 * @returns Derived GameState
 */
export function mapHockeyTechGameState(status: string | number, startTimeUTC: string): GameState {
  const now = new Date();
  const gameStart = new Date(startTimeUTC);
  const statusStr = String(status).toLowerCase();

  const numericResult = mapNumericStatus(statusStr, gameStart);
  if (numericResult) return numericResult;

  const stringResult = mapStringStatus(statusStr, gameStart);
  if (stringResult) return stringResult;

  // Fallback: Use start time if status is unclear
  return gameStart > now ? GameState.FUTURE : GameState.LIVE;
}

interface HockeyTechTeamInfo {
  id: string | number;
  city?: string;
  nickname?: string;
  name?: string;
  logo?: string;
  abbreviation?: string;
}

interface HockeyTechTeamStats {
  goals: string | number;
  shots?: string | number;
}

function parseHockeyTechValue(value: string | number | undefined): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number.parseInt(value) || 0;
  return 0;
}

/**
 * Maps HockeyTech team information to the common Team model.
 */
export function mapHockeyTechTeam(info: HockeyTechTeamInfo, stats: HockeyTechTeamStats): Team {
  const teamId = typeof info.id === 'string' ? Number.parseInt(info.id) : info.id;
  const score = parseHockeyTechValue(stats.goals);
  const sog = parseHockeyTechValue(stats.shots);
  const abbrev = info.abbreviation ?? info.nickname?.slice(0, 3).toUpperCase() ?? '';

  return new Team({
    id: teamId,
    placeName: { default: info.city ?? '' },
    commonName: { default: info.nickname ?? '' },
    name: { default: info.name ?? '' },
    logo: info.logo,
    score,
    abbrev,
    awaySplitSquad: false,
    radioLink: '',
    odds: [],
    sog,
  });
}
function mapHtGameTeam(g: HockeyTechRow, isHome: boolean) {
  const prefix = isHome ? 'home' : 'visiting';
  const scoreKey = isHome ? 'home_goal_count' : 'visiting_goal_count';
  const score = g[scoreKey];
  return {
    id: Number(g[`${prefix}_team`] ?? g[`${prefix}_team_id`] ?? 0),
    abbrev: String(g[`${prefix}_team_code`] ?? g[`${prefix}_team_abbrev`] ?? ''),
    score: score === undefined || score === '' || score === null ? undefined : Number(score),
  };
}

export function mapHtGame(g: HockeyTechRow, _id?: string): ScheduledGame {
  return {
    id: Number(g.game_id ?? g.id ?? 0),
    date: String(g.date_played ?? g.date ?? ''),
    startTime: String(g.GameDateISO8601 ?? ''),
    homeTeam: mapHtGameTeam(g, true),
    awayTeam: mapHtGameTeam(g, false),
    gameState: mapHockeyTechGameState(
      String(g.game_status ?? g.status ?? ''),
      String(g.GameDateISO8601 ?? ''),
    ),
  };
}
