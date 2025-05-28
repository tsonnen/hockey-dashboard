import { type LEAGUES, BASE_URL, LEAGUE_KEY_MAPPINGS } from './const';

export function getKeyAndClientCode(league: LEAGUES): { key: string; client_code: string } {
  return LEAGUE_KEY_MAPPINGS[league];
}

export function getBaseUrl(league: LEAGUES): URL {
  const url = new URL(BASE_URL);
  const { key, client_code } = getKeyAndClientCode(league);

  url.searchParams.append('key', key);
  url.searchParams.append('client_code', client_code);
  return url;
}
