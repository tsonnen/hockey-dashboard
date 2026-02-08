import { Player } from '@/app/models/team-details';
import { ImageWithFallback } from '../image-with-fallback';

interface TeamRosterProps {
  roster: {
    forwards: Player[];
    defensemen: Player[];
    goalies: Player[];
  };
}

function PlayerCard({ player }: { player: Player }) {
  return (
    <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="relative size-12 overflow-hidden rounded-full bg-gray-100">
        {player.headshot ? (
           <ImageWithFallback
             src={player.headshot}
             alt={`${player.firstName.default} ${player.lastName.default}`}
             fill
             className="object-cover"
           />
        ) : (
           <div className="flex size-full items-center justify-center text-gray-400">
             User
           </div>
        )}
      </div>
      <div>
        <div className="font-semibold">{player.firstName.default} {player.lastName.default}</div>
        <div className="text-sm text-gray-500">#{player.sweaterNumber} | {player.positionCode}</div>
        <div className="text-xs text-gray-400">
          GP: {player.gamesPlayed ?? '-'} | G: {player.goals ?? '-'} | A: {player.assists ?? '-'} | P: {player.points ?? '-'}
        </div>
      </div>
    </div>
  );
}

export function TeamRoster({ roster }: TeamRosterProps) {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="mb-3 text-xl font-bold">Forwards</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roster.forwards.map((p) => (
            <PlayerCard 
              key={`fwd-${p.id || `${p.firstName.default}-${p.lastName.default}-${p.sweaterNumber}`}`} 
              player={p} 
            />
          ))}
        </div>
      </section>
      
      <section>
        <h3 className="mb-3 text-xl font-bold">Defensemen</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roster.defensemen.map((p) => (
            <PlayerCard 
              key={`def-${p.id || `${p.firstName.default}-${p.lastName.default}-${p.sweaterNumber}`}`} 
              player={p} 
            />
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-xl font-bold">Goalies</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roster.goalies.map((p) => (
            <PlayerCard 
              key={`gl-${p.id || `${p.firstName.default}-${p.lastName.default}-${p.sweaterNumber}`}`} 
              player={p} 
            />
          ))}
        </div>
      </section>
    </div>
  );
}
