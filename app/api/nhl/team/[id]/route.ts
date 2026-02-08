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
    getClubStats(teamAbbrev)
  ]);

  if (!rosterData) {
    return NextResponse.json({ id: teamAbbrev } as Partial<TeamDetails>, { status: 404 });
  }

  // Process Stats
  const skaterStatsMap = new Map();
  const goalieStatsMap = new Map();

  if (statsData) {
    for (const s of statsData.skaters ?? []) {
        skaterStatsMap.set(s.playerId, s);
    }
    for (const g of statsData.goalies ?? []) {
        goalieStatsMap.set(g.playerId, g);
    }
  }

  // Process Roster
  interface NhlRosterPlayer {
    id: number;
    positionCode?: string;
    firstName?: { default: string };
    lastName?: { default: string };
    sweaterNumber?: number;
    headshot?: string;
  }
  const forwards = (rosterData.forwards ?? []).map((p: NhlRosterPlayer) => {
    const stats = skaterStatsMap.get(p.id);
    return mapNhlPlayer(p, stats);
  });
  const defensemen = (rosterData.defensemen ?? []).map((p: NhlRosterPlayer) => {
    const stats = skaterStatsMap.get(p.id);
    return mapNhlPlayer(p, stats);
  });
  const goalies = (rosterData.goalies ?? []).map((p: NhlRosterPlayer) => {
    const stats = goalieStatsMap.get(p.id);
    return mapNhlPlayer(p, stats);
  });

  // Process Standings
  let record;
  let teamName = { default: teamAbbrev };
  let logo;
  if (standingsData && standingsData.standings) {
    const teamStats = standingsData.standings.find((t: { teamAbbrev?: { default?: string } }) => t.teamAbbrev?.default === teamAbbrev);
    if (teamStats) {
        teamName = teamStats.teamName;
        logo = teamStats.teamLogo;
        record = {
            wins: teamStats.wins,
            losses: teamStats.losses,
            ot: teamStats.otLosses,
            points: teamStats.points,
            streakCode: teamStats.streakCode,
            streakCount: teamStats.streakCount
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
    
    interface NhlScheduleGame {
      id: number;
      gameDate: string;
      startTimeUTC?: string;
      homeTeam?: { id: number; abbrev: string; logo?: string; score?: number };
      awayTeam?: { id: number; abbrev: string; logo?: string; score?: number };
      gameState?: string;
    }
    const pastGames = games.filter((g: NhlScheduleGame) => g.gameDate < today);
    const futureGames = games.filter((g: NhlScheduleGame) => g.gameDate >= today);

    last10Schedule.push(...pastGames.slice(-10).map((g: NhlScheduleGame) => mapNhlGame(g, teamAbbrev)));
    upcomingSchedule.push(...futureGames.slice(0, 10).map((g: NhlScheduleGame) => mapNhlGame(g, teamAbbrev)));
  }

  return NextResponse.json({
    id: teamAbbrev,
    abbrev: teamAbbrev,
    name: teamName,
    logo,
    roster: {
        forwards,
        defensemen,
        goalies
    },
    record,
    upcomingSchedule,
    last10Schedule
  });
}

function formatTime(seconds?: number): string | undefined {
    if (seconds === undefined || seconds === null) return;
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

interface NhlPlayerStats {
  gamesPlayed?: number;
  goals?: number;
  assists?: number;
  points?: number;
  plusMinus?: number;
  penaltyMinutes?: number;
  pim?: number;
  pointsPerGame?: number;
  avgTimeOnIcePerGame?: number;
  shots?: number;
  shootingPctg?: number;
  faceoffWinPctg?: number;
  blockedShots?: number;
  hits?: number;
  savePercentage?: number;
  shutouts?: number;
  wins?: number;
  losses?: number;
  shotsAgainst?: number;
  saves?: number;
  goalsAgainstAverage?: number;
}

function mapNhlPlayer(p: { id: number; positionCode?: string; firstName?: { default: string }; lastName?: { default: string }; sweaterNumber?: number; headshot?: string }, stats?: NhlPlayerStats): Player {
    let position = p.positionCode;
    if (position === 'L') position = 'LW';
    else if (position === 'R') position = 'RW';

    return {
        id: p.id,
        firstName: p.firstName,
        lastName: p.lastName,
        sweaterNumber: p.sweaterNumber,
        positionCode: position,
        headshot: p.headshot,
        gamesPlayed: stats?.gamesPlayed,
        goals: stats?.goals,
        assists: stats?.assists,
        points: stats?.points,
        plusMinus: stats?.plusMinus,
        pim: stats?.penaltyMinutes || stats?.pim,
        // Added stats
        pointsPerGame: stats?.pointsPerGame,
        avgIceTime: formatTime(stats?.avgTimeOnIcePerGame),
        shots: stats?.shots,
        shootingPct: stats?.shootingPctg,
        faceoffPct: stats?.faceoffWinPctg,
        blocks: stats?.blockedShots,
        hits: stats?.hits,
        // Goalie stats
        savePct: stats?.savePercentage,
        shutouts: stats?.shutouts,
        wins: stats?.wins,
        losses: stats?.losses,
        shotsAgainst: stats?.shotsAgainst,
        saves: stats?.saves,
        gaa: stats?.goalsAgainstAverage
    };
}

function mapNhlGame(g: { id: number; gameDate: string; startTimeUTC?: string; homeTeam?: { id: number; abbrev: string; logo?: string; score?: number }; awayTeam?: { id: number; abbrev: string; logo?: string; score?: number }; gameState?: string }, _currentTeamAbbrev: string): ScheduledGame {
   const home = g.homeTeam ?? { id: 0, abbrev: '' };
   const away = g.awayTeam ?? { id: 0, abbrev: '' };
   return {
       id: g.id,
       date: g.gameDate,
       startTime: g.startTimeUTC ?? '',
       homeTeam: {
           id: home.id,
           abbrev: home.abbrev,
           logo: home.logo,
           score: home.score
       },
       awayTeam: {
           id: away.id,
           abbrev: away.abbrev,
           logo: away.logo,
           score: away.score
       },
       gameState: g.gameState
   }
}
