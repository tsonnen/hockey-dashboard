"use client";

import { GameSummary, PeriodGoals } from "@/app/models/game-summary";
import { GameMatchup } from "@/app/models/game-matchup";
import { useState, useEffect } from "react";
import { PeriodScoringSummary } from "@/app/components/period-scoring-summary";
import { Game } from "@/app/models/game";
import {
  HockeyTechGameDetails,
  convertHockeyTechGameDetails,
} from "@/app/models/hockeytech-game-details";
import { Loader } from "@/app/components/loader/loader";
import { useRouter } from "next/navigation";

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
          <div>
            <PeriodScoringSummary game={game} />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Game Summary</h2>
            <div className="space-y-4">
              {game.summary.scoring.map((period, i) => (
                <div key={i} className="border rounded p-4">
                  <h3 className="font-medium mb-2">
                    {period.periodCommonName}
                  </h3>
                  <div className="space-y-2">
                    {period.goals.map((goal, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <span className="font-medium">{goal.timeInPeriod}</span>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <img
                              src={goal.headshot}
                              alt={goal.name.default}
                              className="w-8 h-8 rounded-full"
                            />
                            <span>{goal.name.default}</span>
                            <span className="text-gray-600">
                              ({goal.awayScore}-{goal.homeScore})
                            </span>
                            {goal.situationCode === "PP" && (
                              <span className="text-blue-600">PP</span>
                            )}
                            {goal.situationCode === "SH" && (
                              <span className="text-red-600">SH</span>
                            )}
                          </div>
                          {goal.assists.length > 0 && (
                            <div className="text-sm text-gray-500 ml-10">
                              {goal.assists
                                .map((assist) => assist.name.default)
                                .join(", ")}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
