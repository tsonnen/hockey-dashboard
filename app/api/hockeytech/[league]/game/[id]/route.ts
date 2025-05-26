import { NextResponse } from 'next/server';

import {
  convertHockeyTechGame,
  HockeyTechGame,
} from '@/app/models/hockeytech-game';

import type { LEAGUES } from '../../../const';
import { getBaseUrl, getKeyAndClientCode } from '../../../utils';

export async function GET(
  request: Request,
  { params }: { params: { league: LEAGUES; id: string } },
) {
  const { league, id } = await params;
  const url = getBaseUrl(league);
  url.searchParams.append('feed', 'statviewfeed');
  url.searchParams.append('view', 'gameSummary');
  url.searchParams.append('game_id', id);
  url.searchParams.append('fmt', 'json');

  const response = await fetch(url.toString());
  const responseText = await response.text();

  const data = JSON.parse(responseText.substring(1, responseText.length - 1));

  console.log(data);

  //   const games = data.SiteKit.Scorebar.map((game: HockeyTechGame) =>
  //     convertHockeyTechGame(game, league)
  //   );

  return NextResponse.json(data);
}
