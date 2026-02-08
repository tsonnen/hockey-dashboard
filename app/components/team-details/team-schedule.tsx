import { ScheduledGame } from '@/app/models/team-details';
import Link from 'next/link';

interface TeamScheduleProps {
  upcoming: ScheduledGame[];
  last10: ScheduledGame[];
  league: string;
}

function GameRow({ game, league }: { game: ScheduledGame; league: string }) {
  // Ensure date is parsed as local date to avoid timezone shifts
  const date = new Date(game.date + 'T00:00:00').toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  
  // Determine opponent
  // This row is rendered in context of a team page, but we don't know which one "we" are easily unless passed.
  // But typically we show Home vs Away.
  
  return (
    <Link 
      href={`/game/${league}/${game.id}`}
      className="flex items-center justify-between rounded-lg border border-gray-200 p-3 transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
    >
      <div className="text-sm font-medium text-gray-500">{date}</div>
      <div className="flex flex-1 items-center justify-center space-x-4">
        <div className="text-right">
             <div className="font-semibold">{game.awayTeam.abbrev}</div>
             {game.awayTeam.score !== undefined && <div className="text-lg">{game.awayTeam.score}</div>}
        </div>
        <div className="text-gray-400">@</div>
        <div className="text-left">
             <div className="font-semibold">{game.homeTeam.abbrev}</div>
             {game.homeTeam.score !== undefined && <div className="text-lg">{game.homeTeam.score}</div>}
        </div>
      </div>
      <div className="w-20 text-right text-sm font-medium">
         {game.gameState === 'Final' || game.gameState === 'OFFICIAL' ? 'Final' : game.startTime}
      </div>
    </Link>
  );
}

export function TeamSchedule({ upcoming, last10, league }: TeamScheduleProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <section>
        <h3 className="mb-3 text-xl font-bold">Upcoming</h3>
        <div className="space-y-2">
          {upcoming.length === 0 ? (
             <p className="text-gray-500">No upcoming games scheduled.</p>
          ) : (
             upcoming.map((g) => <GameRow key={g.id} game={g} league={league} />)
          )}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-xl font-bold">Last 10 Games</h3>
        <div className="space-y-2">
          {last10.length === 0 ? (
             <p className="text-gray-500">No games played.</p>
          ) : (
             // Last 10 typically shown strictly chronological or reverse?
             // Usually reverse chronological (most recent top).
             // Assuming data passed is in correct order or we sort?
             // The API sorted them.
             [...last10].toReversed().map((g) => <GameRow key={g.id} game={g} league={league} />)
          )}
        </div>
      </section>
    </div>
  );
}
