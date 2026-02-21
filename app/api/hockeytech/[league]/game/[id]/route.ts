import { NextResponse } from 'next/server';

import type { Game } from '@/app/models/game';

import type { LEAGUES } from '../../../const';
import { fetchHockeyTech } from '../../../utils';

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
      league: string;
    }>;
  },
): Promise<NextResponse<Partial<Game>>> {
  const { league, id } = await params;

  const data = await fetchHockeyTech<Record<string, unknown>>(league as LEAGUES, {
    view: 'gameSummary',
    game_id: id,
  });

  if (!data) {
    return NextResponse.json({}, { status: 404 });
  }

  return NextResponse.json(data);
}
