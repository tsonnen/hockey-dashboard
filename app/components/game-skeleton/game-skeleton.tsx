import React from 'react';

import styles from './game-skeleton.module.css';

export const GameSkeleton: React.FC = () => {
  return (
    <div className={`${styles.gameCard} animate-pulse`}>
      {/* Away Team */}
      <div className={styles.team}>
        <div className={styles.logo}>
          <div className="size-[60px] rounded-full bg-gray-200"></div>
        </div>
        <div className={styles.teamInfo}>
          <div className={styles.teamStats}>
            <div className="h-6 w-8 rounded bg-gray-200"></div>
            <div className="mt-1 h-4 w-16 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>

      {/* Game Status */}
      <div className={styles.gameStatus}>
        <div className="mb-1 h-5 w-16 rounded bg-gray-200"></div>
        <div className="mb-1 h-4 w-20 rounded bg-gray-200"></div>
        <div className="h-4 w-24 rounded bg-gray-200"></div>
      </div>

      {/* Home Team */}
      <div className={styles.team}>
        <div className={styles.logo}>
          <div className="size-[60px] rounded-full bg-gray-200"></div>
        </div>
        <div className={styles.teamInfo}>
          <div className={styles.teamStats}>
            <div className="h-6 w-8 rounded bg-gray-200"></div>
            <div className="mt-1 h-4 w-16 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
