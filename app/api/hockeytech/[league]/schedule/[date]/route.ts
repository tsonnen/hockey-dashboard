import { NextResponse } from 'next/server';

import type { LEAGUES } from '@/app/api/hockeytech/const';
import { getBaseUrl } from '@/app/api/hockeytech/utils';
import type { Game } from '@/app/models/game';
import { type HockeyTechGame, convertHockeyTechGame } from '@/app/models/hockeytech-game';
import { calculateDaysByDate } from '@/app/utils/calculate-days-by-date';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ league: string; date: string }> },
): Promise<NextResponse<Game[]>> {
  const { league, date } = await params;
  const baseUrl = getBaseUrl(league as LEAGUES);
  const { daysAhead, daysBack } = calculateDaysByDate(new Date(Date.parse(`${date}T00:00:00`)));
  const bufferDays = 1; // Buffer the search to ensure all games are captured

  baseUrl.searchParams.append('numberofdaysahead', `${daysAhead + bufferDays}`);
  baseUrl.searchParams.append('numberofdaysback', `${daysBack + bufferDays}`);
  baseUrl.searchParams.append('feed', 'modulekit');
  baseUrl.searchParams.append('view', 'scorebar');
  baseUrl.searchParams.append('fmt', 'json');

  const response = await fetch(baseUrl.toString());
  const data = (await response.json()) as { SiteKit: { Scorebar: HockeyTechGame[] } };

  const games = data.SiteKit.Scorebar.map((game) => convertHockeyTechGame(game, league as LEAGUES));

  return NextResponse.json(games);
}
