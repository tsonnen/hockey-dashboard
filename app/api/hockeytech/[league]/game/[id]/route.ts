import { NextResponse } from 'next/server';

import type { Game } from '@/app/models/game';

import type { LEAGUES } from '../../../const';
import { getBaseUrl } from '../../../utils';

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
      league: LEAGUES;
    }>;
  },
): Promise<NextResponse<Partial<Game>>> {
  const { league, id } = await params;

  const url = getBaseUrl(league);
  url.searchParams.append('feed', 'statviewfeed');
  url.searchParams.append('view', 'gameSummary');
  url.searchParams.append('game_id', id);
  url.searchParams.append('fmt', 'json');

  const response = await fetch(url.toString());
  const responseText = await response.text();

  const data = JSON.parse(responseText.substring(1, responseText.length - 1)) as Record<
    string,
    unknown
  >;

  return NextResponse.json(data);
}
