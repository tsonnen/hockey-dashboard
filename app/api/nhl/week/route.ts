import { Game } from "@/app/models/game";
import { GameDay } from "@/app/models/game-day";
import { promises } from "dns";
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

  const combined = gameWeek.map((gameDay: GameDay) => {
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

      return game;
    });

    return { ...gameDay, games };
  });

  return NextResponse.json(combined);
}
