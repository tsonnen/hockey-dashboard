import { useRouter } from 'next/navigation';
import type { JSX } from 'react';

import { TeamDisplay } from '@/app/components/team-display/team-display';
import type { Game } from '@/app/models/game';

import styles from './game-card.module.css';

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps): JSX.Element {
  const router = useRouter();

  const handleClick = (): void => {
    router.push(`/game/${game.league}/${game.id}`);
  };

  return (
    <span
      className={`${styles.gameCard} ${styles.clickable}`}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      <TeamDisplay gameStarted={game.gameStarted} team={game.awayTeam} />
      <div className={styles.gameStatus}>
        {game.gameInProgress && game.clock && (
          <>
            <div className={styles.clock}>{game.clock.timeRemaining}</div>
            <div className={styles.period}>Period {game.period}</div>
          </>
        )}

        <div className={styles.startTime}>{game.statusString}</div>
      </div>
      <TeamDisplay gameStarted={game.gameStarted} team={game.homeTeam} />
    </span>
  );
}
