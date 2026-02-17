import type { JSX } from 'react';
import Link from 'next/link';

import type { Team } from '@/app/models/team';

import { ImageWithFallback } from '../image-with-fallback';

import styles from './team-display.module.css';

interface TeamDisplayProps {
  team: Team;
  gameStarted: boolean;
  score?: number;
  league?: string;
  size?: 'sm' | 'lg';
  showName?: boolean;
}

interface TeamContentProps {
  team: Team;
  gameStarted: boolean;
  score: number;
  showName: boolean;
  logoSize: number;
}

function TeamContent({ team, gameStarted, score, showName, logoSize }: TeamContentProps) {
  return (
    <>
      <div className={styles.logo}>
        <ImageWithFallback
          alt={`${team.placeName.default} logo`}
          height={logoSize}
          quality={100}
          src={team.logo ?? ''}
          width={logoSize}
        />
      </div>
      <div className={styles.teamInfo}>
        {showName && <div className={styles.teamName}>{team.placeName.default}</div>}
        {gameStarted && (
          <div className={styles.teamStats}>
            <div className={styles.score}>{score}</div>
            {team.sog !== undefined && <div className={styles.shots}>SOG: {team.sog ?? 0}</div>}
          </div>
        )}
      </div>
    </>
  );
}

export function TeamDisplay({
  team,
  gameStarted,
  score,
  league,
  size = 'sm',
  showName = false,
}: TeamDisplayProps): JSX.Element {
  const displayScore = score ?? team.score ?? 0;
  const isLarge = size === 'lg';
  const logoSize = isLarge ? 80 : 60;

  const teamId = league === 'nhl' ? team.abbrev : team.id;
  const href = league ? `/team/${league}/${teamId}` : undefined;

  const content = (
    <TeamContent
      team={team}
      gameStarted={gameStarted}
      score={displayScore}
      showName={showName}
      logoSize={logoSize}
    />
  );

  const className = `${styles.team} ${isLarge ? styles.teamLg : ''}`;

  if (href) {
    return (
      <div className={className}>
        <Link href={href} className={styles.link}>
          {content}
        </Link>
      </div>
    );
  }

  return <div className={className}>{content}</div>;
}
