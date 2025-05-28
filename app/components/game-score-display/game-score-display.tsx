import Image from 'next/image';
import { type ReactElement } from 'react';

import { type Game } from '@/app/models/game';

import styles from './game-score-display.module.css';

interface GameScoreDisplayProps {
  game: Game;
}

export function GameScoreDisplay({ game }: GameScoreDisplayProps): ReactElement {
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
    <div className="w-full bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between">
        {/* Away Team */}
        <div className="flex flex-col items-center flex-1">
          <div className="relative w-16 h-16 mb-2">
            {awayTeam.logo && (
              <Image
                fill
                alt={`${awayTeam.placeName.default} logo`}
                className="object-contain"
                src={awayTeam.logo}
              />
            )}
          </div>
          <div className="text-lg font-semibold text-center">{awayTeam.placeName.default}</div>
          <div className="text-3xl font-bold mt-2">{awayScore}</div>
          {awayTeam.sog !== undefined && (
            <div className="text-sm text-gray-600 mt-1">SOG: {awayTeam.sog}</div>
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
        <div className="flex flex-col items-center flex-1">
          <div className="relative w-16 h-16 mb-2">
            {homeTeam.logo && (
              <Image
                fill
                alt={`${homeTeam.placeName.default} logo`}
                className="object-contain"
                src={homeTeam.logo}
              />
            )}
          </div>
          <div className="text-lg font-semibold text-center">{homeTeam.placeName.default}</div>
          <div className="text-3xl font-bold mt-2">{homeScore}</div>
          {homeTeam.sog !== undefined && (
            <div className="text-sm text-gray-600 mt-1">SOG: {homeTeam.sog}</div>
          )}
        </div>
      </div>
    </div>
  );
}
