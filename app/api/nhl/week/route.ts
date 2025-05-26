import { Game } from "@/app/models/game";
import { GameDay } from "@/app/models/game-day";
import { NextResponse } from "next/server";

async function getSchedule() {
  const response = await fetch("https://api-web.nhle.com/v1/schedule/now");
  const { gameWeek } = await response.json();
  return gameWeek;
}

async function getScores() {
  const response = await fetch("https://api-web.nhle.com/v1/score/now");
  const { games } = await response.json();
  return games;
}

export async function GET() {
  const [gameWeek, gameScores] = await Promise.all([
    getSchedule(),
    getScores(),
  ]);

  const allGames: Array<Game> = [];

  gameWeek.forEach((gameDay: GameDay) => {
    const games = gameDay.games.map((game: Game) => {
      const gameScore = gameScores.find(
        (gameScore: Game) => gameScore.id === game.id
      );

      if (gameScore) {
        game = {
          ...game,
          ...gameScore,
        };
        game.homeTeam = { ...game.homeTeam, ...gameScore.homeTeam };
        game.awayTeam = { ...game.awayTeam, ...gameScore.awayTeam };
      }

      game.league = "nhl";

      return game;
    });

    allGames.push(...games);
  });

  return NextResponse.json(allGames);
}
