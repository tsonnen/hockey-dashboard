import { Game } from "@/app/models/game";
import { TeamDisplay } from "@/app/components/team-display/team-display";
import styles from "./game-card.module.css";
import { useRouter } from "next/navigation";

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/game/${game.league}/${game.id}`);
  };

  return (
    <span 
      className={`${styles.gameCard} ${styles.clickable}`} 
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      <TeamDisplay team={game.awayTeam} gameStarted={game.gameStarted} />
      <div className={styles.gameStatus}>
        {game.gameInProgress && game.clock && (
          <>
            <div className={styles.clock}>{game.clock.timeRemaining}</div>
            <div className={styles.period}>Period {game.period}</div>
          </>
        )}

        <div className={styles.startTime}>{game.statusString}</div>
      </div>
      <TeamDisplay team={game.homeTeam} gameStarted={game.gameStarted} />
    </span>
  );
}
