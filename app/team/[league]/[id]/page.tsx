'use client';

import { useEffect, useState, type JSX } from 'react';
import { BackButton } from '@/app/components/back-button';
import { ImageWithFallback } from '@/app/components/image-with-fallback';
import { TeamRoster } from '@/app/components/team-details/team-roster';
import { TeamSchedule } from '@/app/components/team-details/team-schedule';
import { TeamDetails } from '@/app/models/team-details';

import { TeamDetailsSkeleton } from '@/app/components/team-details-skeleton';

interface TeamPageProps {
  params: Promise<{
    id: string;
    league: string;
  }>;
}

export default function TeamPage({ params }: TeamPageProps): JSX.Element {
  const [team, setTeam] = useState<TeamDetails | undefined>();
  const [loading, setLoading] = useState(true);
  const [leagueVal, setLeagueVal] = useState('');

  useEffect(() => {
    async function fetchTeam() {
      try {
        const { league, id } = await params;
        setLeagueVal(league);
        const baseUrl = league === 'nhl' ? 'nhl' : `hockeytech/${league}`;
        const response = await fetch(`/api/${baseUrl}/team/${id}`);
        if (!response.ok) throw new Error('Failed to fetch team details');
        setTeam(await response.json());
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchTeam();
  }, [params]);

  if (loading) return <TeamDetailsSkeleton />;
  if (!team) return <div className="p-8 text-center text-red-500">Failed to load team details.</div>;

  return (
    <div className="container mx-auto p-4">
      <BackButton className="mb-6" />
      <TeamHeader team={team} />

      <div className="space-y-12">
        <section>
          <h2 className="mb-4 border-b pb-2 text-2xl font-bold">Schedule</h2>
          <TeamSchedule
            upcoming={team.upcomingSchedule || []}
            last10={team.last10Schedule || []}
            league={leagueVal}
          />
        </section>
        <section>
          <h2 className="mb-4 border-b pb-2 text-2xl font-bold">Roster</h2>
          {team.roster ? <TeamRoster roster={team.roster} /> : <p>No roster data available.</p>}
        </section>
      </div>
    </div>
  );
}

function TeamHeader({ team }: { team: TeamDetails }) {
  const record = team.record;
  const streak = record?.streakCode ? `${record.streakCode}${record.streakCount ? ` (${record.streakCount})` : ''}` : undefined;

  return (
    <div className="mb-8 flex flex-col items-center space-y-4 text-center md:flex-row md:space-x-8 md:space-y-0 md:text-left">
      <div className="relative size-32">
        {team.logo ? (
          <ImageWithFallback src={team.logo} alt="Team Logo" fill className="object-contain" priority />
        ) : (
          <div className="flex size-full items-center justify-center rounded-full bg-gray-200">No Logo</div>
        )}
      </div>
      <div>
        <h1 className="text-3xl font-bold">{team.name.default}</h1>
        {record && (
          <div className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            <span className="font-semibold">Record:</span> {record.wins}-{record.losses}-{record.ot}
            {record.ties === undefined ? '' : `-${record.ties}`} ({record.points} pts)
          </div>
        )}
        {streak && (
          <div className="text-sm text-gray-500">Streak: {streak}</div>
        )}
      </div>
    </div>
  );
}
