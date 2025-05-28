'use client';

import { useState, useEffect, type JSX } from 'react';

import { BackButton } from '@/app/components/back-button';
import { GameScoreDisplay } from '@/app/components/game-score-display/game-score-display';
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
      <BackButton className="mb-4" />

      <GameScoreDisplay game={game} />

      {game.summary && (
        <div className="mb-4">
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
