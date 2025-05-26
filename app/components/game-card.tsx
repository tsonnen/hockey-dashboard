import { TeamDisplay } from '@/app/components/team-display/team-display';
import type { Game } from '@/app/models/game';

import styles from './game-card.module.css';

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  return (
    <span className={styles.gameCard}>
      <TeamDisplay gameStarted={game.gameStarted} team={game.awayTeam} />
      <div className={styles.gameStatus}>
        {game.gameStarted && game.clock && (
          <>
            <div className={styles.clock}>{game.clock.timeRemaining}</div>
            <div className={styles.period}>Period {game.period}</div>
          </>
        )}
        {!game.gameStarted && (
          <div className={styles.startTime}>{game.statusString}</div>
        )}
      </div>
      <TeamDisplay gameStarted={game.gameStarted} team={game.homeTeam} />
    </span>
  );
}
