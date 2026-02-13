import { NextResponse } from 'next/server';
import { TeamDetails, Player, ScheduledGame } from '@/app/models/team-details';

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

  // Process Stats
  const skaterStatsMap = new Map();
  const goalieStatsMap = new Map();

  if (statsData) {
    for (const s of statsData.skaters || []) {
      skaterStatsMap.set(s.playerId, s);
    }
    for (const g of statsData.goalies || []) {
      goalieStatsMap.set(g.playerId, g);
    }
  }

  // Process Roster
  type NhlRosterPlayer = Record<string, unknown>;
  const forwards = (rosterData.forwards || []).map((p: NhlRosterPlayer) => {
    const stats = skaterStatsMap.get(p.id);
    return mapNhlPlayer(p, stats);
  });
  const defensemen = (rosterData.defensemen || []).map((p: NhlRosterPlayer) => {
    const stats = skaterStatsMap.get(p.id);
    return mapNhlPlayer(p, stats);
  });
  const goalies = (rosterData.goalies || []).map((p: NhlRosterPlayer) => {
    const stats = goalieStatsMap.get(p.id);
    return mapNhlPlayer(p, stats);
  });

  // Process Standings
  let record;
  let teamName = { default: teamAbbrev };
  let logo;
  if (standingsData && standingsData.standings) {
    const teamStats = standingsData.standings.find((t: Record<string, unknown>) => (t.teamAbbrev as { default?: string })?.default === teamAbbrev);
    if (teamStats) {
      teamName = teamStats.teamName;
      logo = teamStats.teamLogo;
      record = {
        wins: teamStats.wins,
        losses: teamStats.losses,
        ot: teamStats.otLosses,
        points: teamStats.points,
        streakCode: teamStats.streakCode,
        streakCount: teamStats.streakCount,
      };
    }
  }

  // Process Schedule
  // Logic to get last 10 and upcoming
  const upcomingSchedule: ScheduledGame[] = [];
  const last10Schedule: ScheduledGame[] = [];

  if (scheduleData && scheduleData.games) {
    const today = new Date().toISOString().split('T')[0];
    const games = scheduleData.games;

    type NhlScheduleGame = Record<string, unknown>;
    const pastGames = games.filter((g: NhlScheduleGame) => String(g.gameDate ?? '') < today);
    const futureGames = games.filter((g: NhlScheduleGame) => String(g.gameDate ?? '') >= today);

    last10Schedule.push(...pastGames.slice(-10).map((g: NhlScheduleGame) => mapNhlGame(g)));
    upcomingSchedule.push(...futureGames.slice(0, 10).map((g: NhlScheduleGame) => mapNhlGame(g)));
  }

  return NextResponse.json({
    id: teamAbbrev,
    abbrev: teamAbbrev,
    name: teamName,
    logo,
    roster: {
      forwards,
      defensemen,
      goalies,
    },
    record,
    upcomingSchedule,
    last10Schedule,
  });
}

function formatTime(seconds?: number) {
  if (!seconds) return;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function mapNhlPlayer(p: Record<string, unknown>, stats?: Record<string, unknown>): Player {
  let position = p.positionCode as string | undefined;
  if (position === 'L') position = 'LW';
  else if (position === 'R') position = 'RW';

  return {
    id: p.id as number,
    firstName: p.firstName as { default: string },
    lastName: p.lastName as { default: string },
    sweaterNumber: p.sweaterNumber as number | undefined,
    positionCode: position,
    headshot: p.headshot as string | undefined,
    gamesPlayed: stats?.gamesPlayed as number | undefined,
    goals: stats?.goals as number | undefined,
    assists: stats?.assists as number | undefined,
    points: stats?.points as number | undefined,
    plusMinus: stats?.plusMinus as number | undefined,
    pim: (stats?.penaltyMinutes ?? stats?.pim) as number | undefined,
    // Added stats
    pointsPerGame: stats?.pointsPerGame as number | undefined,
    avgIceTime: formatTime(stats?.avgTimeOnIcePerGame as number | undefined),
    shots: stats?.shots as number | undefined,
    shootingPct: stats?.shootingPctg as number | undefined,
    faceoffPct: stats?.faceoffWinPctg as number | undefined,
    blocks: stats?.blockedShots as number | undefined,
    hits: stats?.hits as number | undefined,
    // Goalie stats
    savePct: stats?.savePercentage as number | undefined,
    shutouts: stats?.shutouts as number | undefined,
    wins: stats?.wins as number | undefined,
    losses: stats?.losses as number | undefined,
    shotsAgainst: stats?.shotsAgainst as number | undefined,
    saves: stats?.saves as number | undefined,
    gaa: stats?.goalsAgainstAverage as number | undefined,
  };
}

function mapNhlGame(g: Record<string, unknown>): ScheduledGame {
  const home = g.homeTeam as Record<string, unknown>;
  const away = g.awayTeam as Record<string, unknown>;
  return {
    id: g.id as number,
    date: g.gameDate as string,
    startTime: g.startTimeUTC as string,
    homeTeam: {
      id: home.id as number,
      abbrev: home.abbrev as string,
      logo: home.logo as string | undefined,
      score: home.score as number | undefined,
    },
    awayTeam: {
      id: away.id as number,
      abbrev: away.abbrev as string,
      logo: away.logo as string | undefined,
      score: away.score as number | undefined,
    },
    gameState: g.gameState as string | undefined,
  };
}
