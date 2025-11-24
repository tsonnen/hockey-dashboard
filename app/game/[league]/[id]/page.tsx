'use client';

import { useEffect, type JSX } from 'react';
import { BackButton } from '@/app/components/back-button';
import { GameDetailsSkeleton } from '@/app/components/game-details-skeleton';
import { GameScoreDisplay } from '@/app/components/game-score-display';
import { PeriodGoalsDisplay } from '@/app/components/period-goals-display';
import { PeriodScoringSummary } from '@/app/components/period-scoring-summary';
import { GameProvider, useGame } from '@/app/contexts/game-context';
import { Game } from '@/app/models/game';
import {
  convertHockeyTechGameDetails,
  type HockeyTechGameDetails,
} from '@/app/models/hockeytech-game-details';
import { SkaterComparison } from '@/app/components/skater-comparison/skater-comparison';
import { GoalieComparison } from '@/app/components/goalie-comparison/goalie-comparison';
import { GameMatchup } from '@/app/models/game-matchup';

function GameMatchupSection(matchup: GameMatchup): JSX.Element {
  return (
    <section className="mb-6">
      <h2 className="mb-2 text-center text-xl font-semibold">Game Matchup</h2>
      <div className="grid grid-cols-2">
        {matchup.skaterComparison && (
          <SkaterComparison leaders={matchup.skaterComparison.leaders} />
        )}
        {matchup.goalieComparison && (
          <GoalieComparison
            homeTeam={matchup.goalieComparison.homeTeam}
            awayTeam={matchup.goalieComparison.awayTeam}
          />
        )}
      </div>
    </section>
  );
}

interface GamePageProps {
  params: Promise<{
    id: string;
    league: string;
  }>;
}

function GamePageContent({ params }: GamePageProps): JSX.Element {
  const { game, setGame } = useGame();

  useEffect(() => {
    async function fetchGame(): Promise<void> {
      try {
        const { league, id } = await params;

        switch (league) {
          case 'nhl': {
            const response = await fetch(`/api/nhl/game/${id}`);
            if (!response.ok) {
              throw new Error('Failed to fetch game');
            }
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
            if (!response.ok) {
              throw new Error('Failed to fetch game');
            }
            const data = (await response.json()) as HockeyTechGameDetails;
            setGame(new Game(convertHockeyTechGameDetails(data, league)));
            break;
          }
          default: {
            break;
          }
        }
      } catch (error) {
        console.error('Error fetching game:', error);
      }
    }

    void fetchGame();
  }, [params, setGame]);

  if (!game) {
    return <GameDetailsSkeleton />;
  }

  return (
    <div className="p-4">
      <BackButton className="mb-4" />

      <GameScoreDisplay />

      {game.summary && (
        <div className="mb-4">
          <div className="flex items-center justify-center">
            <PeriodScoringSummary />
          </div>
          <div>
            <h2 className="mb-2 text-xl font-semibold">Game Summary</h2>
            <div className="space-y-4">
              {game.summary.scoring.map((period, i) => (
                <PeriodGoalsDisplay key={i} period={period} />
              ))}
            </div>
          </div>
        </div>
      )}

      {game.matchup && <GameMatchupSection {...game.matchup} />}
    </div>
  );
}

export default function GamePage(props: GamePageProps): JSX.Element {
  return (
    <GameProvider>
      <GamePageContent {...props} />
    </GameProvider>
  );
}
