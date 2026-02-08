import { NextResponse } from 'next/server';
import { getBaseUrl } from '../../../utils';
import { LEAGUES } from '../../../const';
import { TeamDetails, Player, ScheduledGame, TeamRecord } from '@/app/models/team-details';

// Helper to fetch data from statviewfeed
async function fetchHockeyTech(league: LEAGUES, params: Record<string, string>) {
  const url = getBaseUrl(league);
  url.searchParams.append('feed', 'statviewfeed');
  url.searchParams.append('fmt', 'json');
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.append(key, value);
  }
  // Robust JSON parsing
  let parsedData = null;
  try {
     const res = await fetch(url.toString());
     if (!res.ok) return null;
     const text = await res.text();
     let jsonString = text.trim();
     if (jsonString.startsWith('(') && jsonString.endsWith(')')) {
         jsonString = jsonString.slice(1, -1);
     }
     parsedData = JSON.parse(jsonString);
  } catch (e) {
     console.error('HockeyTech fetch error', e);
     return null;
  }
  return parsedData;
}

// Helper to fetch data from modulekit (for stats)
async function fetchModuleKit(league: LEAGUES, params: Record<string, string>) {
  const url = getBaseUrl(league);
  url.searchParams.append('feed', 'modulekit');
  url.searchParams.append('fmt', 'json');
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.append(key, value);
  }
  
  let parsedData = null;
  try {
     const res = await fetch(url.toString());
     if (!res.ok) return null;
     const text = await res.text();
     let jsonString = text.trim();
     if (jsonString.startsWith('(') && jsonString.endsWith(')')) {
         jsonString = jsonString.slice(1, -1);
     }
     parsedData = JSON.parse(jsonString);
  } catch (e) {
     console.error('ModuleKit fetch error', e);
     return null;
  }
  return parsedData;
}

function extractHockeyTechRows(data: any): any[] {
    const rows: any[] = [];
    if (!data) return rows;
    
    // Normalize to array
    const roots = Array.isArray(data) ? data : [data];
    
    for (const root of roots) {
        if (root.sections) {
            for (const section of root.sections) {
                if (section.data) {
                    rows.push(...section.data.map((d: any) => d.row || d));
                }
            }
        } else if (root.roster) {
           rows.push(...extractHockeyTechRows(root.roster));
        } else if (root.standings) {
           rows.push(...extractHockeyTechRows(root.standings));
        } else if (root.games) {
           rows.push(...extractHockeyTechRows(root.games));
        } else if (root.SiteKit) {
           rows.push(...extractHockeyTechRows(root.SiteKit));
        } else if (root.Schedule) {
           rows.push(...extractHockeyTechRows(root.Schedule));
        } else {
           if (root.person_id || root.game_id || root.team_id || root.id || root.player_id) {
               rows.push(root);
           }
        }
    }
    return rows;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ league: string; id: string }> },
): Promise<NextResponse<Partial<TeamDetails>>> {
  const { league, id } = await params;
  const leagueEnum = league as LEAGUES;

  const rosterData = await fetchHockeyTech(leagueEnum, { view: 'roster', team_id: id });

  // Get season ID for stats fetch
  let seasonId = '';
  if (rosterData && rosterData.seasonId) {
      seasonId = rosterData.seasonId;
  } else if (rosterData && rosterData.roster && rosterData.seasonID) {
      seasonId = rosterData.seasonID;
  } else {
      // Fallback: fetch current season
      const seasonsData = await fetchModuleKit(leagueEnum, { view: 'seasons' });
      if (seasonsData && seasonsData.SiteKit && seasonsData.SiteKit.Seasons) {
          const currentSeason = seasonsData.SiteKit.Seasons.find((s: any) => s.career === '1' && s.playoff === '0');
          if (currentSeason) seasonId = currentSeason.season_id;
      }
  }
  
  // Fetch player stats using modulekit
  const skatersStatsData = seasonId ? await fetchModuleKit(leagueEnum, { 
      view: 'statviewtype', 
      type: 'skaters',
      team_id: id,
      season_id: seasonId
  }) : null;
  
  const goaliesStatsData = seasonId ? await fetchModuleKit(leagueEnum, { 
      view: 'statviewtype', 
      type: 'goalies',
      team_id: id,
      season_id: seasonId
  }) : null;
  
  const standingsParams: Record<string, string> = { view: 'standings' };
  if (seasonId) standingsParams.season_id = seasonId;
  const standingsData = await fetchHockeyTech(leagueEnum, standingsParams);

  const scheduleParams: Record<string, string> = { view: 'schedule', team_id: id };
  if (seasonId) scheduleParams.season_id = seasonId;
  const scheduleData = await fetchModuleKit(leagueEnum, scheduleParams);


  if (!rosterData) {
      return NextResponse.json({ id } as any, { status: 404 });
  }

  // Flatten Data
  const players = extractHockeyTechRows(rosterData);
  const games = extractHockeyTechRows(scheduleData);
  
  // Extract stats
  const skatersStats = skatersStatsData?.SiteKit?.Statviewtype || [];
  const goaliesStats = goaliesStatsData?.SiteKit?.Statviewtype || [];
  const allStats = [...skatersStats, ...goaliesStats];
  
  // Create a map of player_id to stats
  const statsMap = new Map();
  for (const stat of allStats) {
      statsMap.set(stat.player_id, stat);
  }
  const teams = extractHockeyTechRows(standingsData);

  const forwards: Player[] = [];
  const defensemen: Player[] = [];
  const goalies: Player[] = [];

  for (const p of players) {
      // Name handling: OHL feed often just has `name`
      let fName = p.first_name || p.firstName || '';
      let lName = p.last_name || p.lastName || '';
      
      if (!fName && !lName && p.name) {
          const parts = p.name.split(' ');
          fName = parts[0];
          lName = parts.slice(1).join(' ');
      }

      // Get stats for this player
      const playerId = p.person_id || p.id || p.player_id;
      const stats = statsMap.get(playerId);

      const player: Player = {
          id: playerId,
          firstName: { default: fName },
          lastName: { default: lName },
          sweaterNumber: p.jersey_number || p.tp_jersey_number || stats?.jersey_number,
          positionCode: p.position_txt || p.position || stats?.position,
          headshot: p.player_image || stats?.player_image,
          gamesPlayed: Number(stats?.games_played || 0),
          goals: Number(stats?.goals || 0),
          assists: Number(stats?.assists || 0),
          points: Number(stats?.points || 0),
          pim: Number(stats?.penalty_minutes || stats?.pim || 0),
          plusMinus: Number(stats?.plus_minus || 0)
      };
      
      const pos = (player.positionCode || '').toLowerCase();
      if (pos.includes('goalie')) {
          goalies.push(player);
      } else if (pos.includes('def')) {
          defensemen.push(player);
      } else {
          forwards.push(player);
      }
  }

  // Map Standings
  let record: TeamRecord | undefined;
  let teamName = { default: 'Team' };
  let logo;
  
  const myTeam = teams.find((t: any) => String(t.team_id || t.id) === id);
  if (myTeam) {
      teamName = { default: myTeam.team_name || myTeam.name };
      logo = myTeam.team_logo_url || myTeam.logo;
      record = {
          wins: Number(myTeam.wins),
          losses: Number(myTeam.losses),
          ot: Number(myTeam.ot_losses),
          points: Number(myTeam.points),
          streakCode: myTeam.streak, 
          streakCount: 0 
      };
  }

  // Calculate record from games if standings missing or to fill in streak details
  if (games.length > 0) {
      const finishedGames = games.filter((g: any) => {
          const status = g.game_status || g.status;
          return status === 'Final' || status === '4' || (typeof status === 'string' && status.toLowerCase().includes('final'));
      });

      if (!record || !record.streakCode) {
          let wins = 0;
          let losses = 0;
          let ot = 0;
          let points = 0;

          // Process in chronological order for record
          const chronological = [...finishedGames].sort((a: any, b: any) => (a.date_played || a.date || '').localeCompare(b.date_played || b.date || ''));

          for (const g of chronological) {
              const isHome = String(g.home_team) === id;
              const homeScore = Number(g.home_goal_count || 0);
              const awayScore = Number(g.visiting_goal_count || 0);
              const isWin = isHome ? homeScore > awayScore : awayScore > homeScore;
              const isOTL = !isWin && (g.overtime === '1' || g.shootout === '1' || (g.game_status && g.game_status.toLowerCase().includes('ot')) || (g.game_status && g.game_status.toLowerCase().includes('so')));
              
              if (isWin) {
                  wins++;
                  points += 2;
              } else if (isOTL) {
                  ot++;
                  points += 1;
              } else {
                  losses++;
              }
          }

          // Streak calculation (working backwards from latest game)
          let streakCode = '';
          let streakCount = 0;
          if (chronological.length > 0) {
              const latest = [...chronological].reverse();
              for (const g of latest) {
                  const isHome = String(g.home_team) === id;
                  const homeScore = Number(g.home_goal_count || 0);
                  const awayScore = Number(g.visiting_goal_count || 0);
                  const isWin = isHome ? homeScore > awayScore : awayScore > homeScore;
                  const isOTL = !isWin && (g.overtime === '1' || g.shootout === '1' || (g.game_status && g.game_status.toLowerCase().includes('ot')) || (g.game_status && g.game_status.toLowerCase().includes('so')));
                  
                  const currentRes = isWin ? 'W' : (isOTL ? 'OTL' : 'L');
                  if (!streakCode) {
                      streakCode = currentRes;
                      streakCount = 1;
                  } else if (streakCode === currentRes) {
                      streakCount++;
                  } else {
                      break;
                  }
              }
          }

          if (!record) {
              record = { wins, losses, ot, points, streakCode, streakCount };
          } else {
              record.streakCode = record.streakCode || streakCode;
              record.streakCount = record.streakCount || streakCount;
          }
      }
  }
  
  // Fallback: Get team info from roster data
  if (!logo && rosterData) {
      logo = rosterData.teamLogo;
  }
  
  // Fallback: Get team info from stats data (first player)
  if ((!teamName || teamName.default === 'Team') && allStats.length > 0) {
      const firstPlayer = allStats[0];
      if (firstPlayer.team_name) {
          teamName = { default: firstPlayer.team_name };
      }
      if (!logo && firstPlayer.logo) {
          logo = firstPlayer.logo;
      }
  }

  // Map Schedule
  const upcomingSchedule: ScheduledGame[] = [];
  const last10Schedule: ScheduledGame[] = [];
  
  if (games.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      // Safety check for date_played
      const sorted = games.sort((a: any, b: any) => (a.date_played || '').localeCompare(b.date_played || ''));
      
      const past = sorted.filter((g: any) => g.date_played < today);
      const future = sorted.filter((g: any) => g.date_played >= today);
      
      last10Schedule.push(...past.slice(-10).map((g: any) => mapHtGame(g, id)));
      upcomingSchedule.push(...future.slice(0, 10).map((g: any) => mapHtGame(g, id)));
  }

  // Use team info from roster logic if standings failed
  // HockeyTech roster response sometimes has team info
  
  return NextResponse.json({
    id,
    abbrev: '', // HT doesn't always use abbrev same way
    name: teamName,
    logo,
    roster: {
        forwards,
        defensemen,
        goalies
    },
    record,
    upcomingSchedule,
    last10Schedule
  });
}

function mapHtGame(g: any, myTeamId: string): ScheduledGame {
    let gameState = g.game_status || g.status;
    // Normalize game status - "4" is Final in many HockeyTech leagues
    if (g.status === '4' || (typeof gameState === 'string' && gameState.toLowerCase().includes('final'))) {
        gameState = 'Final';
    }

    return {
        id: g.game_id || g.id,
        date: g.date_played || g.date,
        startTime: g.schedule_time || g.time || g.game_time || '',
        homeTeam: {
            id: g.home_team,
            abbrev: g.home_team_code,
            score: g.home_goal_count !== undefined && g.home_goal_count !== "" ? Number(g.home_goal_count) : undefined
        },
        awayTeam: {
            id: g.visiting_team,
            abbrev: g.visiting_team_code,
            score: g.visiting_goal_count !== undefined && g.visiting_goal_count !== "" ? Number(g.visiting_goal_count) : undefined
        },
        gameState: gameState
    }
}
