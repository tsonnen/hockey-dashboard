import { Player, ScheduledGame } from '@/app/models/team-details';

export function formatTime(seconds?: number) {
  if (!seconds) return;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function normalizeNhlPosition(pos: string): string {
  if (pos === 'L') return 'LW';
  if (pos === 'R') return 'RW';
  return pos;
}

export function mapNhlSkaterBaseStats(s?: Record<string, unknown>) {
  return {
    gamesPlayed: s?.gamesPlayed as number | undefined,
    goals: s?.goals as number | undefined,
    assists: s?.assists as number | undefined,
    points: s?.points as number | undefined,
    plusMinus: s?.plusMinus as number | undefined,
    pim: (s?.penaltyMinutes ?? s?.pim) as number | undefined,
  };
}

export function mapNhlSkaterAdvancedStats(s?: Record<string, unknown>) {
  return {
    pointsPerGame: s?.pointsPerGame as number | undefined,
    avgIceTime: formatTime(s?.avgTimeOnIcePerGame as number | undefined),
    shots: s?.shots as number | undefined,
    shootingPct: s?.shootingPctg as number | undefined,
    faceoffPct: s?.faceoffWinPctg as number | undefined,
    blocks: s?.blockedShots as number | undefined,
    hits: s?.hits as number | undefined,
  };
}

export function mapNhlGoalieStats(stats?: Record<string, unknown>) {
  return {
    savePct: stats?.savePercentage as number | undefined,
    shutouts: stats?.shutouts as number | undefined,
    wins: stats?.wins as number | undefined,
    losses: stats?.losses as number | undefined,
    shotsAgainst: stats?.shotsAgainst as number | undefined,
    saves: stats?.saves as number | undefined,
    gaa: stats?.goalsAgainstAverage as number | undefined,
  };
}

export function mapNhlPlayer(p: Record<string, unknown>, stats?: Record<string, unknown>): Player {
  return {
    id: p.id as number,
    firstName: p.firstName as { default: string },
    lastName: p.lastName as { default: string },
    sweaterNumber: p.sweaterNumber as number | undefined,
    positionCode: normalizeNhlPosition(p.positionCode as string),
    headshot: p.headshot as string | undefined,
    ...mapNhlSkaterBaseStats(stats),
    ...mapNhlSkaterAdvancedStats(stats),
    ...mapNhlGoalieStats(stats),
  };
}

export function mapNhlGame(g: Record<string, unknown>): ScheduledGame {
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
