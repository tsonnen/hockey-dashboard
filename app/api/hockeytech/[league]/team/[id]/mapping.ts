import { Player } from '@/app/models/team-details';
import type { HockeyTechRow } from '../../../types';

function toNumber(value: unknown): number | undefined {
  return value !== null && value !== undefined ? Number(value) : undefined;
}

export function mapHtSkaterStats(s?: HockeyTechRow): Partial<Player> {
  if (!s) return {};
  return {
    gamesPlayed: toNumber(s.games_played),
    goals: toNumber(s.goals),
    assists: toNumber(s.assists),
    points: toNumber(s.points),
    plusMinus: s.plus_minus === undefined ? undefined : Number(s.plus_minus),
    shots: toNumber(s.shots),
    pointsPerGame: toNumber(s.points_per_game),
    faceoffPct: toNumber(s.faceoff_percentage),
    avgIceTime: s.avg_time_on_ice as string,
    pim: toNumber(s.penalty_minutes),
    hits: toNumber(s.hits),
    blocks: toNumber(s.blocks),
    shootingPct: toNumber((s.shooting_percentage as number) / 100),
  };
}

export function mapHtGoalieStats(s?: HockeyTechRow): Partial<Player> {
  if (!s) return {};
  return {
    gamesPlayed: toNumber(s.games_played),
    savePct: toNumber(s.save_percentage),
    wins: toNumber(s.wins),
    losses: toNumber(s.losses),
    shotsAgainst: toNumber(s.shots),
    saves: toNumber(s.saves),
    shutouts: toNumber(s.shutouts),
    gaa: toNumber(s.goals_against_average),
    // Some goalie stats might overlap with skater stats in data structure but have different meaning or usage
    // e.g. shots usually means shots against for goalies in some contexts, but HockeyTech often has 'shots' as SOG for skaters
    // We strictly map what we know.
  };
}

function getHeadshotUrl(p: HockeyTechRow, clientCode?: string, id?: number): string | undefined {
  const headshot = (p.face_image as string | undefined) ?? (p.image_url as string | undefined);
  if (!headshot && clientCode && id) {
    return `https://assets.leaguestat.com/${clientCode}/240x240/${id}.jpg`;
  }
  return headshot;
}

function splitFullName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length > 1) {
    return {
      firstName: parts[0].replace(/,$/, ''),
      lastName: parts.slice(1).join(' '),
    };
  }
  return { firstName: fullName, lastName: '' };
}

function parsePlayerName(p: HockeyTechRow) {
  const firstName = String(p.first_name ?? p.firstName ?? '').replace(/,$/, '');
  const lastName = String(p.last_name ?? p.lastName ?? '').replace(/,$/, '');
  const fullName = String(p.name ?? p.player_name ?? '');

  if (!firstName && !lastName && fullName) {
    return splitFullName(fullName);
  }
  return { firstName, lastName };
}

function getPlayerStats(pos: string, s?: HockeyTechRow) {
  if (pos === 'G') return mapHtGoalieStats(s);
  if (isDefenseman(pos) || pos === 'F' || ['LW', 'RW', 'C'].includes(pos)) {
    return mapHtSkaterStats(s);
  }
  return {};
}

export function mapHtPlayer(p: HockeyTechRow, clientCode?: string, s?: HockeyTechRow): Player {
  const pos = String(p.position ?? p.role ?? '').toUpperCase();
  const id = Number(p.player_id ?? p.person_id ?? p.id ?? 0);
  const { firstName, lastName } = parsePlayerName(p);

  return {
    id,
    firstName: { default: firstName },
    lastName: { default: lastName },
    sweaterNumber: Number(p.jersey ?? p.tp_jersey_number),
    positionCode: normalizeHtPosition(pos),
    headshot: getHeadshotUrl(p, clientCode, id),
    ...getPlayerStats(pos, s),
  };
}

function isStaff(posStr: string): boolean {
  const staffKeywords = [
    'COACH',
    'MANAGER',
    'STAFF',
    'TRAINER',
    'EQUIPMENT',
    'SCOUT',
    'EXECUTIVE',
    'DIRECTOR',
    'PRESIDENT',
    'OWNER',
    'ANALYST',
    'COORDINATOR',
  ];
  return staffKeywords.some((kw) => posStr.includes(kw));
}

function isDefenseman(positionCode: string): boolean {
  return positionCode === 'D' || positionCode === 'LD' || positionCode === 'RD';
}

function categorizePlayer(
  player: Player,
  forwards: Player[],
  defensemen: Player[],
  goalies: Player[],
): void {
  if (player.positionCode === 'G') {
    goalies.push(player);
  } else if (isDefenseman(player.positionCode ?? '')) {
    defensemen.push(player);
  } else {
    forwards.push(player);
  }
}

export function processRoster(
  players: HockeyTechRow[],
  statsMap: Map<string, HockeyTechRow>,
  clientCode?: string,
) {
  const forwards: Player[] = [],
    defensemen: Player[] = [],
    goalies: Player[] = [];

  for (const p of players) {
    const posStr = String(p.position ?? p.role ?? '').toUpperCase();
    if (isStaff(posStr)) continue;

    const id = p.player_id ?? p.person_id ?? p.id;
    if (!id) continue;

    const player = mapHtPlayer(p, clientCode, statsMap.get(String(id)));
    categorizePlayer(player, forwards, defensemen, goalies);
  }
  return { forwards, defensemen, goalies };
}

function normalizeHtPosition(pos: string): string {
  pos = pos.toLocaleUpperCase();
  if (['LW', 'RW', 'C', 'D', 'G'].includes(pos)) return pos;
  if (pos.includes('GOALIE')) return 'G';
  if (pos.includes('LEFT WING')) return 'LW';
  if (pos.includes('RIGHT WING')) return 'RW';
  if (pos.includes('RIGHT D')) return 'RD';
  if (pos.includes('LEFT D')) return 'LD';
  if (pos.includes('CENTER')) return 'C';
  if (pos.includes('DEFENSE')) return 'D';
  return 'F';
}
