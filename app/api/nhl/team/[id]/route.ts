import { NextResponse } from 'next/server';
import { TeamDetails, Player, ScheduledGame } from '@/app/models/team-details';

const NHL_API_BASE = 'https://api-web.nhle.com/v1';

async function getRoster(teamAbbrev: string) {
  const res = await fetch(`${NHL_API_BASE}/roster/${teamAbbrev}/current`);
  if (!res.ok) return null;
  return res.json();
}

async function getStandings() {
  const res = await fetch(`${NHL_API_BASE}/standings/now`);
  if (!res.ok) return null;
  return res.json();
}

async function getSchedule(teamAbbrev: string) {
  // fetching "now" gives current season schedule usually
  const res = await fetch(`${NHL_API_BASE}/club-schedule-season/${teamAbbrev}/now`);
  if (!res.ok) return null;
  return res.json();
}

async function getClubStats(teamAbbrev: string) {
  const res = await fetch(`${NHL_API_BASE}/club-stats/${teamAbbrev}/now`);
  if (!res.ok) return null;
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
    return NextResponse.json({ id: teamAbbrev } as any, { status: 404 });
  }

  // Process Stats
  const skaterStatsMap = new Map();
  const goalieStatsMap = new Map();

  if (statsData) {
    (statsData.skaters || []).forEach((s: any) => {
        skaterStatsMap.set(s.playerId, s);
    });
    (statsData.goalies || []).forEach((g: any) => {
        goalieStatsMap.set(g.playerId, g);
    });
  }

  // Process Roster
  const forwards = (rosterData.forwards || []).map((p: any) => {
    const stats = skaterStatsMap.get(p.id);
    return mapNhlPlayer(p, stats);
  });
  const defensemen = (rosterData.defensemen || []).map((p: any) => {
    const stats = skaterStatsMap.get(p.id);
    return mapNhlPlayer(p, stats);
  });
  const goalies = (rosterData.goalies || []).map((p: any) => {
    const stats = goalieStatsMap.get(p.id);
    return mapNhlPlayer(p, stats);
  });

  // Process Standings
  let record;
  let teamName = { default: teamAbbrev };
  let logo;
  if (standingsData && standingsData.standings) {
    const teamStats = standingsData.standings.find((t: any) => t.teamAbbrev.default === teamAbbrev);
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
    
    const pastGames = games.filter((g: any) => g.gameDate < today);
    const futureGames = games.filter((g: any) => g.gameDate >= today);
    
    last10Schedule.push(...pastGames.slice(-10).map((g: any) => mapNhlGame(g, teamAbbrev)));
    upcomingSchedule.push(...futureGames.slice(0, 10).map((g: any) => mapNhlGame(g, teamAbbrev)));
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

function mapNhlPlayer(p: any, stats?: any): Player {
    let position = p.positionCode;
    if (position === 'L') position = 'LW';
    else if (position === 'R') position = 'RW';

    const formatTime = (seconds?: number) => {
        if (!seconds) return;
        const mins = Math.floor(seconds / 60);
        const secs = Math.round(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

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

function mapNhlGame(g: any, currentTeamAbbrev: string): ScheduledGame {
   return {
       id: g.id,
       date: g.gameDate,
       startTime: g.startTimeUTC,
       homeTeam: {
           id: g.homeTeam.id,
           abbrev: g.homeTeam.abbrev,
           logo: g.homeTeam.logo,
           score: g.homeTeam.score
       },
       awayTeam: {
           id: g.awayTeam.id,
           abbrev: g.awayTeam.abbrev,
           logo: g.awayTeam.logo,
           score: g.awayTeam.score
       },
       gameState: g.gameState
   }
}
