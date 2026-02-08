'use client';

import { useEffect, useState, type JSX } from 'react';
import { BackButton } from '@/app/components/back-button';
import { ImageWithFallback } from '@/app/components/image-with-fallback';
import { TeamRoster } from '@/app/components/team-details/team-roster';
import { TeamSchedule } from '@/app/components/team-details/team-schedule';
import { TeamDetails } from '@/app/models/team-details';

interface TeamPageProps {
  params: Promise<{
    id: string;
    league: string;
  }>;
}

export default function TeamPage({ params }: TeamPageProps): JSX.Element {
  const [team, setTeam] = useState<TeamDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [leagueVal, setLeagueVal] = useState('');

  useEffect(() => {
    async function fetchTeam() {
      try {
        const { league, id } = await params;
        setLeagueVal(league);
        const response = await fetch(`/api/${league === 'nhl' ? 'nhl' : `hockeytech/${league}`}/team/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch team details');
        }
        const data = await response.json();
        setTeam(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchTeam();
  }, [params]);

  if (loading) {
    return <div className="p-8 text-center">Loading Team Details...</div>;
  }

  if (!team) {
    return <div className="p-8 text-center text-red-500">Failed to load team details.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <BackButton className="mb-6" />

      {/* Header */}
      <div className="mb-8 flex flex-col items-center space-y-4 md:flex-row md:space-x-8 md:space-y-0 text-center md:text-left">
        <div className="relative size-32">
            {team.logo ? (
                <ImageWithFallback src={team.logo} alt="Team Logo" fill className="object-contain" priority />
            ) : (
                <div className="flex size-full items-center justify-center bg-gray-200 rounded-full">
                    No Logo
                </div>
            )}
        </div>
        <div>
            <h1 className="text-3xl font-bold">{team.name.default}</h1>
            {team.record && (
                <div className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                    <span className="font-semibold">Record:</span> {team.record.wins}-{team.record.losses}-{team.record.ot}{team.record.ties !== undefined ? `-${team.record.ties}` : ''} ({team.record.points} pts)
                </div>
            )}
            {team.record?.streakCode && (
                 <div className="text-sm text-gray-500">
                    Streak: {team.record.streakCode}{team.record.streakCount ? ` (${team.record.streakCount})` : ''}
                 </div>
            )}
        </div>
      </div>

      <div className="space-y-12">
        <section>
             <h2 className="mb-4 text-2xl font-bold border-b pb-2">Schedule</h2>
             <TeamSchedule 
                upcoming={team.upcomingSchedule || []} 
                last10={team.last10Schedule || []}
                league={leagueVal} 
             />
        </section>

        <section>
             <h2 className="mb-4 text-2xl font-bold border-b pb-2">Roster</h2>
             {team.roster ? (
               <TeamRoster roster={team.roster} />
             ) : (
               <p>No roster data available.</p>
             )}
        </section>
      </div>
    </div>
  );
}
