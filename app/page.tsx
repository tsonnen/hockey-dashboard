"use client";

import { useState, useEffect } from "react";
import { Game } from "@/app/models/game";
import { Loader } from "@/app/components/loader/loader";
import { GameCard } from "@/app/components/game-card/game-card";
import { DateSelector } from "@/app/components/date-selector/date-selector";

export default function Home() {
  const [games, setData] = useState<Array<Game>>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  });

  async function fetchGames(url: string) {
    const curGames = games;
    const dateStr = selectedDate.toISOString().slice(0, 10);
    const response = await fetch(url);
    const dateGames = (await response.json()).filter(
      (game: Game) => game.gameDate == dateStr
    );

    curGames.push(...dateGames);
    curGames.sort(
      (a, b) =>
        new Date(a.startTimeUTC).getTime() - new Date(b.startTimeUTC).getTime()
    );

    return dateGames;
  }

  useEffect(() => {
    const fetchData = async () => {
      setData([]); // Clear existing games when date changes
      const dateStr = selectedDate.toISOString().slice(0, 10);
      const allLeagueGames = await Promise.all([
        fetchGames(`/api/nhl/week/${dateStr}`),
        fetchGames(`/api/hockeytech/ohl/schedule/${dateStr}`),
        fetchGames(`/api/hockeytech/whl/schedule/${dateStr}`),
        fetchGames(`/api/hockeytech/qmjhl/schedule/${dateStr}`),
        fetchGames(`/api/hockeytech/pwhl/schedule/${dateStr}`),
        fetchGames(`/api/hockeytech/ahl/schedule/${dateStr}`),
        fetchGames(`/api/hockeytech/echl/schedule/${dateStr}`),
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
  }, [selectedDate]); // Re-fetch when date changes

  return (
    <div>
      <DateSelector
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />
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
    </div>
  );
}
