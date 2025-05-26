import type { Game } from '@/app/models/game';
import type { PeriodGoals } from '@/app/models/game-summary';

import { GoalDisplay } from './goal-display';

interface PeriodGoalsDisplayProps {
  period: PeriodGoals;
  game: Game;
}

export function PeriodGoalsDisplay({ period, game }: PeriodGoalsDisplayProps) {
  return (
    <div className="border rounded p-4">
      <h3 className="font-medium mb-2">{period.periodCommonName}</h3>
      <div className="space-y-2">
        {period.goals.length > 0 ? (
          period.goals.map((goal, j) => (
            <GoalDisplay key={j} game={game} goal={goal} />
          ))
        ) : (
          <div className="text-gray-500 italic">
            No goals scored in this period
          </div>
        )}
      </div>
    </div>
  );
}
