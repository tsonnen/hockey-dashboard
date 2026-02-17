import { NextResponse } from 'next/server';
import { getKeyAndClientCode } from '../../../utils';
import { LEAGUES } from '../../../const';
import { TeamDetails, TeamRecord } from '@/app/models/team-details';
import { processRoster } from './mapping';
import { mapHtGame } from '@/app/models/hockeytech-mapper';
import { fetchHockeyTech, fetchModuleKit, extractHockeyTechRows } from '../../../utils';
import { splitSchedule } from '@/app/utils/scheduler';
import type { HockeyTechRow } from '../../../types';

async function getSeasonId(
  league: LEAGUES,
  rosterData: Record<string, unknown> | undefined,
): Promise<string> {
  if (rosterData?.seasonId) return String(rosterData.seasonId);
  if (rosterData?.roster && rosterData.seasonID) return String(rosterData.seasonID);
  return fetchCurrentSeasonId(league);
}

async function fetchCurrentSeasonId(league: LEAGUES): Promise<string> {
  const data = (await fetchModuleKit(league, { view: 'seasons' })) as
    | Record<string, unknown>
    | undefined;
  const seasons = (data?.SiteKit as Record<string, unknown>)?.Seasons as HockeyTechRow[];
  if (Array.isArray(seasons)) {
    const current = seasons.find((s: HockeyTechRow) => s.career === '1' && s.playoff === '0');
    return String(current?.season_id ?? '');
  }
  return '';
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ league: string; id: string }> },
): Promise<NextResponse<Partial<TeamDetails>>> {
  const { league, id } = await params;
  const leagueEnum = league as LEAGUES;

  const rosterData = (await fetchHockeyTech(leagueEnum, { view: 'roster', team_id: id })) as
    | Record<string, unknown>
    | undefined;
  if (!rosterData) return NextResponse.json({ id } as Partial<TeamDetails>, { status: 404 });

  const seasonId = await getSeasonId(leagueEnum, rosterData);
  const raw = await fetchRawData(leagueEnum, id, seasonId);
  const { players, games, allStats, teams } = processRawData(raw, rosterData);

  const statsMap = new Map();
  for (const s of allStats) {
    statsMap.set(String(s.player_id), s);
  }

  const { client_code } = getKeyAndClientCode(leagueEnum);
  const { forwards, defensemen, goalies } = processRoster(players, statsMap, client_code);
  const { record, teamName, logo } = getTeamContext(teams, games, id, rosterData, allStats);
  const schedules = getSchedules(games, id);

  return NextResponse.json({
    id,
    abbrev: '',
    name: teamName,
    logo,
    roster: { forwards, defensemen, goalies },
    record,
    ...schedules,
  });
}

async function fetchRawData(league: LEAGUES, id: string, seasonId: string) {
  return Promise.all([
    seasonId
      ? fetchModuleKit(league, {
          view: 'statviewtype',
          type: 'skaters',
          team_id: id,
          season_id: seasonId,
        })
      : undefined,
    seasonId
      ? fetchModuleKit(league, {
          view: 'statviewtype',
          type: 'goalies',
          team_id: id,
          season_id: seasonId,
        })
      : undefined,
    fetchHockeyTech(
      league,
      seasonId ? { view: 'standings', season_id: seasonId } : { view: 'standings' },
    ),
    fetchModuleKit(
      league,
      seasonId
        ? { view: 'schedule', team_id: id, season_id: seasonId }
        : { view: 'schedule', team_id: id },
    ),
  ]) as Promise<[Record<string, unknown>?, Record<string, unknown>?, unknown?, unknown?]>;
}

function processRawData(
  raw: [Record<string, unknown>?, Record<string, unknown>?, unknown?, unknown?],
  rosterData: Record<string, unknown>,
) {
  const [skatersData, goaliesData, standingsData, scheduleData] = raw;
  const skatersStats =
    ((skatersData?.SiteKit as Record<string, unknown>)?.Statviewtype as HockeyTechRow[]) || [];
  const goaliesStats =
    ((goaliesData?.SiteKit as Record<string, unknown>)?.Statviewtype as HockeyTechRow[]) || [];

  return {
    players: extractHockeyTechRows(rosterData),
    games: extractHockeyTechRows(scheduleData),
    allStats: [...skatersStats, ...goaliesStats],
    teams: extractHockeyTechRows(standingsData),
  };
}

// mapping logic removed and imported from mapping.ts

function getTeamContext(
  teams: HockeyTechRow[],
  games: HockeyTechRow[],
  id: string,
  rosterData: Record<string, unknown>,
  allStats: HockeyTechRow[],
) {
  const myTeam = teams.find((t: HockeyTechRow) => String(t.team_id ?? t.id ?? '') === id);
  const ctx = extractBaseTeamInfo(myTeam);

  ctx.record = calculateRecord(games, id, ctx.record);

  if (ctx.logo === undefined && rosterData)
    ctx.logo = String(rosterData.teamLogo ?? '') || undefined;
  if (ctx.teamName && ctx.teamName.default !== 'Team') return ctx;
  if (allStats.length > 0) return handleTeamContextFallbacks(ctx, allStats);

  return ctx;
}

function handleTeamContextFallbacks(
  ctx: { record?: TeamRecord; teamName: { default: string }; logo?: string },
  allStats: HockeyTechRow[],
) {
  const first = allStats[0];
  const teamName = { default: String(first.team_name ?? 'Team') };
  const logo = ctx.logo || String(first.logo ?? '') || undefined;
  return { ...ctx, teamName, logo };
}

function extractBaseTeamInfo(myTeam: HockeyTechRow | undefined) {
  if (!myTeam) return { teamName: { default: 'Team' }, logo: undefined, record: undefined };
  const name = String(myTeam.team_name ?? myTeam.name ?? 'Team');
  return {
    teamName: { default: name === 'null' ? 'Team' : name },
    logo: String(myTeam.team_logo_url ?? myTeam.logo ?? '') || undefined,
    record: mapTeamRecord(myTeam),
  };
}

function mapTeamRecord(myTeam: HockeyTechRow): TeamRecord {
  return {
    wins: Number(myTeam.wins || 0),
    losses: Number(myTeam.losses || 0),
    ot: Number(myTeam.ot_losses || 0),
    points: Number(myTeam.points || 0),
    streakCode: typeof myTeam.streak === 'string' ? myTeam.streak : undefined,
    streakCount: 0,
  };
}

function calculateRecord(
  games: HockeyTechRow[],
  id: string,
  existing: TeamRecord | undefined,
): TeamRecord | undefined {
  const sStr = (g: HockeyTechRow) => (g.game_status || g.status || '').toString().toLowerCase();
  const finished = games.filter((g) => {
    const status = sStr(g);
    return status.includes('final') || status === '4';
  });

  if (finished.length === 0 || existing?.streakCode) return existing;

  const chron = [...finished].toSorted((a, b) =>
    String(a.date_played ?? '').localeCompare(String(b.date_played ?? '')),
  );
  const stats = sumGameStats(chron, id);
  const streak = calculateStreak(chron, id);

  if (existing) return { ...existing, ...streak };
  return { ...stats, ...streak };
}

function sumGameStats(chron: HockeyTechRow[], id: string) {
  let wins = 0,
    losses = 0,
    ot = 0,
    points = 0;
  for (const g of chron) {
    const info = getGameResult(g, id);
    if (info.isWin) {
      wins++;
      points += 2;
    } else if (info.isOTL) {
      ot++;
      points += 1;
    } else losses++;
  }
  return { wins, losses, ot, points };
}

function calculateStreak(chron: HockeyTechRow[], id: string) {
  let streakCode = '';
  let streakCount = 0;
  const latest = [...chron].toReversed();
  for (const g of latest) {
    const { res } = getGameResult(g, id);
    if (!streakCode) {
      streakCode = res;
      streakCount = 1;
    } else if (streakCode === res) streakCount++;
    else break;
  }
  return { streakCode, streakCount };
}

function isOvertimeOrShootout(g: HockeyTechRow, stat: string): boolean {
  return g.overtime === '1' || g.shootout === '1' || stat.includes('ot') || stat.includes('so');
}

function gameResultCode(isWin: boolean, isOTL: boolean): string {
  if (isWin) return 'W';
  if (isOTL) return 'OTL';
  return 'L';
}

function getGameResult(g: HockeyTechRow, id: string) {
  const isHome = String(g.home_team) === id;
  const hS = Number(g.home_goal_count || 0);
  const vS = Number(g.visiting_goal_count || 0);
  const isWin = isHome ? hS > vS : vS > hS;
  const stat = String(g.game_status ?? g.status).toLowerCase();
  const isOTL = !isWin && isOvertimeOrShootout(g, stat);
  return { isWin, isOTL, res: gameResultCode(isWin, isOTL) };
}

function getSchedules(games: HockeyTechRow[], id: string) {
  const mappedGames = games.map((g) => mapHtGame(g, id));
  const { last10, upcoming } = splitSchedule(mappedGames);
  return {
    upcomingSchedule: upcoming,
    last10Schedule: last10,
  };
}
