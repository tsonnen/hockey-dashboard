import React from 'react';

import styles from './game-details-skeleton.module.css';

export const GameDetailsSkeleton: React.FC = () => {
  return (
    <div className="p-4">
      {/* Back Button Skeleton */}
      <div className={styles.backButton} />

      {/* Game Score Display Skeleton */}
      <div className={styles.scoreDisplay} />

      {/* Period Scoring Summary Skeleton */}
      <div className={styles.periodSummary} />

      {/* Game Summary Skeleton */}
      <div className={styles.sectionTitle} />
      <div className={styles.summaryList}>
        {Array.from({ length: 3 }, (_, i: number) => (
          <div key={i} className={styles.periodGoals} />
        ))}
      </div>

      {/* Game Matchup Skeleton */}
      <div className={styles.sectionTitle} />
      <div className={styles.matchupGrid} />
    </div>
  );
};
