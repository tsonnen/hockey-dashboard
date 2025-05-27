'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, type JSX } from 'react';

import { Loader } from '@/app/components/loader/loader';
import { PeriodGoalsDisplay } from '@/app/components/period-goals-display';
import { PeriodScoringSummary } from '@/app/components/period-scoring-summary';
import { Game } from '@/app/models/game';
import {
  convertHockeyTechGameDetails,
  type HockeyTechGameDetails,
} from '@/app/models/hockeytech-game-details';

interface GamePageProps {
  params: Promise<{
    id: string;
    league: string;
  }>;
}

export default function GamePage({ params }: GamePageProps): JSX.Element {
  const [game, setGame] = useState<Game>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const { league, id } = await params;

        switch (league) {
          case 'nhl': {
            const response = await fetch(`/api/nhl/game/${id}`);
            const data = (await response.json()) as Partial<Game>;
            setGame(new Game(data));
            break;
          }
          case 'ohl':
          case 'whl':
          case 'qmjhl':
          case 'ahl':
          case 'echl':
          case 'pwhl': {
            const response = await fetch(`/api/hockeytech/${league}/game/${id}`);
            const data = (await response.json()) as HockeyTechGameDetails;
            setGame(new Game(convertHockeyTechGameDetails(data, league)));
            break;
          }
          default:
            break;
        }
      } catch (error) {
        console.error('Error fetching game data:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [params]);

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
        className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        onClick={() => {
          router.back();
        }}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back
      </button>

      {game.summary && (
        <div className="mb-4">
          {/* todo: Show game score and SOG here */}
          <div className="flex items-center justify-center">
            <PeriodScoringSummary game={game} />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Game Summary</h2>
            <div className="space-y-4">
              {game.summary.scoring.map((period, i) => (
                <PeriodGoalsDisplay key={i} game={game} period={period} />
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
