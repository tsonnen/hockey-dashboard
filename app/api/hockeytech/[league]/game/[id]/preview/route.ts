import { NextResponse } from 'next/server';

import type { LEAGUES } from '../../../../const';
import { getBaseUrl } from '../../../../utils';

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
): Promise<NextResponse<Record<string, unknown>>> {
  const { league, id } = await params;

  const url = getBaseUrl(league as LEAGUES);
  url.searchParams.append('feed', 'gc');
  url.searchParams.append('tab', 'preview');
  url.searchParams.append('game_id', id);
  url.searchParams.append('fmt', 'json');

  const response = await fetch(url.toString());
  const data = (await response.json()) as Record<string, unknown>;

  return NextResponse.json(data);
}
