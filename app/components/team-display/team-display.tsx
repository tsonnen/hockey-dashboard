import type { Team } from '@/app/models/team';

import styles from './team-display.module.css';

interface TeamDisplayProps {
  team: Team;
  gameStarted: boolean;
}

export function TeamDisplay({ team, gameStarted }: TeamDisplayProps) {
  return (
    <div className={styles.team}>
      <div className={styles.logo}>
        <img alt={`${team.placeName.default} logo`} src={team.logo} />
      </div>
      <div className={styles.teamInfo}>
        {gameStarted && (
          <div className={styles.teamStats}>
            <div className={styles.score}>{team.score ?? 0}</div>
            <div className={styles.shots}>SOG: {team.sog ?? 0}</div>
          </div>
        )}
      </div>
    </div>
  );
}
