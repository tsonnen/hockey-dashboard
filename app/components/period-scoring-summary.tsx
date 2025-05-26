import { Game } from "@/app/models/game";
import ordinal_suffix_of from "@/app/utils/ordinal-suffix-of";

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
              {ordinal_suffix_of(period.periodDescriptor.number)}
            </th>
          ))}
          <th className="border border-gray-300 p-2">T</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border border-gray-300 p-2">
            <img
              src={game.homeTeam.logo}
              alt={`${game.homeTeam.placeName.default} logo`}
              className="h-8"
            />
          </td>
          {game.summary.scoring.map((period, i) => (
            <td key={i} className="border border-gray-300 p-2 text-center">
              {period.homeGoals.length}
            </td>
          ))}
          <td className="border border-gray-300 p-2 text-center font-bold">
            {game.homeTeam.score}
          </td>
        </tr>
        <tr>
          <td className="border border-gray-300 p-2">
            <img
              src={game.awayTeam.logo}
              alt={`${game.awayTeam.placeName.default} logo`}
              className="h-8"
            />
          </td>
          {game.summary.scoring.map((period, i) => (
            <td key={i} className="border border-gray-300 p-2 text-center">
              {period.awayGoals.length}
            </td>
          ))}
          <td className="border border-gray-300 p-2 text-center font-bold">
            {game.awayTeam.score}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
