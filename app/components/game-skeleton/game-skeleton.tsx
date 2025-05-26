import React from 'react';
import styles from './game-skeleton.module.css';

export const GameSkeleton: React.FC = () => {
  return (
    <div className={`${styles.gameCard} animate-pulse`}>
      {/* Away Team */}
      <div className={styles.team}>
        <div className={styles.logo}>
          <div className="w-[60px] h-[60px] bg-gray-200 rounded-full"></div>
        </div>
        <div className={styles.teamInfo}>
          <div className={styles.teamStats}>
            <div className="h-6 w-8 bg-gray-200 rounded"></div>
            <div className="h-4 w-16 bg-gray-200 rounded mt-1"></div>
          </div>
        </div>
      </div>

      {/* Game Status */}
      <div className={styles.gameStatus}>
        <div className="h-5 w-16 bg-gray-200 rounded mb-1"></div>
        <div className="h-4 w-20 bg-gray-200 rounded mb-1"></div>
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
      </div>

      {/* Home Team */}
      <div className={styles.team}>
        <div className={styles.logo}>
          <div className="w-[60px] h-[60px] bg-gray-200 rounded-full"></div>
        </div>
        <div className={styles.teamInfo}>
          <div className={styles.teamStats}>
            <div className="h-6 w-8 bg-gray-200 rounded"></div>
            <div className="h-4 w-16 bg-gray-200 rounded mt-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
}; 