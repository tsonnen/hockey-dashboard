import { type ReactElement } from 'react';
import { TeamDisplay } from '@/app/components/team-display';
import { useGame } from '@/app/contexts/game-context';
import type { Game } from '@/app/models/game';
import { formatDate } from '@/app/utils';
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
          gameStarted={game.gameStarted}
          team={awayTeam}
          score={awayScore}
          league={game.league}
          size="lg"
          showName={true}
          dataTestId="away-team"
        />

        <div className={styles.gameStatus}>
          <div className={styles.gameDate} data-testid="game-date">
            {formatDate(game.startTimeUTC)}
          </div>
          {game.gameInProgress && game.clock && (
            <>
              <div className={styles.clock}>{game.clock.timeRemaining}</div>
              <div className={styles.period}>Period {game.period}</div>
            </>
          )}
          <div className={styles.startTime}>{game.statusString}</div>
        </div>

        <TeamDisplay
          gameStarted={game.gameStarted}
          team={homeTeam}
          score={homeScore}
          league={game.league}
          size="lg"
          showName={true}
          dataTestId="home-team"
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
