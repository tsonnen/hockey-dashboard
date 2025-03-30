import { NextResponse } from "next/server";
import { LEAGUES } from "../../const";
import { getBaseUrl, getKeyAndClientCode } from "../../utils";
import {
  convertHockeyTechGame,
  HockeyTechGame,
} from "@/app/models/hockeytech-game";

export async function GET(
  request: Request,
  { params }: { params: { league: LEAGUES } }
) {
  const { league } = await params;
  const url = getBaseUrl(league);
  url.searchParams.append("feed", "modulekit");
  url.searchParams.append("view", "scorebar");
  url.searchParams.append("fmt", "json");

  console.log(url.toString());

  const response = await fetch(url.toString());
  const data = await response.json();

  const games = data.SiteKit.Scorebar.map((game: HockeyTechGame) =>
    convertHockeyTechGame(game)
  );

  return NextResponse.json(games);
}
