import { GameSummary, PeriodGoals } from "@/app/models/game-summary";

interface ScoringSummaryProps {
  scoring: PeriodGoals[];
}

export function ScoringSummary({ scoring }: ScoringSummaryProps) {
  const { homeScore, awayScore } = scoring.reduce(
    (totalScores, period) => {
      totalScores.awayScore += period.awayGoals.length;
      totalScores.homeScore += period.homeGoals.length;

      return totalScores;
    },
    { awayScore: 0, homeScore: 0 }
  );
  return (
    <div className="grid grid-flow-col justify-self-center">
      {scoring.map((period, i) => (
        <div key={i} className="border border-gray-300">
          <div className="font-bold border-b border-gray-300 p-2">{period.periodDescriptor.number}</div>
          <div className="grid col gap-2 p-2">
            <div className="border-b border-gray-300 pb-1">{period.homeGoals.length}</div>
            <div className="pb-1">{period.awayGoals.length}</div>
          </div>
        </div>
      ))}
      <div key="total-score" className="border border-gray-300">
        <div className="font-bold border-b border-gray-300 p-2">{"Total"}</div>
        <div className="grid col gap-2 p-2">
          <div className="border-b border-gray-300 pb-1">{homeScore}</div>
          <div className="pb-1">{awayScore}</div>
        </div>
      </div>
    </div>
  );
}
