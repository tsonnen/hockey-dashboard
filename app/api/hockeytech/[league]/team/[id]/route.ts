import { NextResponse } from 'next/server';
import { getBaseUrl, getKeyAndClientCode } from '../../../utils';
import { LEAGUES } from '../../../const';
import { TeamDetails, ScheduledGame, TeamRecord } from '@/app/models/team-details';
import { processRoster, HockeyTechRow } from './mapping';
import { mapHockeyTechGameState } from '@/app/models/hockeytech-mapper';

// Helper to fetch data from statviewfeed
async function fetchHockeyTech(league: LEAGUES, params: Record<string, string>) {
  const url = getBaseUrl(league);
  url.searchParams.append('feed', 'statviewfeed');
  url.searchParams.append('fmt', 'json');
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.append(key, value);
  }
  try {
    const res = await fetch(url.toString());
    if (!res.ok) return;
    const text = await res.text();
    let jsonString = text.trim();
    if (jsonString.startsWith('(') && jsonString.endsWith(')')) {
      jsonString = jsonString.slice(1, -1);
    }
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('HockeyTech fetch error', error);
    return;
  }
}

// Helper to fetch data from modulekit (for stats)
async function fetchModuleKit(league: LEAGUES, params: Record<string, string>) {
  const url = getBaseUrl(league);
  url.searchParams.append('feed', 'modulekit');
  url.searchParams.append('fmt', 'json');
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.append(key, value);
  }
  try {
    const res = await fetch(url.toString());
    if (!res.ok) return;
    const text = await res.text();
    let jsonString = text.trim();
    if (jsonString.startsWith('(') && jsonString.endsWith(')')) {
      jsonString = jsonString.slice(1, -1);
    }
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('ModuleKit fetch error', error);
    return;
  }
}

function extractHockeyTechRows(data: unknown): HockeyTechRow[] {
  if (!data) return [];
  const roots = (Array.isArray(data) ? data : [data]) as Record<string, unknown>[];
  const rows: HockeyTechRow[] = [];
  for (const root of roots) {
    if (root.sections) {
      const sections = root.sections as Record<string, unknown>[];
      for (const section of sections) {
        if (section.data) {
          rows.push(
            ...(section.data as HockeyTechRow[]).map(
              (d: HockeyTechRow & { row?: HockeyTechRow }) => (d.row ?? d) as HockeyTechRow,
            ),
          );
        }
      }
    } else {
      rows.push(...extractSubRows(root));
    }
  }
  return rows;
}

function extractSubRows(root: Record<string, unknown>): HockeyTechRow[] {
  if (root.roster) return extractHockeyTechRows(root.roster);
  if (root.standings) return extractHockeyTechRows(root.standings);
  if (root.games) return extractHockeyTechRows(root.games);
  if (root.SiteKit) return extractHockeyTechRows(root.SiteKit);
  return extractSubRowsContinued(root);
}

function extractSubRowsContinued(root: Record<string, unknown>): HockeyTechRow[] {
  if (root.Schedule) return extractHockeyTechRows(root.Schedule);
  if (root.person_id || root.game_id || root.team_id || root.id || root.player_id) return [root];
  return [];
}

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
  const today = new Date().toISOString().split('T')[0];
  const sorted = games.toSorted((a, b) =>
    String(a.date_played ?? '').localeCompare(String(b.date_played ?? '')),
  );
  const past = sorted.filter((g) => String(g.date_played ?? '') < today);
  const future = sorted.filter((g) => String(g.date_played ?? '') >= today);
  return {
    upcomingSchedule: future.slice(0, 10).map((g) => mapHtGame(g, id)),
    last10Schedule: past.slice(-10).map((g) => mapHtGame(g, id)),
  };
}

function mapHtGame(g: HockeyTechRow, _id: string): ScheduledGame {
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
