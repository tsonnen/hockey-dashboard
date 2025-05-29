import { NextResponse } from 'next/server';

import type { LEAGUES } from '@/app/api/hockeytech/const';
import { getBaseUrl } from '@/app/api/hockeytech/utils';
import type { Game } from '@/app/models/game';
import { type HockeyTechGame, convertHockeyTechGame } from '@/app/models/hockeytech-game';

export const DATE_LINK_FORMAT = 'yyyy-MM-dd';
export const DATE_DISPLAY_FORMAT = 'dd MMMM yyyy';

function calculateDaysByDate(date: Date): { daysBack: number; daysAhead: number } {
  const differenceInDays = Math.ceil((Date.now().valueOf() - date.valueOf()) / 86400000);

  if (differenceInDays < 0) {
    return { daysBack: Math.abs(differenceInDays) + 1, daysAhead: 1 };
  }

  return { daysBack: 1, daysAhead: differenceInDays + 1 };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ league: LEAGUES; date: string }> },
): Promise<NextResponse<Game[]>> {
  const { league, date } = await params;
  const baseUrl = getBaseUrl(league);
  const { daysAhead, daysBack } = calculateDaysByDate(new Date(Date.parse(date)));

  baseUrl.searchParams.append('numberofdaysahead', `${daysAhead}`);
  baseUrl.searchParams.append('numberofdaysback', `${daysBack}`);
  baseUrl.searchParams.append('feed', 'modulekit');
  baseUrl.searchParams.append('view', 'scorebar');
  baseUrl.searchParams.append('fmt', 'json');

  const response = await fetch(baseUrl.toString());
  const data = (await response.json()) as { SiteKit: { Scorebar: HockeyTechGame[] } };

  const games = data.SiteKit.Scorebar.map((game) => convertHockeyTechGame(game, league));

  return NextResponse.json(games);
}
