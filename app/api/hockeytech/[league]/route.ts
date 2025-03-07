import { NextResponse } from "next/server";
import { LEAGUE_KEY_MAPPINGS, LEAGUES } from "../const";

const BASE_URL = "https://lscluster.hockeytech.com/feed/";

function getKeyAndClientCode(league: LEAGUES) {
  return LEAGUE_KEY_MAPPINGS[league];
}

export async function GET(
  request: Request,
  { params }: { params: { league: LEAGUES } }
) {
  return NextResponse.json({ ...getKeyAndClientCode(params.league) });
}

// feed=modulekit&
// view=schedule&
// key=2976319eb44abe94&
// fmt=json&
// client_code=ohl&
// lang=en&
// season=latest&
// fmt=json
