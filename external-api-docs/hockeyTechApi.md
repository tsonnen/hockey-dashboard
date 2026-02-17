<img src="/logo.svg" alt="logo" width="50"/>

# PWHL Data Documentation

This document serves as an unofficial reference for the Professional Women's Hockey League (PWHL) data sources.
Corrections and suggestions are welcome!

There appear to be two primary sources for PWHL APIs:

1. **HockeyTech/LeagueStat API** (`lscluster.hockeytech.com`) - Used primarily for historical data and statistics

2. **Firebase API** (`leaguestat-b9523.firebaseio.com`) - Used primarily for live game data

This document is broken into distinct sections detailing each data source.

Raw data, in CSV format, is also included in the [data](/data) folder.

## Table of Contents

### [HockeyTech/LeagueStat API](#hockeytech-api-documentation)

1. [Base URL](#hockeytech-base-url)
2. [Season Information](#season-information)
3. [Schedule Information](#schedule-information)
   1. [Season Schedule](#season-game-schedule)
   2. [Team Schedule](#team-schedule)
   3. [Daily Schedule](#daily-schedule)
   4. [Scorebar](#scorebar)
4. [Team Information](#team-information)
   1. [All Teams](#all-teams)
   2. [Rosters](#rosters)
   3. [League Standings](#league-standings)
5. [Player Information](#player-information)
   1. [Skaters](#skaters)
      1. [All Skaters](#all-skaters)
      2. [Skater Statistics by Team](#skater-statistics-by-team)
   2. [Goalies]()
      1. [All Goalies](#all-goalies)
      2. [Goalie Statistics by Team](#goalie-statistics-by-team)
   3. [Player Details](#player-details)
      1. [Player Profile](#player-profile)
      2. [Game-by-Game](#game-by-game)
      3. [Season Statistics](#season-statistics)
      4. [Most Recent Season Statistics](#most-recent-season-statistics)
   4. [League Leaders](#league-leaders)
      1. [Leading Skaters](#leading-skaters)
      2. [Top Scorers](#top-scorers)
      3. [Leading Goalies](#leading-goalies)
      4. [Top Goalies](#top-goalies)
   5. [Player Streaks](#player-streaks)
   6. [Player Transactions](#player-transactions)
   7. [Player Search](#player-search)
6. [Game Information](#game-information)
   1. [Game Preview](#game-preview)
   2. [Game Clock](#game-clock)
   3. [Play-by-Play (Short)](#play-by-play-short)
   4. [Play-by-Play (Long)](#play-by-play-long)
   5. [Game Summary](#game-summary)
7. [Playoff Information](#playoff-information)
8. [Bootstrap Data](#bootstrap-data)
   1. [Get Scorebar Bootstrap](#get-scorebar-bootstrap)
   2. [Get Game Summary Bootstrap](#get-game-summary-bootstrap)

### [Firebase API](#firebase-api-documentation)

1. [Base URL](#firebase-base-url)
2. [All Live Game Data](#all-live-game-data)
3. [Game Clock](#game-clock-1)
   1. [Running Clock](#running-clock)
   2. [Published Clock](#published-clock)
4. [Game Events](#game-events)
   1. [Faceoffs](#faceoffs)
   2. [Goals](#goals)
   3. [Penalties](#penalties)
   4. [Shot Summary](#shot-summary)

### [Formatted Data](#formatted-data)

1. [Base URL](#hockeytech-base-url-1)
2. [Mobile Site](#mobile-site)
   1. [League Schedule](#league-schedule)
      1. [Monthly Schedule](#monthly-schedule)
      2. [Daily Schedule](#daily-schedule-1)
      3. [Calendar Feed](#calendar-feed)
   2. [Game Summaries](#game-summaries)
   3. [Team Rosters](#team-rosters)
   4. [Player Statistics](#player-statistics)
   5. [Player Profile](#player-profile-1)
3. [Media Access](#media-access)
   1. [Standings](#standings)
   2. [Daily Report](#daily-report)
   3. [Team Reports](#team-reports)
      1. [Season Schedule](#season-schedule)
      2. [Player Game by Game](#player-game-by-game)
      3. [Roster](#roster)
   4. [Special Reports](#special-reports)
      1. [Team Head to Head](#team-head-to-head)
      2. [Player Stats By Team](#player-stats-by-team)
      3. [Overall Team Records](#overall-team-records)
      4. [Team Game Highs and Lows](#team-game-highs-and-lows)
      5. [Attendance Report](#attendance-report)
      6. [Hat Tricks and Shutouts](#hat-tricks-and-shutouts)

### [Notes on API Usage](#notes-on-api-usage)

---

# HockeyTech API Documentation

This section provides documentation for the PWHL HockeyTech API (via LeagueStat), which is primarily used for historical
data and statistics.

## HockeyTech Base URL

All endpoints described in this section are relative to the following base URL:

```
https://lscluster.hockeytech.com/feed/
```

Most HockeyTech API endpoints require the following parameters:

```
key=446521baf8c38984&client_code=pwhl
```

## Season Information

- **Endpoint**: `index.php`
- **Method**: GET
- **Description**: Retrieve all PWHL seasons.
- **Parameters**:
  - `feed` = `modulekit`
  - `view` = `seasons`
- **Response**: JSON format
- **Output**: [seasons.csv](data/basic/seasons.csv)

**Example using cURL:**

```bash
curl -X GET "https://lscluster.hockeytech.com/feed/index.php?feed=modulekit&view=seasons&key=446521baf8c38984&client_code=pwhl"
```

**Verbatim Response Shape:**

```json
{
  "SiteKit": {
    "Parameters": {
      "feed": "modulekit",
      "view": "seasons",
      "key": "446521baf8c38984",
      "client_code": "pwhl",
      "league_id": "1",
      "season_id": "8"
    },
    "Seasons": [
      {
        "season_id": "8",
        "season_name": "2025-26 Regular Season",
        "shortname": "2025-26 Reg",
        "career": "1",
        "playoff": "0",
        "start_date": "2025-11-21",
        "end_date": "2026-04-27"
      },
      {
        "season_id": "7",
        "season_name": "2025-26 Preseason",
        "shortname": "2025-26 Preseason",
        "career": "0",
        "playoff": "0",
        "start_date": "2025-06-01",
        "end_date": "2025-11-19"
      },
      {
        "season_id": "6",
        "season_name": "2025 Playoffs",
        "shortname": "2025 Playoffs",
        "career": "1",
        "playoff": "1",
        "start_date": "2025-05-06",
        "end_date": "2025-06-03"
      },
      {
        "season_id": "5",
        "season_name": "2024-25 Regular Season",
        "shortname": "2024-25 Reg",
        "career": "1",
        "playoff": "0",
        "start_date": "2024-11-25",
        "end_date": "2025-05-05"
      }
    ],
    "Copyright": {
      "required_copyright": "Official statistics provided by Professional Women's Hockey League",
      "required_link": "http://leaguestat.com",
      "powered_by": "Powered by HockeyTech.com",
      "powered_by_url": "http://hockeytech.com"
    }
  }
}
```

## Schedule Information

### Season Game Schedule

- **Endpoint**: `index.php`
- **Method**: GET
- **Description**: Retrieve the full game schedule for a given season.
- **Parameters**:
  - `feed` = `modulekit`
  - `view` = `schedule`
  - `season_id` = `5` (or specific season ID)
- **Response**: JSON format

**Example using cURL:**

```bash
curl -X GET "https://lscluster.hockeytech.com/feed/?feed=modulekit&view=schedule&season_id=5&key=446521baf8c38984&client_code=pwhl"
```

**Verbatim Response Shape:**

```json
{
  "SiteKit": {
    "Parameters": {
      "feed": "modulekit",
      "view": "schedule",
      "season_id": 8,
      "key": "446521baf8c38984",
      "client_code": "pwhl",
      "league_id": "1"
    },
    "Schedule": [
      {
        "id": "210",
        "game_id": "210",
        "season_id": "8",
        "quick_score": "0",
        "date_played": "2025-11-21",
        "date": "Nov. 21",
        "date_with_day": "Fri, Nov 21",
        "date_time_played": "2025-11-21T19:00:00Z",
        "GameDateISO8601": "2025-11-21T19:00:00-05:00",
        "home_team": "2",
        "visiting_team": "6",
        "home_goal_count": "1",
        "visiting_goal_count": "2",
        "period": "3",
        "overtime": "0",
        "schedule_time": "19:00:00",
        "schedule_notes": "",
        "game_clock": "00:00:00",
        "timezone": "Canada/Eastern",
        "game_number": "1",
        "shootout": "0",
        "attendance": "9138",
        "status": "4",
        "location": "29",
        "game_status": "Final",
        "intermission": "0",
        "game_type": "",
        "game_letter": "",
        "if_necessary": "0",
        "period_trans": "3",
        "started": "1",
        "final": "1",
        "tickets_url": "https://www.ticketmaster.com/...",
        "home_audio_url": "",
        "visiting_audio_url": "",
        "home_team_name": "Minnesota Frost",
        "home_team_code": "MIN",
        "home_team_nickname": "Frost",
        "home_team_city": "Minnesota",
        "home_team_division_long": "PWHL",
        "home_team_division_short": "PWHL",
        "visiting_team_name": "Toronto Sceptres",
        "visiting_team_code": "TOR",
        "visiting_team_nickname": "Sceptres",
        "visiting_team_city": "Toronto",
        "visiting_team_division_long": "PWHL",
        "visiting_team_division_short": "PWHL",
        "notes_text": "",
        "use_shootouts": "1",
        "venue_name": "Grand Casino Arena | St. Paul",
        "venue_url": "https://www.grandcasinoarena.com/",
        "venue_location": "St. Paul, MN",
        "last_modified": "2025-11-22 02:49:37",
        "client_code": "pwhl",
        "scheduled_time": "7:00 pm EST",
        "broadcasters": {
          "home_video_fr": [
            {
              "broadcaster_id": "22",
              "name": "FanDuel",
              "logo_url": "https://assets.leaguestat.com/...",
              "url": "..."
            }
          ],
          "home_video": [
            {
              "broadcaster_id": "5",
              "name": "TSN",
              "logo_url": "https://assets.leaguestat.com/...",
              "url": "..."
            }
          ]
        },
        "mobile_calendar": "..."
      }
    ]
  }
}
```

### Team Schedule

- **Endpoint**: `index.php`
- **Method**: GET
- **Description**: Retrieve the game schedule for a given team and season.
- **Parameters**:
  - `feed` = `statviewfeed`
  - `view` = `schedule`
  - `team` = `3` (or specific team ID)
  - `season` = `5` (or specific season ID)
  - `month` = `-1` (to include all months)
- **Response**: JSON format

**Example using cURL:**

```bash
curl -X GET "https://lscluster.hockeytech.com/feed/index.php?feed=statviewfeed&view=schedule&team=3&season=5&month=-1&key=446521baf8c38984&client_code=pwhl"
```

### Daily Schedule

- **Endpoint**: `index.php`
- **Method**: GET
- **Description**: Retrieve the daily game schedule.
- **Parameters**:
  - `feed` = `modulekit`
  - `view` = `gamesperday`
  - `start_date` = `2023-01-01`
  - `end_date` = `2026-01-01`
- **Response**: JSON format

**Example using cURL:**

```bash
curl -X GET "https://lscluster.hockeytech.com/feed/index.php?feed=modulekit&view=gamesperday&start_date=2023-01-01&end_date=2026-01-01&key=446521baf8c38984&client_code=pwhl"
```

### Scorebar

- **Endpoint**: `index.php`
- **Method**: GET
- **Description**: Retrieve scorebar information (contains game schedules and scores).
- **Parameters**:
  - `feed` = `modulekit`
  - `view` = `scorebar`
  - `numberofdaysback` = `1000`
  - `numberofdaysahead` = `1000`
- **Response**: JSON format

**Example using cURL:**

```bash
curl -X GET "https://lscluster.hockeytech.com/feed/index.php?feed=modulekit&view=scorebar&numberofdaysback=1000&numberofdaysahead=1000&key=446521baf8c38984&client_code=pwhl"
```

## Team Information

### All Teams

- **Endpoint**: `index.php`
- **Method**: GET
- **Description**: Retrieve all PWHL teams for a given season.
- **Parameters**:
  - `feed` = `modulekit`
  - `view` = `teamsbyseason`
  - `season_id` = `5` (or specific season ID)
- **Response**: JSON format
- **Output**: [teams.csv](data/basic/teams.csv)

**Example using cURL:**

```bash
curl -X GET "https://lscluster.hockeytech.com/feed/index.php?feed=modulekit&view=teamsbyseason&season_id=5&key=446521baf8c38984&client_code=pwhl"
```

**Verbatim Response Shape:**

```json
{
  "SiteKit": {
    "Parameters": {
      "feed": "modulekit",
      "view": "teamsbyseason",
      "season_id": 8,
      "key": "446521baf8c38984",
      "client_code": "pwhl",
      "league_id": "1"
    },
    "Teamsbyseason": [
      {
        "id": "1",
        "name": "Boston Fleet",
        "city": "Boston",
        "code": "BOS",
        "nickname": "Fleet",
        "team_caption": "",
        "division_id": "1",
        "division_long_name": "PWHL",
        "division_short_name": "PWHL",
        "team_logo_url": "https://assets.leaguestat.com/pwhl/logos/1.png"
      },
      {
        "id": "2",
        "name": "Minnesota Frost",
        "city": "Minnesota",
        "code": "MIN",
        "nickname": "Frost",
        "team_caption": "",
        "division_id": "1",
        "division_long_name": "PWHL",
        "division_short_name": "PWHL",
        "team_logo_url": "https://assets.leaguestat.com/pwhl/logos/2.jpg"
      }
    ]
  }
}
```

### Rosters

- **Endpoint**: `index.php`
- **Method**: GET
- **Description**: Retrieve roster for a specific team.
- **Parameters**:
  - `feed` = `modulekit`
  - `view` = `roster`
  - `team_id` = `3` (or specific team ID)
  - `season_id` = `5` (or specific season ID)
- **Response**: JSON format

**Example using cURL:**

```bash
curl -X GET "https://lscluster.hockeytech.com/feed/index.php?feed=modulekit&view=roster&team_id=3&season_id=5&key=446521baf8c38984&client_code=pwhl"
```

**Verbatim Response Shape:**

```json
{
  "SiteKit": {
    "Parameters": {
      "feed": "modulekit",
      "view": "roster",
      "team_id": "4",
      "season_id": 8,
      "key": "446521baf8c38984",
      "client_code": "pwhl",
      "league_id": "1"
    },
    "Roster": [
      {
        "id": "251",
        "person_id": "494",
        "active": "1",
        "first_name": "Dayle",
        "last_name": "Ross",
        "phonetic_name": "",
        "display_name": "",
        "shoots": "R",
        "hometown": "Spirit River, AB",
        "homeprov": "",
        "homecntry": "",
        "homeplace": "Spirit River, Alberta",
        "birthtown": "Spirit River",
        "birthprov": "Alberta",
        "birthcntry": "Canada",
        "birthplace": "Spirit River, Alberta",
        "height": "5'6",
        "weight": "0",
        "height_hyphenated": "5-6",
        "hidden": "0",
        "current_team": "",
        "player_id": "251",
        "status": "Signed",
        "birthdate": "2003-05-26",
        "birthdate_year": "'03",
        "rawbirthdate": "2003-05-26",
        "latest_team_id": "4",
        "veteran_status": "2",
        "veteran_description": "",
        "team_name": "New York Sirens",
        "division": "PWHL",
        "tp_jersey_number": "2",
        "rookie": "1",
        "position_id": "1",
        "position": "D",
        "nhlteam": "",
        "playerId": "251",
        "isRookie": "*",
        "h": "5'6",
        "w": "0",
        "draft_status": "",
        "draftinfo": [],
        "name": "Dayle Ross",
        "player_image": "https://assets.leaguestat.com/pwhl/240x240/251.jpg"
      }
    ]
  }
}
```

### League Standings

- **Endpoint**: `index.php`
- **Method**: GET
- **Description**: Retrieve PWHL standings for a given season.
- **Parameters**:
  - `feed` = `modulekit`
  - `view` = `statviewtype`
  - `stat` = `conference`
  - `type` = `standings`
  - `season_id` = `5` (or specific season ID)
- **Response**: JSON format

**Example using cURL:**

```bash
curl -X GET "https://lscluster.hockeytech.com/feed/index.php?feed=modulekit&view=statviewtype&stat=conference&type=standings&season_id=5&key=446521baf8c38984&client_code=pwhl"
```

**Verbatim Response Shape:**

```json
{
  "SiteKit": {
    "Parameters": {
      "feed": "modulekit",
      "view": "statviewtype",
      "stat": "conference",
      "type": "standings",
      "season_id": 8,
      "key": "446521baf8c38984",
      "client_code": "pwhl",
      "league_id": "1"
    },
    "Statviewtype": [
      {
        "repeatheader": 1,
        "name": "PWHL"
      },
      {
        "team_id": "1",
        "name": "Boston Fleet",
        "nickname": "Fleet",
        "city": "Boston",
        "team_code": "BOS",
        "placeholder": "0",
        "division_id": "1",
        "wins": "10",
        "losses": "2",
        "ties": "0",
        "ot_losses": "0",
        "reg_ot_losses": "2",
        "reg_losses": "2",
        "ot_wins": "0",
        "shootout_wins": "2",
        "non_reg_wins": "2",
        "shootout_losses": "2",
        "non_reg_losses": "2",
        "regulation_wins": "8",
        "row": "8",
        "points": "30",
        "bench_minutes": "2",
        "penalty_minutes": "54",
        "past_10_wins": "6",
        "past_10_losses": "2",
        "past_10_ties": "0",
        "past_10_ot_losses": "0",
        "past_10_shootout_losses": "2",
        "goals_for": "34",
        "goals_against": "23",
        "goals_diff": "11",
        "power_play_goals": "9",
        "power_play_goals_against": "2",
        "shootout_goals": "8",
        "shootout_goals_against": "8",
        "shootout_attempts": "26",
        "shootout_attempts_against": "25",
        "short_handed_goals_for": "1",
        "short_handed_goals_against": "1",
        "percentage": "1.071",
        "percentage_full": "1.0714",
        "clinched_playoff_spot": "0",
        "clinched_group_title": "0",
        "overall_rank": "1",
        "shootout_games_played": "4",
        "games_played": "14",
        "shootout_pct": "0.500",
        "power_play_pct": "20.4",
        "shootout_pct_goals_for": "0.308",
        "shootout_pct_goals_against": "0.320",
        "penalty_kill_pct": "94.3",
        "pim_pg": "3.9",
        "power_plays": "44",
        "win_percentage": "0.714",
        "times_short_handed": "35",
        "divisname": "PWHL",
        "games_remaining": "16",
        "conference_name": "PWHL",
        "streak": "4-0-0-1",
        "rank": 1,
        "shootout_record": "2-2",
        "home_record": "6-1-0-1",
        "visiting_record": "4-1-0-1",
        "past_10": "6-2-0-2",
        "clinched": "",
        "team_name": "Boston Fleet",
        "teamname": "Boston Fleet",
        "division_name": "PWHL"
      }
    ]
  }
}
```

## Player Information

### Skaters

#### All Skaters

- **Endpoint**: `index.php`
- **Method**: GET
- **Description**: Retrieve statistics for all skaters in the league.
- **Parameters**:
  - `feed` = `statviewfeed`
  - `view` = `players`
  - `season` = `5` (or specific season ID)
  - `team` = `all`
  - `position` = `skaters`
  - `rookies` = `0`
  - `statsType` = `standard`
  - `league_id` = `1`
  - `limit` = `500`
  - `sort` = `points`
  - `lang` = `en`
- **Response**: JSON format

**Example using cURL:**

```bash
curl -X GET "https://lscluster.hockeytech.com/feed/index.php?feed=statviewfeed&view=players&season=5&team=all&position=skaters&rookies=0&statsType=standard&rosterstatus=undefined&site_id=0&league_id=1&lang=en&division=-1&conference=-1&key=446521baf8c38984&client_code=pwhl&league_id=1&limit=500&sort=points&league_id=1&lang=en&division=-1&conference=-1"
```

**Verbatim Response Shape:**

> **Note**: This feed returns data wrapped in parentheses `(...)`.

```json
[
  {
    "sections": [
      {
        "title": "",
        "headers": {
          "rank": { "properties": { "key": "rank", "title": "Rank", "sortKey": "" } },
          "rookie": { "properties": { "key": "rookie", "title": "Rookie", "sortKey": "" } },
          "active": { "properties": { "key": "active", "title": "Active", "sortKey": "" } },
          "name": { "properties": { "key": "name", "title": "Name", "sortKey": "name" } },
          "position": { "properties": { "key": "position", "title": "Position", "sortKey": "" } },
          "team_code": { "properties": { "key": "team_code", "title": "Name", "sortKey": "" } },
          "games_played": {
            "properties": { "key": "games_played", "title": "Games Played", "sortKey": "gp" }
          },
          "goals": { "properties": { "key": "goals", "title": "Goals", "sortKey": "goals" } },
          "assists": {
            "properties": { "key": "assists", "title": "Assists", "sortKey": "assists" }
          },
          "points": { "properties": { "key": "points", "title": "Points", "sortKey": "points" } },
          "plus_minus": {
            "properties": { "key": "plus_minus", "title": "Plus/Minus", "sortKey": "plus_minus" }
          },
          "penalty_minutes": {
            "properties": { "key": "penalty_minutes", "title": "Penalty Minutes", "sortKey": "pim" }
          },
          "power_play_goals": {
            "properties": {
              "key": "power_play_goals",
              "title": "Power Play Goals",
              "sortKey": "ppgoals"
            }
          },
          "power_play_assists": {
            "properties": {
              "key": "power_play_assists",
              "title": "Power Play Assists",
              "sortKey": "ppassists"
            }
          }
        },
        "data": [
          {
            "prop": {
              "name": { "playerLink": "20", "seoName": "Kendall Coyne Schofield" },
              "active": { "active": "1" },
              "rookie": { "rookie": "0" },
              "team_code": { "teamLink": "2" }
            },
            "row": {
              "player_id": "20",
              "name": "Kendall Coyne Schofield",
              "active": "1",
              "position": "F",
              "rookie": "0",
              "team_code": "MIN",
              "games_played": "15",
              "goals": "10",
              "shots": "48",
              "hits": "5",
              "shots_blocked_by_player": "5",
              "ice_time_minutes_seconds": "250:40",
              "shooting_percentage": "20.8",
              "assists": "6",
              "points": "16",
              "points_per_game": "1.07",
              "plus_minus": "13",
              "penalty_minutes": "0",
              "penalty_minutes_per_game": "0.00",
              "ice_time_per_game_avg": "16:42",
              "hits_per_game_avg": "0.33",
              "power_play_goals": "0",
              "power_play_assists": "1",
              "short_handed_goals": "0",
              "short_handed_assists": "0",
              "faceoff_attempts": "1",
              "faceoff_wins": "1",
              "faceoff_pct": "100.0",
              "rank": 1
            }
          }
        ]
      }
    ]
  }
]
```

#### Skater Statistics by Team

- **Endpoint**: `index.php`
- **Method**: GET
- **Description**: Retrieve skater statistics by team.
- **Parameters**:
  - `feed` = `modulekit`
  - `view` = `statviewtype`
  - `type` = `skaters`
  - `league_id` = `1`
  - `team_id` = `3` (or specific team ID)
  - `season_id` = `5` (or specific season ID)
- **Response**: JSON format

**Example using cURL:**

```bash
curl -X GET "https://lscluster.hockeytech.com/feed/index.php?feed=modulekit&view=statviewtype&type=skaters&league_id=1&team_id=3&season_id=5&key=446521baf8c38984&client_code=pwhl"
```

### Goalies

#### All Goalies

- **Endpoint**: `index.php`
- **Method**: GET
- **Description**: Retrieve statistics for all goalies in the league.
- **Parameters**:
  - `feed` = `statviewfeed`
  - `view` = `players`
  - `season` = `5` (or specific season ID)
  - `team` = `all`
  - `position` = `goalies`
  - `rookies` = `0`
  - `statsType` = `standard`
  - `league_id` = `1`
  - `limit` = `500`
  - `sort` = `gaa`
  - `qualified` = `all`
  - `lang` = `en`
- **Response**: JSON format

**Example using cURL:**

```bash
curl -X GET "https://lscluster.hockeytech.com/feed/index.php?feed=statviewfeed&view=players&season=5&team=all&position=goalies&rookies=0&statsType=standard&rosterstatus=undefined&site_id=0&first=0&limit=500&sort=gaa&league_id=1&lang=en&division=-1&conference=-1&qualified=all&key=446521baf8c38984&client_code=pwhl&league_id=1"
```

#### Goalie Statistics by Team

- **Endpoint**: `index.php`
- **Method**: GET
- **Description**: Retrieve goalie statistics by team.
- **Parameters**:
  - `feed` = `modulekit`
  - `view` = `statviewtype`
  - `type` = `goalies`
  - `league_id` = `1`
  - `team_id` = `3` (or specific team ID)
  - `season_id` = `5` (or specific season ID)
- **Response**: JSON format

**Example using cURL:**

```bash
curl -X GET "https://lscluster.hockeytech.com/feed/index.php?feed=modulekit&view=statviewtype&type=goalies&league_id=1&team_id=3&season_id=5&key=446521baf8c38984&client_code=pwhl"
```

### Player Details

#### Player Profile

- **Endpoint**: `index.php`
- **Method**: GET
- **Description**: Retrieve detailed information for a specific player.
- **Parameters**:
  - `feed` = `modulekit`
  - `view` = `player`
  - `category` = `profile`
  - `player_id` = `32` (or specific player ID)
- **Response**: JSON format

**Example using cURL:**

```bash
curl -X GET "https://lscluster.hockeytech.com/feed/?feed=modulekit&view=player&category=profile&player_id=32&key=446521baf8c38984&client_code=pwhl"
```

**Verbatim Response Shape:**

```json
{
  "SiteKit": {
    "Parameters": {
      "feed": "modulekit",
      "view": "player",
      "category": "profile",
      "player_id": "32",
      "key": "446521baf8c38984",
      "client_code": "pwhl",
      "league_id": "1",
      "season_id": "8"
    },
    "Player": {
      "first_name": "Laura",
      "last_name": "Stacey",
      "jersey_number": "7",
      "most_recent_team_id": "3",
      "most_recent_team_name": "Montréal Victoire",
      "most_recent_team_code": "MTL",
      "division": "PWHL",
      "active": "1",
      "rookie": "0",
      "position": "F",
      "height": "5'10\"",
      "weight": "0",
      "birthdate": "1994-05-05",
      "shoots": "R",
      "catches": "",
      "bio": "<ul><li><p>Olympic Participation:<strong> </strong>2 (2018, 2022)&nbsp;</p></li>...</ul>",
      "name": "Laura Stacey",
      "primary_image": "https://assets.leaguestat.com/pwhl/240x240/32.jpg",
      "birthtown": "Kleinburg",
      "birthprov": "Ontario",
      "birthcntry": "Canada",
      "hometown": "Kleinburg, ON",
      "homeprov": "Ontario",
      "homecntry": "",
      "draft": [],
      "draft_type": "extended",
      "careerhigh": "",
      "current_team": ""
    },
    "Copyright": {
      "required_copyright": "Official statistics provided by Professional Women's Hockey League",
      "required_link": "http://leaguestat.com",
      "powered_by": "Powered by HockeyTech.com",
      "powered_by_url": "http://hockeytech.com"
    }
  }
}
```

#### Player Media

- **Endpoint**: `index.php`
- **Method**: GET
- **Description**: Retrieve media for a specific player.
- **Parameters**:
  - `feed` = `modulekit`
  - `view` = `player`
  - `category` = `media`
  - `player_id` = `32` (or specific player ID)
- **Response**: JSON format

**Example using cURL:**

```bash
curl -X GET "https://lscluster.hockeytech.com/feed/?feed=modulekit&view=player&category=media&player_id=32&key=446521baf8c38984&client_code=pwhl"
```

#### Game-by-Game

- **Endpoint**: `index.php`
- **Method**: GET
- **Description**: Retrieve game-by-game statistics for a specific player, for a given season.
- **Parameters**:
  - `feed` = `modulekit`
  - `view` = `player`
  - `category` = `gamebygame`
  - `season_id` = `5` (or specific season ID)
  - `player_id` = `32` (or specific player ID)
- **Response**: JSON format

**Example using cURL:**

```bash
curl -X GET "https://lscluster.hockeytech.com/feed/index.php?feed=modulekit&view=player&category=gamebygame&season_id=5&player_id=32&key=446521baf8c38984&client_code=pwhl"
```

#### Season Statistics

- **Endpoint**: `index.php`
- **Method**: GET
- **Description**: Retrieve season and career statistics for a specific player.
- **Parameters**:
  - `feed` = `modulekit`
  - `view` = `player`
  - `category` = `seasonstats`
  - `player_id` = `32` (or specific player ID)
- **Response**: JSON format

**Example using cURL:**

```bash
curl -X GET "https://lscluster.hockeytech.com/feed/index.php?feed=modulekit&view=player&category=seasonstats&player_id=32&key=446521baf8c38984&client_code=pwhl"
```

#### Most Recent Season Statistics

- **Endpoint**: `index.php`
- **Method**: GET
- **Description**: Retrieve most reason season statistics for a specific player.
- **Parameters**:
  - `feed` = `modulekit`
  - `view` = `player`
  - `category` = `mostrecentseasonstats`
  - `player_id` = `32` (or specific player ID)
- **Response**: JSON format

**Example using cURL:**

```bash
curl -X GET "https://lscluster.hockeytech.com/feed/index.php?feed=modulekit&view=player&category=mostrecentseasonstats&player_id=32&key=446521baf8c38984&client_code=pwhl"
```

### League Leaders

#### Leading Skaters

- **Endpoint**: `index.php`
- **Method**: GET
- **Description**: Retrieve extended statistics for top skaters.
- **Parameters**:
  - `feed` = `modulekit`
  - `view` = `combinedplayers`
  - `type` = `skaters`
  - `season_id` = `5` (or specific season ID)
- **Response**: JSON format

**Example using cURL:**

```bash
curl -X GET "https://lscluster.hockeytech.com/feed/index.php?feed=modulekit&view=combinedplayers&type=skaters&season_id=5&key=446521baf8c38984&client_code=pwhl"
```

#### Top Scorers

- **Endpoint**: `index.php`
- **Method**: GET
- **Description**: Retrieve extended statistics for top scorers.
- **Parameters**:
  - `feed` = `modulekit`
  - `view` = `statviewtype`
  - `type` = `topscorers`
  - `season_id` = `5` (or specific season ID)
  - `first` = `0`
  - `limit` = `100`
- **Response**: JSON format

**Example using cURL:**

```bash
curl -X GET "https://lscluster.hockeytech.com/feed/index.php?feed=modulekit&view=statviewtype&type=topscorers&first=0&limit=100&season_id=5&key=446521baf8c38984&client_code=pwhl"
```

#### Leading Goalies

- **Endpoint**: `index.php`
- **Method**: GET
- **Description**: Retrieve extended statistics for leading goalies.
- **Parameters**:
  - `feed` = `modulekit`
  - `view` = `combinedplayers`
  - `type` = `goalies`
  - `season_id` = `5` (or specific season ID)
- **Response**: JSON format

**Example using cURL:**

```bash
curl -X GET "https://lscluster.hockeytech.com/feed/index.php?feed=modulekit&view=combinedplayers&type=goalies&season_id=5&key=446521baf8c38984&client_code=pwhl"
```

#### Top Goalies

- **Endpoint**: `index.php`
- **Method**: GET
- **Description**: Retrieve extended statistics for top goalies.
- **Parameters**:
  - `feed` = `modulekit`
  - `view` = `statviewtype`
  - `type` = `topgoalies`
  - `season_id` = `5` (or specific season ID)
  - `first` = `0`
  - `limit` = `100`
- **Response**: JSON format

**Example using cURL:**

```bash
curl -X GET "https://lscluster.hockeytech.com/feed/index.php?feed=modulekit&view=statviewtype&type=topgoalies&first=0&limit=100&season_id=5&key=446521baf8c38984&client_code=pwhl"
```

### Player Streaks

- **Endpoint**: `index.php`
- **Method**: GET
- **Description**: Retrieve player streaks for the given season.
- **Parameters**:
  - `feed` = `modulekit`
  - `view` = `statviewtype`
  - `type` = `streaks`
  - `season_id` = `5` (or specific season ID)
- **Response**: JSON format

**Example using cURL:**

```bash
curl -X GET "https://lscluster.hockeytech.com/feed/index.php?feed=modulekit&view=statviewtype&type=streaks&season_id=5&key=446521baf8c38984&client_code=pwhl"
```

### Player Transactions

- **Endpoint**: `index.php`
- **Method**: GET
- **Description**: Retrieve player transactions for the given season.
- **Parameters**:
  - `feed` = `modulekit`
  - `view` = `statviewtype`
  - `type` = `transactions`
  - `season_id` = `5` (or specific season ID)
- **Response**: JSON format

**Example using cURL:**

```bash
curl -X GET "https://lscluster.hockeytech.com/feed/index.php?feed=modulekit&view=statviewtype&type=transactions&season_id=5&key=446521baf8c38984&client_code=pwhl"
```

### Player Search

- **Endpoint**: `index.php`
- **Method**: GET
- **Description**: Search function for players.
- **Parameters**:
  - `feed` = `modulekit`
  - `view` = `searchplayers`
  - `search_term` = `Poulin`
- **Response**: JSON format

**Example using cURL:**

```bash
curl -X GET "https://lscluster.hockeytech.com/feed/index.php?feed=modulekit&view=searchplayers&search_term=Poulin&key=446521baf8c38984&client_code=pwhl"
```

## Game Information

### Game Preview

- **Endpoint**: `index.php`
- **Method**: GET
- **Description**: Retrieve preview information for a specific game.
- **Parameters**:
  - `feed` = `gc`
  - `tab` = `preview`
  - `game_id` = `137` (or specific game ID)
- **Response**: JSON format

**Example using cURL:**

```bash
curl -X GET "https://lscluster.hockeytech.com/feed/index.php?feed=gc&tab=preview&game_id=137&key=446521baf8c38984&client_code=pwhl"
```

### Game Clock

- **Endpoint**: `index.php`
- **Method**: GET
- **Description**: Retrieve the official clock and basic information for a specific game.
- **Parameters**:
  - `feed` = `gc`
  - `tab` = `clock`
  - `game_id` = `137` (or specific game ID)
- **Response**: JSON format

**Example using cURL:**

```bash
curl -X GET "https://lscluster.hockeytech.com/feed/index.php?feed=gc&tab=clock&game_id=137&key=446521baf8c38984&client_code=pwhl"
```

### Play-by-Play (Short)

- **Endpoint**: `index.php`
- **Method**: GET
- **Description**: Retrieve summarized play-by-play data for a specific game.
- **Parameters**:
  - `feed` = `gc`
  - `tab` = `pxp`
  - `game_id` = `137` (or specific game ID)
- **Response**: JSON format

**Example using cURL:**

```bash
curl -X GET "https://lscluster.hockeytech.com/feed/index.php?feed=gc&tab=pxp&game_id=137&key=446521baf8c38984&client_code=pwhl"
```

### Play-by-Play (Long)

- **Endpoint**: `index.php`
- **Method**: GET
- **Description**: Retrieve play-by-play data for a specific game.
- **Parameters**:
  - `feed` = `gc`
  - `tab` = `pxpverbose`
  - `game_id` = `137` (or specific game ID)
- **Response**: JSON format

**Example using cURL:**

```bash
curl -X GET "https://lscluster.hockeytech.com/feed/index.php?feed=gc&tab=pxpverbose&game_id=137&key=446521baf8c38984&client_code=pwhl"
```

### Game Summary

- **Endpoint**: `index.php`
- **Method**: GET
- **Description**: Retrieve summary information for a specific game.
- **Parameters**:
  - `feed` = `gc`
  - `tab` = `gamesummary`
  - `game_id` = `137` (or specific game ID)
  - `site_id` = `0`
  - `lang` = `en`
- **Response**: JSON format

**Example using cURL:**

```bash
curl -X GET "https://lscluster.hockeytech.com/feed/index.php?feed=gc&tab=gamesummary&game_id=137&key=446521baf8c38984&client_code=pwhl"
```

**Verbatim Response Shape:**

```json
{
  "GC": {
    "Parameters": {
      "feed": "gc",
      "tab": "gamesummary",
      "game_id": "137",
      "key": "446521baf8c38984",
      "client_code": "pwhl",
      "fmt": "json"
    },
    "Gamesummary": {
      "meta": {
        "id": "137",
        "season_id": "5",
        "league_id": "1",
        "home_team": "3",
        "visiting_team": "5",
        "game_number": "39",
        "game_letter": "",
        "type_id": "",
        "if_necessary": "0",
        "quick_score": "0",
        "mvp1": "31",
        "mvp2": "198",
        "mvp3": "28",
        "featured_player_id": "",
        "date_played": "2025-01-29",
        "schedule_time": "19:00:00",
        "timezone": "Canada/Eastern",
        "start_time": "19:07:00",
        "end_time": "21:38:00",
        "forfeit": "0",
        "shootout": "0",
        "shootout_first_shooter_home": "0",
        "attendance": "6150",
        "location": "8",
        "period": "3",
        "game_clock": "00:00:00",
        "status": "4",
        "started": "1",
        "game_length": "",
        "pending_final": "0",
        "final": "1",
        "home_goal_count": "4",
        "visiting_goal_count": "1",
        "public_notes": "",
        "private_notes": "Game delay for ice repair (duration 2 mins 37 sec)",
        "league_game_notes": "",
        "visiting_team_notes": "",
        "home_team_notes": "",
        "capacity": "",
        "schedule_notes": "",
        "home_goals_actual": "0",
        "visiting_goals_actual": "0",
        "length": "2:31",
        "timezone_short": "EST"
      },
      "txt_title": "GAME SUMMARY",
      "txt_scoring": "Scoring",
      "txt_total": "Total",
      "txt_shots": "Shots",
      "game_ident": "39",
      "game_date": "Wednesday, January 29, 2025",
      "game_length": "2:31",
      "status_title": "End",
      "status_value": "Final",
      "periods": {
        "1": { "id": "1", "short_name": "1", "long_name": "1st", "length": "1200" },
        "2": { "id": "2", "short_name": "2", "long_name": "2nd", "length": "1200" },
        "3": { "id": "3", "short_name": "3", "long_name": "3rd", "length": "1200" }
      },
      "visitor": {
        "id": "5",
        "code": "OTT",
        "team_code": "OTT",
        "name": "Ottawa Charge",
        "city": "Ottawa",
        "nickname": "Charge",
        "logo_caption": ""
      },
      "home": {
        "id": "3",
        "code": "MTL",
        "team_code": "MTL",
        "name": "Montréal Victoire",
        "city": "Montréal",
        "nickname": "Victoire",
        "logo_caption": ""
      },
      "venue": "Place Bell | Laval",
      "referee1": "Shauna Neary (49)",
      "referee2": "Chris Rumble (24)",
      "linesman1": "Luke Pye (80)",
      "linesman2": "Erin Zach (60)",
      "goals": [
        {
          "event": "goal",
          "time": "10:02",
          "team_id": "5",
          "period_id": "1",
          "goal_scorer": {
            "player_id": "161",
            "jersey_number": "13",
            "first_name": "Tereza",
            "last_name": "Vanišová"
          },
          "assist1_player": {
            "player_id": "60",
            "jersey_number": "71",
            "first_name": "Jincy",
            "last_name": "Roese"
          },
          "assist2_player": {
            "player_id": "71",
            "jersey_number": "23",
            "first_name": "Jocelyne",
            "last_name": "Larocque"
          },
          "plus": [],
          "minus": []
        }
      ]
    }
  }
}
```

## Playoff Information

- **Endpoint**: `index.php`
- **Method**: GET
- **Description**: Retrieve playoff bracket information.
- **Parameters**:
  - `feed` = `modulekit`
  - `view` = `brackets`
  - `season_id` = `3` (or specific playoff season ID)
- **Response**: JSON format

**Example using cURL:**

```bash
curl -X GET "https://lscluster.hockeytech.com/feed/index.php?feed=modulekit&view=brackets&season_id=3&key=446521baf8c38984&client_code=pwhl"
```

## Bootstrap Data

### Get Scorebar Bootstrap

- **Endpoint**: `index.php`
- **Method**: GET
- **Description**: Retrieve bootstrap configuration data for scorebar.
- **Parameters**:
  - `feed` = `statviewfeed`
  - `view` = `bootstrap`
  - `season_id` = `latest`
  - `pageName` = `scorebar`
  - `site_id` = `0`
  - `lang` = `en`
- **Response**: JSON format

**Example using cURL:**

```bash
curl -X GET "https://lscluster.hockeytech.com/feed/index.php?feed=statviewfeed&view=bootstrap&season=latest&pageName=scorebar&key=446521baf8c38984&client_code=pwhl&site_id=0&league_id=&league_code=&conference=-1&division=-1&lang=en"
```

### Get Game Summary Bootstrap

- **Endpoint**: `index.php`
- **Method**: GET
- **Description**: Retrieve bootstrap configuration data for game summary.
- **Parameters**:
  - `feed` = `statviewfeed`
  - `view` = `bootstrap`
  - `season_id` = `null`
  - `pageName` = `game-summary`
  - `site_id` = `0`
  - `lang` = `en`
- **Response**: JSON format

**Example using cURL:**

```bash
curl -X GET "https://lscluster.hockeytech.com/feed/index.php?feed=statviewfeed&view=bootstrap&season=null&pageName=game-summary&key=446521baf8c38984&client_code=pwhl&site_id=0&league_id=&league_code=&conference=-1&division=-1&lang=en"
```

---

# Firebase API Documentation

This section provides documentation for the PWHL Firebase API, which is primarily used for real-time game data.

## Firebase Base URL

All endpoints described in this section are relative to the following base URL:

```
https://leaguestat-b9523.firebaseio.com/svf/pwhl
```

The Firebase API endpoints typically require authentication parameters:

```
?auth=uwM69pPkdUhb0UuVAxM8IcA6pBAzATAxOc8979oJ&key=AIzaSyBVn0Gr6zIFtba-hQy3StkifD8bb7Hi68A
```

## All Live Game Data

- **Endpoint**: `.json`
- **Method**: GET
- **Description**: Retrieve all available real-time data for current PWHL games.
- **Response**: JSON format

**Example using cURL:**

```bash
curl -X GET "https://leaguestat-b9523.firebaseio.com/svf/pwhl.json?auth=uwM69pPkdUhb0UuVAxM8IcA6pBAzATAxOc8979oJ&key=AIzaSyBVn0Gr6zIFtba-hQy3StkifD8bb7Hi68A"
```

## Game Clock

### Running Clock

- **Endpoint**: `/runningclock.json`
- **Method**: GET
- **Description**: Retrieve the current running clock data for active games.
- **Response**: JSON format

**Example using cURL:**

```bash
curl -X GET "https://leaguestat-b9523.firebaseio.com/svf/pwhl/runningclock.json?auth=uwM69pPkdUhb0UuVAxM8IcA6pBAzATAxOc8979oJ"
```

### Published Clock

- **Endpoint**: `/publishedclock.json`
- **Method**: GET
- **Description**: Retrieve the published clock data for active games.
- **Response**: JSON format

**Example using cURL:**

```bash
curl -X GET "https://leaguestat-b9523.firebaseio.com/svf/pwhl/publishedclock.json?auth=uwM69pPkdUhb0UuVAxM8IcA6pBAzATAxOc8979oJ"
```

## Game Events

### Faceoffs

- **Endpoint**: `/faceoffs.json`
- **Method**: GET
- **Description**: Retrieve faceoff data from active games.
- **Response**: JSON format

**Example using cURL:**

```bash
curl -X GET "https://leaguestat-b9523.firebaseio.com/svf/pwhl/faceoffs.json?auth=uwM69pPkdUhb0UuVAxM8IcA6pBAzATAxOc8979oJ"
```

### Goals

- **Endpoint**: `/goals.json`
- **Method**: GET
- **Description**: Retrieve goal data from active games.
- **Response**: JSON format

**Example using cURL:**

```bash
curl -X GET "https://leaguestat-b9523.firebaseio.com/svf/pwhl/goals.json?auth=uwM69pPkdUhb0UuVAxM8IcA6pBAzATAxOc8979oJ"
```

### Penalties

- **Endpoint**: `/penalties.json`
- **Method**: GET
- **Description**: Retrieve penalty data from active games.
- **Response**: JSON format

**Example using cURL:**

```bash
curl -X GET "https://leaguestat-b9523.firebaseio.com/svf/pwhl/penalties.json?auth=uwM69pPkdUhb0UuVAxM8IcA6pBAzATAxOc8979oJ"
```

### Shot Summary

- **Endpoint**: `/shotssummary.json`
- **Method**: GET
- **Description**: Retrieve shot summary data from active games.
- **Response**: JSON format

**Example using cURL:**

```bash
curl -X GET "https://leaguestat-b9523.firebaseio.com/svf/pwhl/shotssummary.json?auth=uwM69pPkdUhb0UuVAxM8IcA6pBAzATAxOc8979oJ"
```

---

# Formatted Data Documentation

This section provides references for the publicly-available formatted data, such as game calendars, standings tables,
and player statistics.

## HockeyTech Base URL

Since formatted data seems to be provided entirely by HockeyTech/LeagueStat, all endpoints described in this section are
relative to the following base URL:

```
https://lscluster.hockeytech.com/
```

## Mobile Site

### League Schedule

#### Monthly Schedule

- **Endpoint**: `statview/mobile/pwhl/schedule`
- **Description**: View a list of games by calendar month.

**Full URL:**

```
https://lscluster.hockeytech.com/statview/mobile/pwhl/schedule
```

#### Daily Schedule

- **Endpoint**: `statview/mobile/pwhl/daily-schedule`
- **Description**: View a list of games by day.

**Full URL:**

```
https://lscluster.hockeytech.com/statview/mobile/pwhl/daily-schedule
```

#### Calendar Feed

- **Endpoint**: `components/calendar/ical_add_games.php`
- **Description**: Download the league's game calendar for a given season.
- **Parameters**:
  - `client_code` = `pwhl`
  - `season_id` = `5` (or specific season ID)

**Full URL:**

```
https://lscluster.hockeytech.com/components/calendar/ical_add_games.php?client_code=pwhl&season_id=5
```

### Game Summaries

- **Endpoint**: `statview/mobile/pwhl/game-center`
- **Description**: View the game summary for a given game.

**Full URL:**

```
https://lscluster.hockeytech.com/statview/mobile/pwhl/game-center/137
```

### Team Rosters

- **Endpoint**: `statview/mobile/pwhl/roster`
- **Description**: View team rosters.

**Full URL:**

The example below shows the roster for team 3 (MTL) for season 5 (2024-2025 Regular Season).

```
https://lscluster.hockeytech.com/statview/mobile/pwhl/roster/3/5
```

### Player Statistics

- **Endpoint**: `statview/mobile/pwhl/player-stats`
- **Description**: View a player statistics table.

**Full URL:**

```
https://lscluster.hockeytech.com/statview/mobile/pwhl/player-stats
```

### Player Profile

- **Endpoint**: `statview/mobile/pwhl/player`
- **Description**: View a given player's profile.

**Full URL:**

The example below shows the profile for player 32 (Laura Stacey) for season 5 (2024-2025 Regular Season).

```
https://lscluster.hockeytech.com/statview/mobile/pwhl/player/32/5
```

## Media Access

### Standings

- **Endpoint**: `media/pwhl/pwhl/index.php`
- **Description**: Retrieve team standings for the league.
- **Parameters**:
  - `step` = `4`
  - `sub` = `0`
  - `season_id` = `5` (or specific season ID)
  - `order` = `overall`

**Full URL:**

```
https://lscluster.hockeytech.com/media/pwhl/pwhl/index.php?step=4&sub=0
```

### Daily Report

- **Endpoint**: `download.php`
- **Description**: View the daily report for the league.
- **Parameters**:
  - `client_code` = `pwhl`
  - `file_path` = `daily-report`

**Full URLs:**

```
https://lscluster.hockeytech.com/download.php?client_code=pwhl&file_path=daily-report/daily-report.html
```

```
https://lscluster.hockeytech.com/download.php?client_code=pwhl&file_path=daily-report/daily-report.pdf
```

### Team Reports

#### Season Schedule

- **Endpoint**: `media/pwhl/pwhl/index.php`
- **Description**: Retrieve the season schedule for a given team.
- **Parameters**:
  - `step` = `4`
  - `sub` = `9`
  - `format` = `HTML` (or `CSV`, `TAB`, `Word2000`)
  - `season_id` = `5` (or specific season ID)
  - `team` = `3` (or specific team ID)

**Full URL:**

```
https://lscluster.hockeytech.com/media/pwhl/pwhl/index.php?step=4&sub=9&format=HTML&season_id=5&team=3
```

#### Player Game by Game

- **Endpoint**: `media/pwhl/pwhl/index.php`
- **Description**: Retrieve player game-by-game report for a given team.
- **Parameters**:
  - `step` = `4`
  - `sub` = `11`
  - `format` = `HTML` (or `CSV`, `TAB`, `Word2000`)
  - `season_id` = `5` (or specific season ID)
  - `team` = `3` (or specific team ID)

**Full URL:**

```
https://lscluster.hockeytech.com/media/pwhl/pwhl/index.php?step=4&sub=11&format=HTML&season_id=5&team=3
```

#### Roster

- **Endpoint**: `media/pwhl/pwhl/index.php`
- **Description**: Retrieve the roster for a given team.
- **Parameters**:
  - `step` = `4`
  - `sub` = `4`
  - `format` = `HTML` (or `CSV`, `TAB`, `Word2000`)
  - `season_id` = `5` (or specific season ID)
  - `team` = `3` (or specific team ID)

**Full URL:**

```
https://lscluster.hockeytech.com/media/pwhl/pwhl/index.php?step=4&sub=4&format=HTML&season_id=5&team=3
```

### Special Reports

#### Team Head to Head

- **Endpoint**: `media/pwhl/pwhl/index.php`
- **Description**: Retrieve the head-to-head records for two teams for a given season.
- **Parameters**:
  - `step` = `4`
  - `sub` = `13`
  - `format` = `HTML` (or `CSV`, `TAB`, `Word2000`)
  - `season_id` = `5` (or specific season ID)
  - `team` = `3` (or specific team ID)
  - `second_team` = `5` (or specific team ID)

**Full URL:**

```
https://lscluster.hockeytech.com/media/pwhl/pwhl/index.php?season_id=5&step=4&sub=13
```

#### Player Stats By Team

- **Endpoint**: `media/pwhl/pwhl/index.php`
- **Description**: Retrieve player stats by team for a given season.
- **Parameters**:
  - `step` = `4`
  - `sub` = `1`
  - `format` = `HTML` (or `CSV`, `TAB`, `Word2000`)
  - `season_id` = `5` (or specific season ID)

**Full URL:**

```
https://lscluster.hockeytech.com/media/pwhl/pwhl/index.php?format=HTML&season_id=5&step=4&sub=1
```

#### Overall Team Records

- **Endpoint**: `media/pwhl/pwhl/index.php`
- **Description**: Retrieve detailed team records for a given season.
- **Parameters**:
  - `step` = `4`
  - `sub` = `10`
  - `format` = `HTML` (or `CSV`, `TAB`, `Word2000`)
  - `season_id` = `5` (or specific season ID)

**Full URL:**

```
https://lscluster.hockeytech.com/media/pwhl/pwhl/index.php?format=HTML&season_id=5&step=4&sub=10
```

#### Team Game Highs and Lows

- **Endpoint**: `media/pwhl/pwhl/index.php`
- **Description**: Show game records for a given season (i.e., most goals, most saves, etc.).
- **Parameters**:
  - `step` = `4`
  - `sub` = `12`
  - `format` = `HTML` (or `CSV`, `TAB`, `Word2000`)
  - `season_id` = `5` (or specific season ID)

**Full URL:**

```
https://lscluster.hockeytech.com/media/pwhl/pwhl/index.php?format=HTML&season_id=5&step=4&sub=12
```

#### Attendance Report

- **Endpoint**: `media/pwhl/pwhl/index.php`
- **Description**: Show the attendance report for a given season.
- **Parameters**:
  - `step` = `4`
  - `sub` = `15`
  - `format` = `HTML` (or `CSV`, `TAB`, `Word2000`)
  - `season_id` = `5` (or specific season ID)

**Full URL:**

```
https://lscluster.hockeytech.com/media/pwhl/pwhl/index.php?format=HTML&season_id=5&step=4&sub=15
```

#### Hat Tricks and Shutouts

- **Endpoint**: `media/pwhl/pwhl/index.php`
- **Description**: Show hat trick and shutout records for a given season.
- **Parameters**:
  - `step` = `4`
  - `sub` = `16`
  - `format` = `HTML` (or `CSV`, `TAB`, `Word2000`)
  - `season_id` = `5` (or specific season ID)

**Full URL:**

```
https://lscluster.hockeytech.com/media/pwhl/pwhl/index.php?format=HTML&season_id=5&step=4&sub=16
```

---

# Notes on API Usage

1. **Authentication**:

   - Firebase API requires both `auth` and `key` parameters.
   - HockeyTech API requires `key` and `client_code` parameters.

2. **PWHL IDs**:

   - Both APIs use numeric season IDs (e.g., `5` for the 2024-2025 season). See [seasons.csv](data/basic/seasons.csv).
   - Each team has a unique numeric ID (e.g., `3` for MTL). See [teams.csv](data/basic/teams.csv).
   - Games also have unique numeric IDs used across both API systems.

3. **Error Handling**:

   - The APIs do not consistently return standard HTTP status codes for errors.
   - Check for specific error fields in the JSON response.

4. **JSONP Behavior**:
   - Some endpoints (particularly those with `feed=statviewfeed`) return JSON wrapped in parentheses, e.g., `({"key": "value"})`.
   - To parse this in JavaScript/TypeScript, you should trim the leading `(` and trailing `)`:
     ```typescript
     const rawData = await response.text();
     const jsonData = JSON.parse(rawData.trim().replace(/^\(|\)$/g, ''));
     ```
