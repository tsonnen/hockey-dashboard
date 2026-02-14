import Link from 'next/link';
import { type ReactElement } from 'react';

import { ImageWithFallback } from '@/app/components/image-with-fallback';
import { useGame } from '@/app/contexts/game-context';
import type { Game } from '@/app/models/game';
import type { Team } from '@/app/models/team';
import styles from './game-score-display.module.css';

export function GameScoreDisplay(): ReactElement {
  const { game } = useGame();

  if (!game) {
    return <div>Loading...</div>;
  }

  const { homeTeam, awayTeam } = game;
  const homeScore = calculateScore(game, true);
  const awayScore = calculateScore(game, false);

  return (
    <div
      className="mb-6 w-full rounded-lg bg-gray-200 p-6 shadow-md dark:bg-gray-800"
      data-testid="game-score-display"
    >
      <div className="flex items-center justify-between">
        <TeamDisplay 
          isHome={false} 
          league={game.league}
          gameStarted={game.gameStarted}
          score={awayScore} 
          team={awayTeam} 
        />

        <div className={styles.gameStatus}>
          {game.gameInProgress && game.clock && (
            <>
              <div className={styles.clock}>{game.clock.timeRemaining}</div>
              <div className={styles.period}>Period {game.period}</div>
            </>
          )}
          <div className={styles.startTime}>{game.statusString}</div>
        </div>

        <TeamDisplay 
          isHome={true} 
          league={game.league}
          gameStarted={game.gameStarted}
          score={homeScore} 
          team={homeTeam} 
        />
      </div>
    </div>
  );
}

function calculateScore(game: Game, isHome: boolean): number {
  const summaryGoals = game.summary?.scoring.reduce(
    (acc: number, period) => acc + period.goals.filter((goal) => goal.isHome === isHome).length,
    0,
  );
  return summaryGoals ?? (isHome ? game.homeTeam.score : game.awayTeam.score) ?? 0;
}

function TeamDisplay({ team, score, league, gameStarted, isHome }: { team: Team, score: number, league: string, gameStarted: boolean, isHome: boolean }) {
  const testId = isHome ? 'home-team' : 'away-team';
  const teamId = league === 'nhl' ? team.abbrev : team.id;
  
  return (
    <div className="flex flex-1 flex-col items-center" data-testid={testId}>
      <Link
        className="flex flex-col items-center hover:opacity-80"
        href={`/team/${league}/${teamId}`}
      >
        <div className="relative mb-2 size-16">
          {team.logo && (
            <ImageWithFallback
              alt={`${team.placeName.default} logo`}
              className="object-contain"
              fill
              src={team.logo}
              dataTestId={`${testId}-logo`}
            />
          )}
        </div>
        <div className="text-center text-lg font-semibold">{team.placeName.default}</div>
      </Link>
      {gameStarted && (
        <div className="mt-2 text-3xl font-bold" data-testid={`${testId}-score`}>
          {score}
        </div>
      )}
      {team.sog !== undefined && gameStarted && (
        <div className="mt-1 text-sm text-gray-600">SOG: {team.sog}</div>
      )}
    </div>
  );
}
