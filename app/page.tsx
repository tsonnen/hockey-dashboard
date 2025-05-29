'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { DateSelector } from '@/app/components/date-selector/date-selector';
import { GameCard } from '@/app/components/game-card/game-card';
import { GameSkeleton } from '@/app/components/game-skeleton/game-skeleton';
import { Game } from '@/app/models/game';

interface LeagueEndpoint {
  url: string;
  name: string;
}

const LEAGUE_ENDPOINTS: LeagueEndpoint[] = [
  { url: '/api/nhl/week', name: 'NHL' },
  { url: '/api/hockeytech/ohl/schedule', name: 'OHL' },
  { url: '/api/hockeytech/whl/schedule', name: 'WHL' },
  { url: '/api/hockeytech/qmjhl/schedule', name: 'QMJHL' },
  { url: '/api/hockeytech/pwhl/schedule', name: 'PWHL' },
  { url: '/api/hockeytech/ahl/schedule', name: 'AHL' },
  { url: '/api/hockeytech/echl/schedule', name: 'ECHL' },
];

async function fetchGamesForDate(endpoint: LeagueEndpoint, dateStr: string): Promise<Game[]> {
  try {
    const response = await fetch(`${endpoint.url}/${dateStr}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint.name} games: ${response.statusText}`);
    }
    const games = (await response.json()) as Partial<Game>[];
    return games.filter((game): game is Game => game.gameDate === dateStr);
  } catch (error) {
    console.error(`Error fetching ${endpoint.name} games:`, error);
    return [];
  }
}

export default function Home(): React.JSX.Element {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDateString, setSelectedDate] = useState<string>(() => {
    // Initialize from URL if present, otherwise use current date
    const dateParam = searchParams.get('date');
    if (dateParam) {
      return dateParam;
    }

    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date.toISOString().slice(0, 10);
  });

  // Update URL when date changes
  const handleDateChange = (newDate: Date): void => {
    const dateStr = newDate.toISOString().slice(0, 10);
    setSelectedDate(dateStr);
    router.push(`/?date=${dateStr}`, { scroll: false });
  };

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);
      setGames([]); // Clear existing games when date changes

      try {
        const dateStr = selectedDateString;
        const allLeagueGames = await Promise.all(
          LEAGUE_ENDPOINTS.map((endpoint) => fetchGamesForDate(endpoint, dateStr)),
        );

        const allGames = allLeagueGames
          .flat()
          .sort((a, b) => new Date(a.startTimeUTC).getTime() - new Date(b.startTimeUTC).getTime());

        setGames(allGames);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred while fetching games');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, [selectedDateString]);

  return (
    <div>
      <DateSelector
        selectedDate={new Date(Date.parse(selectedDateString))}
        onDateChange={handleDateChange}
      />
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
      <div className="games-container">
        {isLoading ? (
          <>
            <GameSkeleton />
            <GameSkeleton />
            <GameSkeleton />
            <GameSkeleton />
          </>
        ) : games.length > 0 ? (
          games.map((game) => (
            <GameCard key={`${game.id.toString()}-${game.startTimeUTC}`} game={new Game(game)} />
          ))
        ) : (
          <div className="no-games">No games scheduled for this date</div>
        )}
      </div>
    </div>
  );
}
