import React from 'react';
import { ImageWithFallback } from '../image-with-fallback';
import fallbackHeadshot from '@/app/assets/headshot-fallback.png';

interface PlayerStatCellProps {
  headshot: string;
  name: string;
  sweaterNumber: number;
  position: string;
  stats: Array<{ value: number | string; statLabel?: string }>;
}

export function PlayerStatCell({
  headshot,
  name,
  sweaterNumber,
  position,
  stats,
}: PlayerStatCellProps) {
  const getStatStrings = () => {
    return stats.map((stat, idx) => (
      <span
        key={`${stat.statLabel ?? ''}-${stat.value}-${idx}`}
        className="text-lg font-semibold text-gray-600"
      >{`${stat.value} ${stat.statLabel ?? ''}`}</span>
    ));
  };

  return (
    <div className="grid grid-cols-2 space-y-2">
      <div className="flex flex-row items-center space-x-2">
        <ImageWithFallback
          src={headshot}
          alt={name}
          className="size-8 rounded-full border border-gray-300 object-cover"
          fallBackSrc={fallbackHeadshot.src}
          width={40}
          height={40}
        />
        <span className="text-sm font-medium">
          {name}
          <span className="mx-2 text-xs text-gray-500">
            #{sweaterNumber} {position}
          </span>
        </span>
      </div>
      <div className="flex flex-col align-middle">{getStatStrings()}</div>
    </div>
  );
}
