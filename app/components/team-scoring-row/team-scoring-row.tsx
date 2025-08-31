import type { JSX } from 'react';

import { TeamCell } from '@/app/components/team-cell';
import type { Goal } from '@/app/models/game-summary';
import type { Team } from '@/app/models/team';

interface TeamScoringRowProps {
  team: Team;
  periods: {
    homeGoals: Goal[];
    awayGoals: Goal[];
  }[];
  isHome: boolean;
}

export function TeamScoringRow({ team, periods, isHome }: TeamScoringRowProps): JSX.Element {
  return (
    <tr>
      <TeamCell abbrev={team.abbrev} logo={team.logo} teamName={team.placeName.default} />
      {periods.map((period, i) => (
        <td key={i} className="border border-gray-300 p-2 text-center w-12">
          {isHome ? period.homeGoals.length : period.awayGoals.length}
        </td>
      ))}
      <td className="border border-gray-300 p-2 text-center font-bold w-12">{team.score}</td>
    </tr>
  );
}
