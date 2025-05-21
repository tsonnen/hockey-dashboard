import { NextResponse } from "next/server";

async function getSummary(gameId: string) {
  const response = await fetch(
    `https://api-web.nhle.com/v1/gamecenter/${gameId}/landing`
  );
  const { summary, matchup } = await response.json();
  return { summary, matchup };
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const [gameSummary] = await Promise.all([getSummary(id)]);

  return NextResponse.json(gameSummary);
}
