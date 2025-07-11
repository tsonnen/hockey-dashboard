import type { JSX } from 'react';

import { TeamScoringRow } from '@/app/components/team-scoring-row';
import { useGame } from '@/app/contexts/game-context';
import { PeriodStats } from '@/app/models/game-summary';

export function PeriodScoringSummary(): JSX.Element {
  const { game } = useGame();

  if (!game) {
    return <div>Loading...</div>;
  }

  const periodScoringSummary = game.summary?.scoring ?? [];

  // Ensure the 3 regulation periods always show
  while (periodScoringSummary.length < 3) {
    periodScoringSummary.push(
      new PeriodStats({
        periodDescriptor: {
          number: periodScoringSummary.length + 1,
          periodType: 'REG',
          maxRegulationPeriods: 3,
        },
        goals: [],
      }),
    );
  }

  return (
    <table className="border-collapse rounded-lg">
      <thead>
        <tr>
          <th className="px-4 py-2 text-left">Team</th>
          {periodScoringSummary.map((period) => (
            <th key={period.periodDescriptor.number} className="px-4 py-2 text-center">
              {period.periodCommonName}
            </th>
          ))}
          <th className="px-4 py-2 text-center">Total</th>
        </tr>
      </thead>
      <tbody>
        <TeamScoringRow isHome={false} periods={periodScoringSummary} team={game.awayTeam} />
        <TeamScoringRow isHome={true} periods={periodScoringSummary} team={game.homeTeam} />
      </tbody>
    </table>
  );
}
