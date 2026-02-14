import { Game } from './game';
import { GameState } from './game-state';
import { mapHockeyTechGameState, mapHockeyTechTeam } from './hockeytech-mapper';

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

export function convertHockeyTechGame(data: HockeyTechGame, league: string): Game {
  const gameState = mapHockeyTechGameState(data.GameStatus, data.GameDateISO8601);

  return new Game({
    id: Number.parseInt(data.ID),
    season: Number.parseInt(data.SeasonID),
    gameDate: data.Date,
    venue: { default: data.venue_name },
    neutralSite: false,
    startTimeUTC: data.GameDateISO8601,
    gameState,
    homeTeam: mapHockeyTechTeam(
      {
        id: data.HomeID,
        city: data.HomeCity,
        nickname: data.HomeNickname,
        name: data.HomeLongName,
        logo: data.HomeLogo,
      },
      { goals: data.HomeGoals },
    ),
    awayTeam: mapHockeyTechTeam(
      {
        id: data.VisitorID,
        city: data.VisitorCity,
        nickname: data.VisitorNickname,
        name: data.VisitorLongName,
        logo: data.VisitorLogo,
      },
      { goals: data.VisitorGoals },
    ),
    period: Number.parseInt(data.Period) || undefined,
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
