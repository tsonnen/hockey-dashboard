import { NextResponse } from 'next/server';

import type { Game } from '@/app/models/game';
import type { GameDay } from '@/app/models/game-day';

async function getSchedule(date: string) {
  const response = await fetch(`https://api-web.nhle.com/v1/schedule/${date}`);
  const { gameWeek } = await response.json();
  return gameWeek;
}

async function getScores(date: string) {
  const response = await fetch(`https://api-web.nhle.com/v1/score/${date}`);
  const { games } = await response.json();
  return games;
}

export async function GET(
  request: Request,
  { params }: { params: { date: string } },
) {
  const { date } = await params;
  const [gameWeek, gameScores] = await Promise.all([
    getSchedule(date),
    getScores(date),
  ]);

  const allGames: Game[] = [];

  gameWeek.forEach((gameDay: GameDay) => {
    const games = gameDay.games.map((game: Game) => {
      const gameScore = gameScores.find(
        (gameScore: Game) => gameScore.id === game.id,
      );

      if (gameScore) {
        game = {
          ...game,
          ...gameScore,
        };
        game.homeTeam = { ...game.homeTeam, ...gameScore.homeTeam };
        game.awayTeam = { ...game.awayTeam, ...gameScore.awayTeam };
      }

      game.league = 'nhl';

      return game;
    });

    allGames.push(...games);
  });

  return NextResponse.json(allGames);
}
