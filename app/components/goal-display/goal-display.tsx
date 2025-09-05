import type { JSX } from 'react';

import fallbackHeadshot from '@/app/assets/headshot-fallback.png';
import { ImageWithFallback } from '@/app/components/image-with-fallback';
import type { Game } from '@/app/models/game';
import type { Goal, Player } from '@/app/models/game-summary';

interface GoalDisplayProps {
  goal: Goal;
  game: Game;
}

export function GoalDisplay({ goal, game }: GoalDisplayProps): JSX.Element {
  return (
    <div className="flex items-center gap-2">
      <span className="font-medium">{goal.timeInPeriod}</span>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <div className="p-1">
            <ImageWithFallback
              alt={goal.name.default}
              className="w-8 h-8 rounded-full"
              fallBackSrc={fallbackHeadshot.src}
              height={32}
              quality={100}
              src={goal.headshot}
              width={32}
            />
          </div>
          <span>{goal.name.default}</span>
          <span className="text-gray-600">
            ({goal.awayScore}-{goal.homeScore})
          </span>
          {(goal.situationCode === 'PP' || goal.strength.toUpperCase() === 'PP') && (
            <span className="text-blue-600">PP</span>
          )}
          {(goal.situationCode === 'SH' || goal.strength.toUpperCase() === 'SH') && (
            <span className="text-red-600">SH</span>
          )}
        </div>
        <div className="flex items-center">
          <div className="p-1">
            {goal.isHome ? (
              <ImageWithFallback
                alt={game.homeTeam.placeName.default}
                className="w-8 h-8 rounded-full"
                height={32}
                quality={100}
                src={game.homeTeam.logo ?? ''}
                width={32}
              />
            ) : (
              <ImageWithFallback
                alt={game.awayTeam.placeName.default}
                className="w-8 h-8 rounded-full"
                height={32}
                quality={100}
                src={game.awayTeam.logo ?? ''}
                width={32}
              />
            )}
          </div>
          {goal.assists.length > 0 && (
            <div className="text-sm text-gray-500 ml-5">
              {goal.assists.map((assist: Player) => assist.name.default).join(', ')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
