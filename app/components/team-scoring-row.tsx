import { Team } from "@/app/models/team";
import { Goal } from "@/app/models/game-summary";
import { TeamCell } from "./team-cell";

interface TeamScoringRowProps {
  team: Team;
  periods: Array<{
    homeGoals: Goal[];
    awayGoals: Goal[];
  }>;
  isHome: boolean;
}

export function TeamScoringRow({ team, periods, isHome }: TeamScoringRowProps) {
  return (
    <tr>
      <TeamCell
        logo={team.logo}
        teamName={team.placeName.default}
        abbrev={team.abbrev}
      />
      {periods.map((period, i) => (
        <td key={i} className="border border-gray-300 p-2 text-center">
          {isHome ? period.homeGoals.length : period.awayGoals.length}
        </td>
      ))}
      <td className="border border-gray-300 p-2 text-center font-bold">
        {team.score}
      </td>
    </tr>
  );
} 