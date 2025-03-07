import { Game } from "../models/game";
import startTime from "../utils/start-time";

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  return (
    <span className="game-card">
      <div className="start-time">
        <p>{startTime(game.startTimeUTC)}</p>
      </div>
      <div className="team away-team">
        <div className="logo">
          <img
            src={game.awayTeam.logo}
            alt={`${game.awayTeam.commonName.default} logo`}
          />
        </div>
      </div>
      <div className="vs">vs</div>
      <div className="team home-team">
        <div className="logo">
          <img
            src={game.homeTeam.logo}
            alt={`${game.homeTeam.commonName.default} logo`}
          />
        </div>
      </div>
    </span>
  );
}
