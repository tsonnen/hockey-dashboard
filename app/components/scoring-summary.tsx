import { Game } from "../models/game";

interface ScoringSummaryProps {
  game: Game;
}

export function ScoringSummary({ game }: ScoringSummaryProps) {
  return (
    <div className="inline-grid auto-cols-fr grid-flow-col justify-self-center">
      <div key="team-icons" className="border border-gray-300">
        <div className="font-bold border-b border-gray-300 p-2" />
        <div className="grid col gap-2 p-2">
          <div className="border-b border-gray-300 pb-1">
            <img
              src={game.homeTeam.logo}
              alt={`${game.homeTeam.placeName.default} logo`}
            />
          </div>
          <div className="pb-1">
            <img
              src={game.awayTeam.logo}
              alt={`${game.awayTeam.placeName.default} logo`}
            />
          </div>
        </div>
      </div>
      {game.summary.scoring.map((period, i) => (
        <div key={i} className="border border-gray-300">
          <div className="font-bold border-b border-gray-300 p-2">
            {period.periodDescriptor.number}
          </div>
          <div className="grid col gap-2 p-2">
            <div className="border-b border-gray-300 pb-1">
              {period.homeGoals.length}
            </div>
            <div className="pb-1">{period.awayGoals.length}</div>
          </div>
        </div>
      ))}
      <div key="total-score" className="border border-gray-300">
        <div className="font-bold border-b border-gray-300 p-2">{"T"}</div>
        <div className="grid col gap-2 p-2">
          <div className="border-b border-gray-300 pb-1">
            {game.homeTeam.score}
          </div>
          <div className="pb-1">{game.awayTeam.score}</div>
        </div>
      </div>
    </div>
  );
}
