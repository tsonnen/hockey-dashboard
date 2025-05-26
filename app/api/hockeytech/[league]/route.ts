import { NextResponse } from "next/server";
import { LEAGUE_KEY_MAPPINGS, LEAGUES } from "../const";
import { getKeyAndClientCode } from "../utils";

export async function GET({ params }: { params: { league: LEAGUES } }) {
  return NextResponse.json({ ...getKeyAndClientCode(params.league) });
}
