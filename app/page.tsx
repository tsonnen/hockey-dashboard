"use client";

import { useState, useEffect } from "react";
import { Game } from "./models/game";
import { GameDay } from "./models/game-day";
import { GameCard } from "./components/game-card";

export default function Home() {
  const [gameDays, setData] = useState<Array<GameDay>>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3000/api/nhl/schedule");
      const { gameWeek }: { gameWeek: Array<GameDay> } = await response.json();
      setData(gameWeek);
    };
    fetchData();
  }, []);

  return (
    <div>
      {gameDays &&
        gameDays.map((gameDay: GameDay) => (
          <div key={gameDay.date}>
            <h2 className="px-4 pt-4">{gameDay.date}</h2>
            <div className="games-container">
              {gameDay.games &&
                gameDay.games.map((game: Game) => (
                  <GameCard key={game.id} game={game} />
                ))}
            </div>
          </div>
        ))}
    </div>
  );
}
