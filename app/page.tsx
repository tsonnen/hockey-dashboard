'use client';

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

import { DateSelector } from '@/app/components/date-selector';
import { GameCard } from '@/app/components/game-card';
import { GameSkeleton } from '@/app/components/game-skeleton';
import { Game } from '@/app/models/game';

import styles from './page.module.css';
import { Multiselect } from './components/multiselect';
import { formatLocalDate, parseLocalDate } from '@/app/utils';

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
    const filteredGames = games.filter((game): game is Game => {
      if (!game.startTimeUTC) return false;
      return formatLocalDate(game.startTimeUTC) === dateStr;
    });
    return filteredGames;
  } catch (error) {
    console.error(`Error fetching ${endpoint.name} games:`, error);
    return [];
  }
}

function HomePage(): React.JSX.Element {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>();
  const [mounted, setMounted] = useState(false);
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);

  useEffect(() => {
    const currentLeagues = localStorage.getItem('leagues');
    if (currentLeagues) {
      setSelectedLeagues(JSON.parse(currentLeagues));
    } else {
      const defaultLeagues = LEAGUE_ENDPOINTS.map((endpoint) => endpoint.name.toLowerCase());
      localStorage.setItem('leagues', JSON.stringify(defaultLeagues));
      setSelectedLeagues(defaultLeagues);
    }
    setMounted(true);
  }, []);

  const [selectedDateString, setSelectedDate] = useState<string>(() => {
    // Initialize from URL if present, otherwise use current date
    const dateParam = searchParams.get('date');
    if (dateParam) {
      try {
        const parsedDate = parseLocalDate(dateParam);
        if (Number.isNaN(parsedDate.getTime())) {
          throw new TypeError(`Invalid Date format ${dateParam}`);
        }
        return formatLocalDate(parsedDate);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'An error occurred while parsing the date',
        );
      }
    }

    return formatLocalDate(new Date());
  });

  // Update URL when date changes
  const handleDateChange = (newDate: Date): void => {
    const dateStr = formatLocalDate(newDate);
    setSelectedDate(dateStr);
    router.push(`/?date=${dateStr}`, { scroll: false });
  };

  const getGameCards = () => {
    const formatterDisjunction = new Intl.ListFormat('en', { style: 'long', type: 'disjunction' });
    const selectedLeaguesString = formatterDisjunction.format(
      selectedLeagues.map((league) => league.toUpperCase()),
    );
    return games.length > 0 ? (
      games.map((game) => (
        <GameCard key={`${game.id.toString()}-${game.startTimeUTC}`} game={new Game(game)} />
      ))
    ) : (
      <div className="no-games">No games scheduled for this date for {selectedLeaguesString}</div>
    );
  };

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setIsLoading(true);
      setError(undefined);
      setGames([]); // Clear existing games when date changes

      try {
        const dateStr = selectedDateString;
        const allLeagueGames = await Promise.all(
          LEAGUE_ENDPOINTS.filter((endpoint) =>
            selectedLeagues.includes(endpoint.name.toLowerCase()),
          ).map((endpoint) => fetchGamesForDate(endpoint, dateStr)),
        );

        const allGames = allLeagueGames
          .flat()
          .toSorted(
            (a, b) => new Date(a.startTimeUTC).getTime() - new Date(b.startTimeUTC).getTime(),
          );

        setGames(allGames);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred while fetching games');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDateString, JSON.stringify(selectedLeagues)]); // selectedLeagues is an array, so we stringify it to avoid unnecessary re-renders

  return (
    <div className="flex h-screen flex-col">
      <div className="grid w-full">
        <div className="grid place-items-center">
          <DateSelector
            disabled={isLoading}
            selectedDate={parseLocalDate(selectedDateString)}
            onDateChange={handleDateChange}
          />
        </div>
        <div className="mr-8 grid place-items-end">
          <Multiselect
            options={[
              { key: 'nhl', label: 'NHL' },
              { key: 'ohl', label: 'OHL' },
              { key: 'whl', label: 'WHL' },
              { key: 'qmjhl', label: 'QMJHL' },
              { key: 'pwhl', label: 'PWHL' },
              { key: 'ahl', label: 'AHL' },
              { key: 'echl', label: 'ECHL' },
            ]}
            label="Select Leagues"
            selected={selectedLeagues}
            onApply={(selected) => {
              setSelectedLeagues(selected);
              localStorage.setItem('leagues', JSON.stringify(selected));
            }}
          />
        </div>
      </div>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
      {mounted ? (
        selectedLeagues.length > 0 ? (
          <div className={styles.gamesContainer}>
            {isLoading ? (
              <>
                <GameSkeleton />
                <GameSkeleton />
                <GameSkeleton />
                <GameSkeleton />
              </>
            ) : (
              getGameCards()
            )}
          </div>
        ) : (
          <div className={styles.gamesContainer}>
            No leagues selected. Please select at least one league to view games.
          </div>
        )
      ) : (
        <div className={styles.gamesContainer}>
          <GameSkeleton />
          <GameSkeleton />
          <GameSkeleton />
          <GameSkeleton />
        </div>
      )}
    </div>
  );
}

export default function Home(): React.JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[200px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 size-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
            <p className="text-gray-600">Loading page...</p>
          </div>
        </div>
      }
    >
      <HomePage />
    </Suspense>
  );
}
