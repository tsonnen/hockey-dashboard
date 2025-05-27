import type { JSX } from 'react';

import type { Game } from '@/app/models/game';

import { TeamScoringRow } from './team-scoring-row';

interface PeriodScoringSummaryProps {
  game: Game;
}

export function PeriodScoringSummary({ game }: PeriodScoringSummaryProps): JSX.Element | null {
  if (!game.summary?.scoring) {
    return null;
  }

  return (
    <table className="border-collapse">
      <thead>
        <tr>
          <th className="border border-gray-300 p-2"></th>
          {game.summary.scoring.map((period, i) => (
            <th key={i} className="border border-gray-300 p-2">
              {period.periodCommonName}
            </th>
          ))}
          <th className="border border-gray-300 p-2">T</th>
        </tr>
      </thead>
      <tbody>
        <TeamScoringRow
          isHome={false}
          periods={game.summary.scoring}
          team={game.awayTeam}
        />
        <TeamScoringRow
          isHome={true}
          periods={game.summary.scoring}
          team={game.homeTeam}
        />
      </tbody>
    </table>
  );
}
