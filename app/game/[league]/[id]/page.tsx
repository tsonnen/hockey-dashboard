"use client";

import { GameSummary, PeriodGoals } from "@/app/models/game-summary";
import { GameMatchup } from "@/app/models/game-matchup";
import { useState, useEffect } from "react";
import { PeriodScoringSummary } from "@/app/components/period-scoring-summary";
import { PeriodGoalsDisplay } from "@/app/components/period-goals-display";
import { GameCard } from "@/app/components/game-card";
import { Game } from "@/app/models/game";
import {
  HockeyTechGameDetails,
  convertHockeyTechGameDetails,
} from "@/app/models/hockeytech-game-details";
import { Loader } from "@/app/components/loader/loader";
import { useRouter } from "next/navigation";
import { GoalDisplay } from "@/app/components/goal-display";

interface GamePageProps {
  params: {
    id: string;
    league: string;
  };
}

export default function GamePage({ params }: GamePageProps) {
  const [game, setGame] = useState<Game>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { league, id } = await params;

        switch (league) {
          case "nhl":
            setGame(
              new Game(await (await fetch(`/api/nhl/game/${id}`)).json())
            );
            break;
          case "ohl":
          case "whl":
          case "qmjhl":
          case "ahl":
          case "echl":
          case "pwhl":
            const response = await fetch(
              `/api/hockeytech/${league}/game/${id}`
            );
            const data: HockeyTechGameDetails = await response.json();
            setGame(new Game(convertHockeyTechGameDetails(data, league)));
            break;
          default:
            break;
        }
      } catch (error) {
        console.error("Error fetching game data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <Loader />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="p-4">
        <div className="text-center text-gray-600">Game not found</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
        Back
      </button>

      {game.summary && (
        <div className="mb-4">
          <GameCard game={game} />
          <div className="flex items-center justify-center">
            <PeriodScoringSummary game={game} />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Game Summary</h2>
            <div className="space-y-4">
              {game.summary.scoring.map((period, i) => (
                <PeriodGoalsDisplay key={i} period={period} game={game} />
              ))}
            </div>
          </div>
        </div>
      )}

      {game.matchup && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Game Matchup</h2>
          <div className="grid grid-cols-2 gap-4"></div>
        </div>
      )}
    </div>
  );
}
