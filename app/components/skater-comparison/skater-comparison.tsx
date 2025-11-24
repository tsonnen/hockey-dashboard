import React from 'react';
import { PlayerStatCell } from '../player-stat-cell/player-stat-cell';
import { titleCase } from '@/app/utils';
import { SkaterComparisonProps } from '@/app/models/game-matchup';

export function SkaterComparison({ leaders }: { leaders: SkaterComparisonProps['leaders'] }) {
  return (
    <div className="mb-4">
      <h3 className="mb-2 text-lg font-semibold">Skater Stat Leaders</h3>
      <div className="space-y-2">
        {leaders.map((cat) => (
          <div key={cat.category}>
            <h2>{titleCase(cat.category)}</h2>
            <PlayerStatCell
              headshot={cat.awayLeader.headshot}
              name={cat.awayLeader.name.default}
              sweaterNumber={cat.awayLeader.sweaterNumber}
              position={cat.awayLeader.positionCode}
              stats={[{ value: cat.awayLeader.value }]}
            />
            <PlayerStatCell
              headshot={cat.homeLeader.headshot}
              name={cat.homeLeader.name.default}
              sweaterNumber={cat.homeLeader.sweaterNumber}
              position={cat.homeLeader.positionCode}
              stats={[{ value: cat.homeLeader.value }]}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
