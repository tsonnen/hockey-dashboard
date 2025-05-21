"use client";

import { GameSummary } from "@/app/models/game-summary";
import { GameMatchup } from "@/app/models/game-matchup";
import { useState, useEffect } from "react";

interface GamePageProps {
  params: {
    id: string;
    league: string;
  };
}

export default function GamePage({ params }: GamePageProps) {
  const [gameDetails, setGameDetails] = useState<{
    summary: GameSummary;
    matchup: GameMatchup;
  }>();

  useEffect(() => {
    const fetchData = async () => {
      const { league, id } = await params;

      switch (league) {
        case "nhl":
          setGameDetails(await (await fetch(`/api/nhl/game/${id}`)).json());
        case "ohl":
        case "whl":
        case "qmjhl":
        case "ahl":
        case "echl":
        case "pwhl":
          break;
        default:
          break;
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Game Details</h1>
      {gameDetails?.summary && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Game Summary</h2>
          <div className="space-y-4">
            {gameDetails.summary.scoring.map((period, i) => (
              <div key={i} className="border rounded p-4">
                <h3 className="font-medium mb-2">
                  {period.periodDescriptor.periodType}{" "}
                  {period.periodDescriptor.number}
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
      )}

      {gameDetails?.matchup && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Game Matchup</h2>
          <div className="grid grid-cols-2 gap-4"></div>
        </div>
      )}
    </div>
  );
}
