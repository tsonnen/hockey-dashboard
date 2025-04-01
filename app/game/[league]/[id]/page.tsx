"use client";

import { Game } from "@/app/models/game";
import { useState, useEffect } from "react";

interface GamePageProps {
  params: {
    id: string;
    league: string;
  };
}

export default function GamePage({ params }: GamePageProps) {
  const [gameDetails, setGameDetails] = useState<{league: string | null, id: string | null}>({league: null, id: null});

  useEffect(() => {
    const fetchData = async () => {
      const details : {league: string | null, id: string | null} = await params;
      setGameDetails(details);
    };
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Game Details</h1>
      <div className="space-y-2">
        <p>League: {gameDetails.league}</p>
        <p>Game ID: {gameDetails.id}</p>
      </div>
    </div>
  );
}
