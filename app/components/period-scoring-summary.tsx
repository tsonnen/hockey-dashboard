import { Game } from "@/app/models/game";
import { TeamScoringRow } from "./team-scoring-row";

interface PeriodScoringSummaryProps {
  game: Game;
}

export function PeriodScoringSummary({ game }: PeriodScoringSummaryProps) {
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
          team={game.awayTeam}
          periods={game.summary.scoring}
          isHome={false}
        />
        <TeamScoringRow
          team={game.homeTeam}
          periods={game.summary.scoring}
          isHome={true}
        />
      </tbody>
    </table>
  );
}
