import { type ReactElement } from 'react';

import { ImageWithFallback } from '@/app/components/image-with-fallback';
import { useGame } from '@/app/contexts/game-context';

import styles from './game-score-display.module.css';

export function GameScoreDisplay(): ReactElement {
  const { game } = useGame();

  if (!game) {
    return <div>Loading...</div>;
  }

  const { homeTeam, awayTeam } = game;
  const homeScore =
    game.summary?.scoring.reduce(
      (acc, period) => acc + period.goals.filter((goal) => goal.isHome).length,
      0,
    ) ??
    homeTeam.score ??
    0;
  const awayScore =
    game.summary?.scoring.reduce(
      (acc, period) => acc + period.goals.filter((goal) => !goal.isHome).length,
      0,
    ) ??
    awayTeam.score ??
    0;

  return (
    <div className="mb-6 w-full rounded-lg bg-gray-800 p-6 shadow-md">
      <div className="flex items-center justify-between">
        {/* Away Team */}
        <div className="flex flex-1 flex-col items-center">
          <div className="relative mb-2 size-16">
            {awayTeam.logo && (
              <ImageWithFallback
                alt={`${awayTeam.placeName.default} logo`}
                className="object-contain"
                fill
                src={awayTeam.logo}
              />
            )}
          </div>
          <div className="text-center text-lg font-semibold">{awayTeam.placeName.default}</div>
          <div className="mt-2 text-3xl font-bold">{awayScore}</div>
          {awayTeam.sog !== undefined && (
            <div className="mt-1 text-sm text-gray-600">SOG: {awayTeam.sog}</div>
          )}
        </div>

        <div className={styles.gameStatus}>
          {game.gameInProgress && game.clock && (
            <>
              <div className={styles.clock}>{game.clock.timeRemaining}</div>
              <div className={styles.period}>Period {game.period}</div>
            </>
          )}

          <div className={styles.startTime}>{game.statusString}</div>
        </div>

        {/* Home Team */}
        <div className="flex flex-1 flex-col items-center">
          <div className="relative mb-2 size-16">
            {homeTeam.logo && (
              <ImageWithFallback
                alt={`${homeTeam.placeName.default} logo`}
                className="object-contain"
                fill
                src={homeTeam.logo}
              />
            )}
          </div>
          <div className="text-center text-lg font-semibold">{homeTeam.placeName.default}</div>
          <div className="mt-2 text-3xl font-bold">{homeScore}</div>
          {homeTeam.sog !== undefined && (
            <div className="mt-1 text-sm text-gray-600">SOG: {homeTeam.sog}</div>
          )}
        </div>
      </div>
    </div>
  );
}
