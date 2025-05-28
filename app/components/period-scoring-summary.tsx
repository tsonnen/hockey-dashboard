import type { JSX } from 'react';

import type { Game } from '@/app/models/game';

import { PeriodStats } from '../models/game-summary';

import { TeamScoringRow } from './team-scoring-row';

interface PeriodScoringSummaryProps {
  game: Game;
}

export function PeriodScoringSummary({ game }: PeriodScoringSummaryProps): JSX.Element | null {
  if (!game.summary?.scoring) {
    return null;
  }

  const periodScoringSummary = game.summary.scoring;

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
    <table className="border-collapse">
      <thead>
        <tr>
          <th className="border border-gray-300 p-2"></th>
          {periodScoringSummary.map((period, i) => (
            <th key={i} className="border border-gray-300 p-2">
              {period.periodCommonName}
            </th>
          ))}
          <th className="border border-gray-300 p-2">T</th>
        </tr>
      </thead>
      <tbody>
        <TeamScoringRow isHome={false} periods={periodScoringSummary} team={game.awayTeam} />
        <TeamScoringRow isHome={true} periods={periodScoringSummary} team={game.homeTeam} />
      </tbody>
    </table>
  );
}
