import React from 'react';
import { PlayerStatCell } from '../player-stat-cell/player-stat-cell';
import { GoalieComparisonProps, GoalieProps } from '@/app/models/game-matchup';

const filterGoaliesWhoPlayed = (goalies: GoalieProps[]) => {
  return goalies.filter((goalie) => goalie.gamesPlayed > 0);
};

export function GoalieComparison({
  homeTeam,
  awayTeam,
}: {
  homeTeam: GoalieComparisonProps['homeTeam'];
  awayTeam: GoalieComparisonProps['awayTeam'];
}) {
  homeTeam.leaders = filterGoaliesWhoPlayed(homeTeam.leaders);
  awayTeam.leaders = filterGoaliesWhoPlayed(awayTeam.leaders);
  return (
    <div className="mb-4">
      <h3 className="mb-2 text-lg font-semibold">Goalies</h3>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <h4 className="mb-1 font-medium">Away Team</h4>
          <div className="space-y-2">
            {awayTeam.leaders.map((goalie) => (
              <PlayerStatCell
                key={goalie.playerId}
                headshot={goalie.headshot}
                name={goalie.name.default}
                sweaterNumber={goalie.sweaterNumber}
                position={goalie.positionCode}
                stats={[
                  { value: goalie.gaa, statLabel: 'GAA' },
                  { value: goalie.savePctg, statLabel: 'SVP' },
                ]}
              />
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-1 font-medium">Home Team</h4>
          <div className="space-y-2">
            {homeTeam.leaders.map((goalie) => (
              <PlayerStatCell
                key={goalie.playerId}
                headshot={goalie.headshot}
                name={goalie.name.default}
                sweaterNumber={goalie.sweaterNumber}
                position={goalie.positionCode}
                stats={[
                  { value: goalie.gaa, statLabel: 'GAA' },
                  { value: goalie.savePctg, statLabel: 'SVP' },
                ]}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
