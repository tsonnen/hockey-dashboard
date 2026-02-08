import { Player } from '@/app/models/team-details';
import { ImageWithFallback } from '../image-with-fallback';

interface TeamRosterProps {
  roster: {
    forwards: Player[];
    defensemen: Player[];
    goalies: Player[];
  };
}

function RosterTable({ players, columns, title }: { 
  players: Player[]; 
  columns: { key: keyof Player; label: string; format?: (val: unknown) => string }[]; 
  title: string 
}) {
  // Filter columns to only show those that have at least one non-null/non-undefined value in the dataset
  const visibleColumns = columns.filter(col => 
    players.some(p => p[col.key] !== undefined && p[col.key] !== null)
  );

  return (
    <div className="overflow-x-auto">
      <h3 className="mb-4 text-xl font-bold">{title}</h3>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 underline decoration-dotted">#</th>
            <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
            <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Pos</th>
            {visibleColumns.map(col => (
              <th key={col.key.toString()} className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          {players.map((p) => (
            <tr key={`${p.id || `${p.firstName.default}-${p.lastName.default}-${p.sweaterNumber}`}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">{p.sweaterNumber ?? '-'}</td>
              <td className="whitespace-nowrap px-3 py-2">
                <div className="flex items-center space-x-2">
                  <div className="relative size-6 shrink-0 overflow-hidden rounded-full bg-gray-100">
                    {p.headshot ? (
                      <ImageWithFallback
                        src={p.headshot}
                        alt={`${p.firstName.default} ${p.lastName.default}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-[10px] text-gray-400">?</div>
                    )}
                  </div>
                  <span className="text-sm font-medium">{p.firstName.default} {p.lastName.default}</span>
                </div>
              </td>
              <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">{p.positionCode}</td>
              {visibleColumns.map(col => (
                <td key={col.key.toString()} className="whitespace-nowrap px-3 py-2 text-right text-sm text-gray-500 dark:text-gray-300">
                  {col.format ? col.format(p[col.key]) : (p[col.key]?.toString() ?? '-')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TeamRoster({ roster }: TeamRosterProps) {
  const skaters = [...roster.forwards, ...roster.defensemen];
  
  const skaterColumns: { key: keyof Player; label: string; format?: (val: unknown) => string }[] = [
    { key: 'gamesPlayed', label: 'GP' },
    { key: 'goals', label: 'G' },
    { key: 'assists', label: 'A' },
    { key: 'points', label: 'P' },
    { key: 'pointsPerGame', label: 'PPG' },
    { key: 'plusMinus', label: '+/-' },
    { key: 'pim', label: 'PIM' },
    { key: 'avgIceTime', label: 'TOI' },
    { key: 'shots', label: 'S' },
    { key: 'shootingPct', label: 'S%', format: (v) => v ? `${(v * 100).toFixed(1)}%` : '-' },
    { key: 'faceoffPct', label: 'FO%', format: (v) => v ? `${(v * 100).toFixed(1)}%` : '-' },
    { key: 'blocks', label: 'BLK' },
    { key: 'hits', label: 'HIT' },
  ];

  const goalieColumns: { key: keyof Player; label: string; format?: (val: unknown) => string }[] = [
    { key: 'gamesPlayed', label: 'GP' },
    { key: 'wins', label: 'W' },
    { key: 'losses', label: 'L' },
    { key: 'shutouts', label: 'SO' },
    { key: 'shotsAgainst', label: 'SA' },
    { key: 'saves', label: 'SV' },
    { key: 'savePct', label: 'SV%', format: (v) => v?.toFixed(3) || '-' },
    { key: 'gaa', label: 'GAA', format: (v) => v?.toFixed(2) || '-' },
  ];

  return (
    <div className="space-y-12">
      <RosterTable 
        players={skaters} 
        columns={skaterColumns} 
        title="Skaters" 
      />
      <RosterTable 
        players={roster.goalies} 
        columns={goalieColumns} 
        title="Goalies" 
      />
    </div>
  );
}
