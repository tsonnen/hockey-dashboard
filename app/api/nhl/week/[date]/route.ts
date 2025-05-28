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
  { params }: { params: { date: string } },
): Promise<NextResponse<Partial<Game>[]>> {
  const { date } = params;
  const [gameWeek, gameScores] = await Promise.all([getSchedule(date), getScores(date)]);

  const allGames: Partial<Game>[] = [];

  gameWeek.forEach((gameDay: GameDay) => {
    const games = gameDay.games.map((game: Partial<Game>) => {
      const gameScore = gameScores.find((gameScore: Partial<Game>) => gameScore.id === game.id);

      if (gameScore) {
        game = {
          // eslint-disable-next-line @typescript-eslint/no-misused-spread
          ...game,
          // eslint-disable-next-line @typescript-eslint/no-misused-spread
          ...gameScore,
        };
        // eslint-disable-next-line @typescript-eslint/no-misused-spread
        game.homeTeam = { ...game.homeTeam, ...gameScore.homeTeam };
        // eslint-disable-next-line @typescript-eslint/no-misused-spread
        game.awayTeam = { ...game.awayTeam, ...gameScore.awayTeam };
      }

      game.league = 'nhl';

      return game;
    });

    allGames.push(...games);
  });

  return NextResponse.json(allGames);
}
