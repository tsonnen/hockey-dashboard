import { NextResponse } from 'next/server';

import { convertHockeyTechGame, type HockeyTechGame } from '@/app/models/hockeytech-game';

import type { LEAGUES } from '../../const';
import { getBaseUrl } from '../../utils';

interface HockeyTechResponse {
  SiteKit: {
    Scorebar: HockeyTechGame[];
  };
}

export async function GET(
  request: Request,
  { params }: { params: { league: LEAGUES } },
) {
  const { league } = params;
  const url = getBaseUrl(league);
  url.searchParams.append('feed', 'modulekit');
  url.searchParams.append('view', 'scorebar');
  url.searchParams.append('fmt', 'json');

  const response = await fetch(url.toString());
  const data = (await response.json()) as HockeyTechResponse;

  // Log the first game's logo URLs to see the pattern
  const firstGame = data.SiteKit.Scorebar[0];
  console.log('Home Logo URL:', firstGame.HomeLogo);
  console.log('Visitor Logo URL:', firstGame.VisitorLogo);

  const games = data.SiteKit.Scorebar.map((game) =>
    convertHockeyTechGame(game, league),
  );

  return NextResponse.json(games);
}
