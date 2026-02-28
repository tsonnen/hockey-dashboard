import { NextResponse } from 'next/server';

import type { DatePromo } from '@/app/models/date-promo';
import { Game } from '@/app/models/game';
import { GameDay } from '@/app/models/game-day';

interface NHLScheduleResponse {
  gameWeek: {
    date: string;
    dayAbbrev: string;
    numberOfGames: number;
    datePromo: DatePromo[];
    games: Game[];
  }[];
}

interface NHLScoreResponse {
  games: Game[];
}

async function getSchedule(date: string): Promise<GameDay[]> {
  const response = await fetch(`https://api-web.nhle.com/v1/schedule/${date}`);
  const data = (await response.json()) as NHLScheduleResponse;
  return data.gameWeek.map(
    (day) =>
      new GameDay({
        date: day.date,
        dayAbbrev: day.dayAbbrev,
        numberOfGames: day.numberOfGames,
        datePromo: day.datePromo,
        games: day.games.map((game) => new Game(game)),
      }),
  );
}

async function getScores(date: string): Promise<Game[]> {
  const response = await fetch(`https://api-web.nhle.com/v1/score/${date}`);
  const data = (await response.json()) as NHLScoreResponse;
  return data.games.map((game) => new Game(game));
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ date: string }> },
): Promise<NextResponse<Partial<Game>[]>> {
  const { date } = await params;
  const targetDate = new Date(date);

  const dateMinus1 = new Date(targetDate);
  dateMinus1.setDate(targetDate.getDate() - 1);
  const dateMinus1Str = dateMinus1.toISOString().split('T')[0];

  const datePlus1 = new Date(targetDate);
  datePlus1.setDate(targetDate.getDate() + 1);
  const datePlus1Str = datePlus1.toISOString().split('T')[0];

  // Fetch schedules for yesterday and today to cover all possible local midnight games
  // Fetch scores for yesterday, today, and tomorrow to ensure we have score data for all games
  const [gameWeekMinus1, gameWeek, gameScoresMinus1, gameScores, gameScoresPlus1] =
    await Promise.all([
      getSchedule(dateMinus1Str),
      getSchedule(date),
      getScores(dateMinus1Str),
      getScores(date),
      getScores(datePlus1Str),
    ]);

  const allGameScores = [...gameScoresMinus1, ...gameScores, ...gameScoresPlus1];
  const allGameWeeks = [...gameWeekMinus1, ...gameWeek];

  const allGames: Partial<Game>[] = [];
  const seenGameIds = new Set<number>();

  for (const gameDay of allGameWeeks) {
    for (const game of gameDay.games) {
      if (seenGameIds.has(game.id)) continue;
      seenGameIds.add(game.id);

      let mergedGame: Partial<Game> = { ...game };
      const gameScore = allGameScores.find((gs) => gs.id === game.id);

      if (gameScore) {
        mergedGame = {
          ...mergedGame,
          ...gameScore,
        };

        mergedGame.homeTeam = { ...mergedGame.homeTeam, ...gameScore.homeTeam };
        mergedGame.awayTeam = { ...mergedGame.awayTeam, ...gameScore.awayTeam };
      }

      mergedGame.league = 'nhl';
      allGames.push(mergedGame);
    }
  }

  return NextResponse.json(allGames);
}
