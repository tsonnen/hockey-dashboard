"use client";

import { useState, useEffect } from "react";
import { Game } from "./models/game";
import { Loader } from "@/app/components/loader/loader";
import { GameCard } from "@/app/components/game-card/game-card";

export default function Home() {
  const [games, setData] = useState<Array<Game>>([]);

  async function fetchGames(url: string) {
    const curGames = games;
    const tzoffset = new Date().getTimezoneOffset() * 60000;
    const today = new Date(Date.now() - tzoffset).toISOString().slice(0, 10);
    const response = await fetch(url);
    const todayGames = (await response.json()).filter(
      (game: Game) => game.gameDate == today
    );

    curGames.push(...todayGames);
    curGames.sort(
      (a, b) =>
        new Date(a.startTimeUTC).getTime() - new Date(b.startTimeUTC).getTime()
    );

    return todayGames;
  }

  useEffect(() => {
    const fetchData = async () => {
      const allLeagueGames = await Promise.all([
        fetchGames("/api/nhl/week"),
        fetchGames("/api/hockeytech/ohl/schedule"),
        fetchGames("/api/hockeytech/whl/schedule"),
        fetchGames("/api/hockeytech/qmjhl/schedule"),
        fetchGames("/api/hockeytech/pwhl/schedule"),
        fetchGames("/api/hockeytech/ahl/schedule"),
        fetchGames("/api/hockeytech/echl/schedule"),
      ]);

      const allGames: Array<Game> = [];

      allLeagueGames.forEach((league) => allGames.push(...league));

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
      {games.length > 0 ? (
        games.map((game: Game) => (
          <GameCard
            key={`${game.id} - ${game.startTimeUTC}`}
            game={new Game(game)}
          />
        ))
      ) : (
        <Loader />
      )}
    </div>
  );
}
