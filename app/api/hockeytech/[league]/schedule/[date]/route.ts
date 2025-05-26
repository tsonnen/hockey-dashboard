import { NextResponse } from 'next/server';

import type {
  HockeyTechGame } from '@/app/models/hockeytech-game';
import {
  convertHockeyTechGame,
} from '@/app/models/hockeytech-game';

import type { LEAGUES } from '../../../const';
import { getBaseUrl, getKeyAndClientCode } from '../../../utils';

const EST_IANA_ZONE_ID = 'America/New_York';
export const DATE_LINK_FORMAT = 'yyyy-MM-dd';
export const DATE_DISPLAY_FORMAT = 'dd MMMM yyyy';

function calculateDaysByDate(date: Date) {
  const differenceInDays = Math.ceil(
    (Date.now().valueOf() - date.valueOf()) / 86400000,
  );

  if (differenceInDays < 0) {
    return { daysBack: Math.abs(differenceInDays) + 1, daysAhead: 1 };
  }

  return { daysBack: 1, daysAhead: differenceInDays + 1 };
}

export async function GET(
  request: Request,
  { params }: { params: { league: LEAGUES; date: string } },
) {
  const { league, date } = await params;
  const url = getBaseUrl(league);
  const { daysAhead, daysBack } = calculateDaysByDate(
    new Date(Date.parse(date)),
  );

  url.searchParams.append('numberofdaysahead', `${daysAhead}`);
  url.searchParams.append('numberofdaysback', `${daysBack}`);
  url.searchParams.append('feed', 'modulekit');
  url.searchParams.append('view', 'scorebar');
  url.searchParams.append('fmt', 'json');

  const response = await fetch(url.toString());
  const data = await response.json();

  const games = data.SiteKit.Scorebar.map((game: HockeyTechGame) =>
    convertHockeyTechGame(game, league),
  );

  return NextResponse.json(games);
}
