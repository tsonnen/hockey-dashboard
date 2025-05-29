import Image from 'next/image';
import type { JSX } from 'react';

import type { Team } from '@/app/models/team';

import styles from './team-display.module.css';

interface TeamDisplayProps {
  team: Team;
  gameStarted: boolean;
}

export function TeamDisplay({ team, gameStarted }: TeamDisplayProps): JSX.Element {
  return (
    <div className={styles.team}>
      <div className={styles.logo}>
        <Image
          alt={`${team.placeName.default} logo`}
          height={60}
          quality={100}
          src={team.logo ?? ''}
          width={60}
        />
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
