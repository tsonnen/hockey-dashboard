import { Goal, Player } from "@/app/models/game-summary";
import { Game } from "@/app/models/game";

interface GoalDisplayProps {
  goal: Goal;
  game: Game;
}

export function GoalDisplay({ goal, game }: GoalDisplayProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-medium">{goal.timeInPeriod}</span>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <img
            src={goal.headshot}
            alt={goal.name.default}
            className="w-8 h-8 rounded-full"
          />
          <span>{goal.name.default}</span>
          <span className="text-gray-600">
            ({goal.awayScore}-{goal.homeScore})
          </span>
          {(goal.situationCode === "PP" || goal.strength.toUpperCase() === "PP") && (
            <span className="text-blue-600">PP</span>
          )}
          {(goal.situationCode === "SH" || goal.strength.toUpperCase() === "SH") && (
            <span className="text-red-600">SH</span>
          )}
        </div>
        <div className="flex items-center">
          {goal.isHome ? (
            <img
              src={game.homeTeam.logo}
              alt={game.homeTeam.placeName.default}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <img
              src={game.awayTeam.logo}
              alt={game.awayTeam.placeName.default}
              className="w-8 h-8 rounded-full"
            />
          )}
          {goal.assists.length > 0 && (
            <div className="text-sm text-gray-500 ml-5">
              {goal.assists.map((assist: Player) => assist.name.default).join(", ")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 