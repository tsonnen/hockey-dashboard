import { PlayerStatCell } from '../player-stat-cell/player-stat-cell';
import { titleCase } from '@/app/utils';
import type { SkaterComparisonProps } from '@/app/models/game-matchup';

export function SkaterComparison({ leaders }: { leaders: SkaterComparisonProps['leaders'] }) {
  return (
    <div className="mb-4">
      <h3 className="mb-2 text-lg font-semibold">Skater Stat Leaders</h3>
      <div className="space-y-4">
        {leaders.map((cat) => (
          <div key={cat.category}>
            <h4 className="mb-2 font-medium">{titleCase(cat.category)}</h4>
            <div className="space-y-2">
              <div>
                <p className="mb-1 text-xs text-gray-600">Away</p>
                <PlayerStatCell
                  headshot={cat.awayLeader.headshot}
                  name={cat.awayLeader.name.default}
                  sweaterNumber={cat.awayLeader.sweaterNumber}
                  position={cat.awayLeader.positionCode}
                  stats={[{ value: cat.awayLeader.value }]}
                />
              </div>
              <div>
                <p className="mb-1 text-xs text-gray-600">Home</p>
                <PlayerStatCell
                  headshot={cat.homeLeader.headshot}
                  name={cat.homeLeader.name.default}
                  sweaterNumber={cat.homeLeader.sweaterNumber}
                  position={cat.homeLeader.positionCode}
                  stats={[{ value: cat.homeLeader.value }]}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
