import { NextResponse } from 'next/server';
import { TeamDetails, ScheduledGame } from '@/app/models/team-details';
import { mapNhlPlayer, mapNhlGame } from './mapping';

const NHL_API_BASE = 'https://api-web.nhle.com/v1';

async function getRoster(teamAbbrev: string) {
  const res = await fetch(`${NHL_API_BASE}/roster/${teamAbbrev}/current`);
  if (!res.ok) return;
  return res.json();
}

async function getStandings() {
  const res = await fetch(`${NHL_API_BASE}/standings/now`);
  if (!res.ok) return;
  return res.json();
}

async function getSchedule(teamAbbrev: string) {
  // fetching "now" gives current season schedule usually
  const res = await fetch(`${NHL_API_BASE}/club-schedule-season/${teamAbbrev}/now`);
  if (!res.ok) return;
  return res.json();
}

async function getClubStats(teamAbbrev: string) {
  const res = await fetch(`${NHL_API_BASE}/club-stats/${teamAbbrev}/now`);
  if (!res.ok) return;
  return res.json();
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<Partial<TeamDetails>>> {
  const { id } = await params;
  const teamAbbrev = id.toUpperCase();

  const [rosterData, standingsData, scheduleData, statsData] = await Promise.all([
    getRoster(teamAbbrev),
    getStandings(),
    getSchedule(teamAbbrev),
    getClubStats(teamAbbrev),
  ]);

  if (!rosterData) {
    return NextResponse.json({ id: teamAbbrev }, { status: 404 });
  }

  const { skaterStatsMap, goalieStatsMap } = buildStatsMaps(statsData);
  const { forwards, defensemen, goalies } = processNhlRoster(
    rosterData,
    skaterStatsMap,
    goalieStatsMap,
  );
  const { teamName, logo, record } = processNhlStandings(standingsData, teamAbbrev);
  const { upcomingSchedule, last10Schedule } = processNhlSchedule(scheduleData);

  return NextResponse.json({
    id: teamAbbrev,
    abbrev: teamAbbrev,
    name: teamName,
    logo,
    roster: { forwards, defensemen, goalies },
    record,
    upcomingSchedule,
    last10Schedule,
  });
}

function buildStatsMaps(statsData: Record<string, unknown> | undefined) {
  const skaterStatsMap = new Map();
  const goalieStatsMap = new Map();
  if (statsData) {
    for (const s of (statsData.skaters as Record<string, unknown>[]) || [])
      skaterStatsMap.set(s.playerId as number, s);
    for (const g of (statsData.goalies as Record<string, unknown>[]) || [])
      goalieStatsMap.set(g.playerId as number, g);
  }
  return { skaterStatsMap, goalieStatsMap };
}

function processNhlRoster(
  rosterData: Record<string, unknown>,
  skaterStatsMap: Map<number, Record<string, unknown>>,
  goalieStatsMap: Map<number, Record<string, unknown>>,
) {
  type NhlRosterPlayer = Record<string, unknown>;
  const forwards = ((rosterData.forwards as NhlRosterPlayer[]) || []).map((p: NhlRosterPlayer) =>
    mapNhlPlayer(p, skaterStatsMap.get(p.id as number)),
  );
  const defensemen = ((rosterData.defensemen as NhlRosterPlayer[]) || []).map(
    (p: NhlRosterPlayer) => mapNhlPlayer(p, skaterStatsMap.get(p.id as number)),
  );
  const goalies = ((rosterData.goalies as NhlRosterPlayer[]) || []).map((p: NhlRosterPlayer) =>
    mapNhlPlayer(p, goalieStatsMap.get(p.id as number)),
  );
  return { forwards, defensemen, goalies };
}

function processNhlStandings(standingsData: Record<string, unknown>, teamAbbrev: string) {
  let teamName = { default: teamAbbrev };
  let logo, record;
  if (standingsData?.standings) {
    const tStats = (standingsData.standings as Record<string, unknown>[]).find(
      (t: Record<string, unknown>) => (t.teamAbbrev as { default: string })?.default === teamAbbrev,
    );
    if (tStats) {
      teamName = tStats.teamName as { default: string };
      logo = tStats.teamLogo as string;
      record = {
        wins: tStats.wins as number,
        losses: tStats.losses as number,
        ot: tStats.otLosses as number,
        points: tStats.points as number,
        streakCode: tStats.streakCode as string,
        streakCount: tStats.streakCount as number,
      };
    }
  }
  return { teamName, logo, record };
}

function processNhlSchedule(scheduleData: Record<string, unknown>) {
  const upcomingSchedule: ScheduledGame[] = [];
  const last10Schedule: ScheduledGame[] = [];
  if (scheduleData?.games) {
    const today = new Date().toISOString().split('T')[0];
    const games = scheduleData.games as Record<string, unknown>[];
    const past = games.filter((g: Record<string, unknown>) => String(g.gameDate ?? '') < today);
    const future = games.filter((g: Record<string, unknown>) => String(g.gameDate ?? '') >= today);
    last10Schedule.push(...past.slice(-10).map((g: Record<string, unknown>) => mapNhlGame(g)));
    upcomingSchedule.push(
      ...future.slice(0, 10).map((g: Record<string, unknown>) => mapNhlGame(g)),
    );
  }
  return { upcomingSchedule, last10Schedule };
}

// mapping logic removed and imported from mapping.ts
