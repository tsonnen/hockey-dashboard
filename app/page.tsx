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
      var tzoffset = new Date().getTimezoneOffset() * 60000;
      const today = new Date(Date.now() - tzoffset).toISOString().slice(0, 10);

      console.log(today);

      const todayNhlGames = nhlGameWeek.find(
        (gameDay) => gameDay.date === today
      );

      allGames.push(...(todayNhlGames?.games ?? new Array<Game>()));

      const ohlResponse = await fetch("/api/hockeytech/ohl/schedule");
      const ohlGames: Array<Game> = await ohlResponse.json();
      const todayOhlGames = ohlGames.filter((game) => game.gameDate == today);

      allGames.push(...todayOhlGames);

      const pwhlResponse = await fetch("/api/hockeytech/pwhl/schedule");
      const pwhlGames: Array<Game> = await pwhlResponse.json();
      const todayPwhlGames = pwhlGames.filter((game) => game.gameDate == today);

      allGames.push(...todayPwhlGames);

      const whlResponse = await fetch("/api/hockeytech/whl/schedule");
      const whlGames: Array<Game> = await whlResponse.json();
      const todayWhlGames = whlGames.filter((game) => game.gameDate == today);

      allGames.push(...todayWhlGames);

      const qmjhlResponse = await fetch("/api/hockeytech/qmjhl/schedule");
      const qmjhlGames: Array<Game> = await qmjhlResponse.json();
      const todayQmjhlGames = qmjhlGames.filter(
        (game) => game.gameDate == today
      );

      allGames.push(...todayQmjhlGames);

      const ahlResponse = await fetch("/api/hockeytech/ahl/schedule");
      const ahlGames: Array<Game> = await ahlResponse.json();
      const todayAhlGames = ahlGames.filter((game) => game.gameDate == today);

      allGames.push(...todayAhlGames);

      const echlResponse = await fetch("/api/hockeytech/echl/schedule");
      const echlGames: Array<Game> = await echlResponse.json();
      const todayEchlGames = echlGames.filter((game) => game.gameDate == today);

      allGames.push(...todayEchlGames);

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
