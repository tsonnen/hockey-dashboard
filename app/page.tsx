"use client";

import { useState, useEffect } from "react";
import { Game } from "./models/game";
import { GameDay } from "./models/game-day";
import { GameCard } from "@/app/components/game-card/game-card";

export default function Home() {
  const [games, setData] = useState<Array<Game>>([]);

  useEffect(() => {
    const fetchData = async () => {
      const allGames: Array<Game> = [];
      const nhlResponse = await fetch("/api/nhl/week");
      const nhlGameWeek: Array<GameDay> = await nhlResponse.json();
      const today = new Date().toISOString().slice(0, 10);

      const todayNhlGames = nhlGameWeek.find(
        (gameDay) => gameDay.date === today
      );

      allGames.push(...(todayNhlGames?.games ?? new Array<Game>()));

      console.log(todayNhlGames);

      const pwhlResponse = await fetch("/api/hockeytech/ohl/schedule");
      const pwhlGames: Array<Game> = await pwhlResponse.json();
      const todayPwhlGames = pwhlGames.filter((game) => game.gameDate == today);

      allGames.push(...todayPwhlGames);
      allGames.sort(
        (a, b) =>
          new Date(a.startTimeUTC).getTime() -
          new Date(b.startTimeUTC).getTime()
      );
      setData(allGames);
    };
    fetchData();
  }, []);

  return (
    <div className="games-container">
      {games &&
        games.map((game: Game) => (
          <GameCard key={game.id} game={new Game(game)} />
        ))}
    </div>
  );
}
