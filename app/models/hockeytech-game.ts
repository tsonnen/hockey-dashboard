import { Game } from './game';
import { GameState } from './game-state';
import { Team } from './team';

export interface HockeyTechGame {
  ID: string;
  SeasonID: string;
  GameDateISO8601: string;
  Date: string;
  venue_name: string;
  HomeID: string;
  HomeCity: string;
  HomeNickname: string;
  HomeLongName: string;
  HomeGoals: string;
  HomeLogo: string;
  VisitorID: string;
  VisitorCity: string;
  VisitorNickname: string;
  VisitorLongName: string;
  VisitorGoals: string;
  VisitorLogo: string;
  GameStatus: string;
  GameStatusString: string;
  Period: string;
  GameClock: string;
  TicketUrl: string;
}

function mapGameStatusToGameState(gameStatus: string): GameState {
  switch (gameStatus) {
    case '1':
      return GameState.FUTURE;
    case '2':
      return GameState.LIVE;
    case '3':
      return GameState.OFFICIAL;
    case '4':
      return GameState.FINAL;
    default:
      return GameState.FUTURE;
  }
}

export function convertHockeyTechGame(data: HockeyTechGame, league: string): Game {
  const gameState = mapGameStatusToGameState(data.GameStatus);

  return new Game({
    id: parseInt(data.ID),
    season: parseInt(data.SeasonID),
    gameType: 2, // Regular season
    gameDate: data.Date,
    venue: { default: data.venue_name },
    neutralSite: false,
    startTimeUTC: data.GameDateISO8601,
    gameState,
    homeTeam: new Team({
      id: parseInt(data.HomeID),
      placeName: { default: data.HomeCity },
      commonName: { default: data.HomeNickname },
      name: { default: data.HomeLongName },
      logo: data.HomeLogo,
      score: parseInt(data.HomeGoals) || 0,
      abbrev: data.HomeNickname.substring(0, 3).toUpperCase(),
      awaySplitSquad: false,
      radioLink: '',
      odds: [],
    }),
    awayTeam: new Team({
      id: parseInt(data.VisitorID),
      placeName: { default: data.VisitorCity },
      commonName: { default: data.VisitorNickname },
      name: { default: data.VisitorLongName },
      logo: data.VisitorLogo,
      score: parseInt(data.VisitorGoals) || 0,
      abbrev: data.VisitorNickname.substring(0, 3).toUpperCase(),
      awaySplitSquad: false,
      radioLink: '',
      odds: [],
    }),
    period: parseInt(data.Period) || undefined,
    ticketsLink: data.TicketUrl,
    clock: data.GameClock
      ? {
        timeRemaining: data.GameClock,
        secondsRemaining: 0, // Would need conversion logic
        running: gameState === GameState.LIVE,
        inIntermission: false, // Would need additional data
      }
      : undefined,
    league,
  });
}
