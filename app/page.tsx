"use client";

import { useState, useEffect } from "react";
import { Game } from "@/app/models/game";
import { Loader } from "@/app/components/loader/loader";
import { GameCard } from "@/app/components/game-card/game-card";
import { DateSelector } from "@/app/components/date-selector/date-selector";
import { GameSkeleton } from "@/app/components/game-skeleton/game-skeleton";

type LeagueEndpoint = {
  url: string;
  name: string;
};

const LEAGUE_ENDPOINTS: LeagueEndpoint[] = [
  { url: "/api/nhl/week", name: "NHL" },
  { url: "/api/hockeytech/ohl/schedule", name: "OHL" },
  { url: "/api/hockeytech/whl/schedule", name: "WHL" },
  { url: "/api/hockeytech/qmjhl/schedule", name: "QMJHL" },
  { url: "/api/hockeytech/pwhl/schedule", name: "PWHL" },
  { url: "/api/hockeytech/ahl/schedule", name: "AHL" },
  { url: "/api/hockeytech/echl/schedule", name: "ECHL" },
];

async function fetchGamesForDate(endpoint: LeagueEndpoint, dateStr: string): Promise<Game[]> {
  try {
    const response = await fetch(`${endpoint.url}/${dateStr}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint.name} games: ${response.statusText}`);
    }
    const games = await response.json();
    return games.filter((game: Game) => game.gameDate === dateStr);
  } catch (error) {
    console.error(`Error fetching ${endpoint.name} games:`, error);
    return [];
  }
}

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      setGames([]); // Clear existing games when date changes
      
      try {
        const dateStr = selectedDate.toISOString().slice(0, 10);
        const allLeagueGames = await Promise.all(
          LEAGUE_ENDPOINTS.map(endpoint => fetchGamesForDate(endpoint, dateStr))
        );

        const allGames = allLeagueGames.flat().sort(
          (a, b) => new Date(a.startTimeUTC).getTime() - new Date(b.startTimeUTC).getTime()
        );

        setGames(allGames);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred while fetching games');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  return (
    <div>
      <DateSelector
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
      <div className="games-container">
        {isLoading ? (
          <>
            <GameSkeleton />
            <GameSkeleton />
            <GameSkeleton />
            <GameSkeleton />
          </>
        ) : games.length > 0 ? (
          games.map((game) => (
            <GameCard
              key={`${game.id}-${game.startTimeUTC}`}
              game={new Game(game)}
            />
          ))
        ) : (
          <div className="no-games">No games scheduled for this date</div>
        )}
      </div>
    </div>
  );
}
