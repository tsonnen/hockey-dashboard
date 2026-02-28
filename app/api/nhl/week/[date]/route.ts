import { NextResponse } from 'next/server';

import type { DatePromo } from '@/app/models/date-promo';
import { Game } from '@/app/models/game';
import { GameDay } from '@/app/models/game-day';

import { Team } from '@/app/models/team';

interface NHLScheduleResponse {
  gameWeek: {
    date: string;
    dayAbbrev: string;
    numberOfGames: number;
    datePromo: DatePromo[];
    games: Game[];
  }[];
}

interface NHLScoreResponse {
  games: Game[];
}

async function getSchedule(date: string): Promise<GameDay[]> {
  const response = await fetch(`https://api-web.nhle.com/v1/schedule/${date}`);
  const data = (await response.json()) as NHLScheduleResponse;
  return data.gameWeek.map(
    (day) =>
      new GameDay({
        date: day.date,
        dayAbbrev: day.dayAbbrev,
        numberOfGames: day.numberOfGames,
        datePromo: day.datePromo,
        games: day.games.map((game) => new Game(game)),
      }),
  );
}

async function getScores(date: string): Promise<Game[]> {
  const response = await fetch(`https://api-web.nhle.com/v1/score/${date}`);
  const data = (await response.json()) as NHLScoreResponse;
  return data.games.map((game) => new Game(game));
}

function getDates(date: string) {
  const targetDate = new Date(date);

  const dateMinus1 = new Date(targetDate);
  dateMinus1.setDate(targetDate.getDate() - 1);
  const yesterday = dateMinus1.toISOString().split('T')[0];

  const datePlus1 = new Date(targetDate);
  datePlus1.setDate(targetDate.getDate() + 1);
  const tomorrow = datePlus1.toISOString().split('T')[0];

  return { yesterday, today: date, tomorrow };
}

function mergeTeam(team: Team, scoreTeam?: Team): Team {
  return {
    ...team,
    score: scoreTeam?.score ?? team.score,
    sog: scoreTeam?.sog ?? team.sog,
  };
}

function mergeGameWithScore(game: Game, score?: Game): Partial<Game> {
  const mergedGame: Partial<Game> = {
    ...game,
    league: 'nhl',
    homeTeam: mergeTeam(game.homeTeam, score?.homeTeam),
    awayTeam: mergeTeam(game.awayTeam, score?.awayTeam),
  };

  if (score) {
    mergedGame.gameState = score.gameState ?? mergedGame.gameState;
    mergedGame.clock = score.clock ?? mergedGame.clock;
    mergedGame.period = score.period ?? mergedGame.period;
  }

  return mergedGame;
}

function processGames(gameDays: GameDay[], scores: Game[]): Partial<Game>[] {
  const allGames: Partial<Game>[] = [];
  const seenGameIds = new Set<number>();

  for (const gameDay of gameDays) {
    for (const game of gameDay.games) {
      if (seenGameIds.has(game.id)) continue;
      seenGameIds.add(game.id);

      const score = scores.find((gs) => gs.id === game.id);
      allGames.push(mergeGameWithScore(game, score));
    }
  }

  return allGames;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ date: string }> },
): Promise<NextResponse<Partial<Game>[]>> {
  const { date } = await params;
  const { yesterday, today, tomorrow } = getDates(date);

  // Fetch schedules for yesterday and today to cover all possible local midnight games
  // Fetch scores for yesterday, today, and tomorrow to ensure we have score data for all games
  const [gameWeekMinus1, gameWeek, gameScoresMinus1, gameScores, gameScoresPlus1] =
    await Promise.all([
      getSchedule(yesterday),
      getSchedule(today),
      getScores(yesterday),
      getScores(today),
      getScores(tomorrow),
    ]);

  const allGameScores = [...gameScoresMinus1, ...gameScores, ...gameScoresPlus1];
  const allGameWeeks = [...gameWeekMinus1, ...gameWeek];

  const allGames = processGames(allGameWeeks, allGameScores);

  return NextResponse.json(allGames);
}
