import type { JSX } from 'react';

import { GoalDisplay } from '@/app/components/goal-display';
import { useGame } from '@/app/contexts/game-context';
import type { PeriodStats } from '@/app/models/game-summary';

interface PeriodGoalsDisplayProps {
  period: PeriodStats;
}

export function PeriodGoalsDisplay({ period }: PeriodGoalsDisplayProps): JSX.Element {
  const { game } = useGame();

  if (!game) {
    return <div>Loading...</div>;
  }

  return (
    <div className="rounded border p-4">
      <h3 className="mb-2 font-medium">{period.periodCommonName}</h3>
      <div className="space-y-2">
        {period.goals.length > 0 ? (
          period.goals.map((goal, j) => <GoalDisplay key={j} game={game} goal={goal} />)
        ) : (
          <div className="italic text-gray-500">No goals scored in this period</div>
        )}
      </div>
    </div>
  );
}
