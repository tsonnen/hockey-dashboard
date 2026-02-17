import { type LEAGUES, BASE_URL, LEAGUE_KEY_MAPPINGS } from './const';
import type { HockeyTechRow } from './types';

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

export async function fetchHockeyTech<T = Record<string, unknown>>(
  league: LEAGUES,
  params: Record<string, string>,
): Promise<T | undefined> {
  const url = getBaseUrl(league);
  url.searchParams.append('feed', 'statviewfeed');
  url.searchParams.append('fmt', 'json');

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.append(key, value);
  }

  try {
    const res = await fetch(url.toString());
    if (!res.ok) return;
    const text = await res.text();
    let jsonString = text.trim();
    if (jsonString.startsWith('(') && jsonString.endsWith(')')) {
      jsonString = jsonString.slice(1, -1);
    }
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('HockeyTech fetch error', error);
    return;
  }
}

export async function fetchModuleKit<T = Record<string, unknown>>(
  league: LEAGUES,
  params: Record<string, string>,
): Promise<T | undefined> {
  const url = getBaseUrl(league);
  url.searchParams.append('feed', 'modulekit');
  url.searchParams.append('fmt', 'json');

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.append(key, value);
  }

  try {
    const res = await fetch(url.toString());
    if (!res.ok) return;
    const text = await res.text();
    let jsonString = text.trim();
    if (jsonString.startsWith('(') && jsonString.endsWith(')')) {
      jsonString = jsonString.slice(1, -1);
    }
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('ModuleKit fetch error', error);
    return;
  }
}

export function extractHockeyTechRows(data: unknown): HockeyTechRow[] {
  if (!data) return [];
  const roots = (Array.isArray(data) ? data : [data]) as Record<string, unknown>[];
  const rows: HockeyTechRow[] = [];
  for (const root of roots) {
    if (root.sections) {
      const sections = root.sections as Record<string, unknown>[];
      for (const section of sections) {
        if (section.data) {
          rows.push(
            ...(section.data as HockeyTechRow[]).map(
              (d: HockeyTechRow & { row?: HockeyTechRow }) => (d.row ?? d) as HockeyTechRow,
            ),
          );
        }
      }
    } else {
      rows.push(...extractSubRows(root));
    }
  }
  return rows;
}

function extractSubRows(root: Record<string, unknown>): HockeyTechRow[] {
  if (root.roster) return extractHockeyTechRows(root.roster);
  if (root.standings) return extractHockeyTechRows(root.standings);
  if (root.games) return extractHockeyTechRows(root.games);
  if (root.SiteKit) return extractHockeyTechRows(root.SiteKit);
  return extractSubRowsContinued(root);
}

function extractSubRowsContinued(root: Record<string, unknown>): HockeyTechRow[] {
  if (root.Schedule) return extractHockeyTechRows(root.Schedule);
  if (root.person_id || root.game_id || root.team_id || root.id || root.player_id)
    return [root as HockeyTechRow];
  return [];
}
