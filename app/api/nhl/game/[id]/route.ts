import { NextResponse } from 'next/server';

async function getPlayByPlay(gameId: string) {
  const response = await fetch(
    `https://api-web.nhle.com/v1/gamecenter/${gameId}/play-by-play`,
  );
  const game = await response.json();
  return game;
}

async function getSummary(gameId: string) {
  const response = await fetch(
    `https://api-web.nhle.com/v1/gamecenter/${gameId}/landing`,
  );
  const { summary, matchup } = await response.json();
  return { summary, matchup };
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = await params;
  const [gameSummary, gamePlayByPlay] = await Promise.all([
    getSummary(id),
    getPlayByPlay(id),
  ]);

  const merged = Object.assign(gamePlayByPlay, gameSummary);

  return NextResponse.json(merged);
}
