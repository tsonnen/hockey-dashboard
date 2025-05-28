import { NextResponse } from 'next/server';

import type { Game } from '@/app/models/game';
import type { GameMatchup } from '@/app/models/game-matchup';
import type { GameSummary } from '@/app/models/game-summary';

async function getPlayByPlay(gameId: string): Promise<Partial<Game>> {
  const response = await fetch(
    `https://api-web.nhle.com/v1/gamecenter/${gameId}/play-by-play`,
  );
  return response.json() as Promise<Partial<Game>>;
}

async function getSummary(gameId: string): Promise<{
  summary: GameSummary;
  matchup: GameMatchup;
}> {
  const response = await fetch(
    `https://api-web.nhle.com/v1/gamecenter/${gameId}/landing`,
  );
  const data = await response.json() as {
    summary: GameSummary;
    matchup: GameMatchup;
   };
  return { summary: data.summary, matchup: data.matchup };
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
): Promise<NextResponse<Partial<Game>>> {
  const { id } = params;
  const [gameSummary, gamePlayByPlay] = await Promise.all([
    getSummary(id),
    getPlayByPlay(id),
  ]);

  return NextResponse.json({ ...gamePlayByPlay, ...gameSummary });
}
