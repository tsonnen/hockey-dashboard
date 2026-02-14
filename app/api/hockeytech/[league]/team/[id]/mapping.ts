import { Player } from '@/app/models/team-details';

export type HockeyTechRow = Record<string, unknown>;

export function mapHtPlayerStats(s?: HockeyTechRow): Partial<Player> {
    if (!s) return {};
    return {
        gamesPlayed: s.games_played ? Number(s.games_played) : undefined,
        goals: s.goals ? Number(s.goals) : undefined,
        assists: s.assists ? Number(s.assists) : undefined,
        points: s.points ? Number(s.points) : undefined,
        plusMinus: s.plus_minus === undefined ? undefined : Number(s.plus_minus),
        savePct: s.save_percentage ? Number(s.save_percentage) : undefined,
        gaa: s.goals_against_average ? Number(s.goals_against_average) : undefined
    };
}

function getHeadshotUrl(p: HockeyTechRow, clientCode?: string, id?: number): string | undefined {
    const headshot = (p.face_image as string | undefined) ?? (p.image_url as string | undefined);
    if (!headshot && clientCode && id) {
        return `https://assets.leaguestat.com/${clientCode}/240x240/${id}.jpg`;
    }
    return headshot;
}

function splitFullName(fullName: string) {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length > 1) {
        return {
            firstName: parts[0].replace(/,$/, ''),
            lastName: parts.slice(1).join(' ')
        };
    }
    return { firstName: fullName, lastName: '' };
}

function parsePlayerName(p: HockeyTechRow) {
    const firstName = String(p.first_name ?? p.firstName ?? '').replace(/,$/, '');
    const lastName = String(p.last_name ?? p.lastName ?? '').replace(/,$/, '');
    const fullName = String(p.name ?? p.player_name ?? '');
    
    if (!firstName && !lastName && fullName) {
        return splitFullName(fullName);
    }
    return { firstName, lastName };
}

export function mapHtPlayer(p: HockeyTechRow, clientCode?: string, s?: HockeyTechRow): Player {
    const pos = String(p.position ?? p.role ?? '').toUpperCase();
    const id = Number(p.player_id ?? p.person_id ?? p.id ?? 0);
    const { firstName, lastName } = parsePlayerName(p);
    
    return {
        id,
        firstName: { default: firstName },
        lastName: { default: lastName },
        sweaterNumber: p.jersey ? Number(p.jersey) : (p.tp_jersey_number ? Number(p.tp_jersey_number) : undefined),
        positionCode: normalizeHtPosition(pos),
        headshot: getHeadshotUrl(p, clientCode, id),
        ...mapHtPlayerStats(s)
    };
}

export function processRoster(players: HockeyTechRow[], statsMap: Map<string, HockeyTechRow>, clientCode?: string) {
    const forwards: Player[] = [], defensemen: Player[] = [], goalies: Player[] = [];
    const staffKeywords = ['COACH', 'MANAGER', 'STAFF', 'TRAINER', 'EQUIPMENT', 'SCOUT', 'EXECUTIVE', 'DIRECTOR', 'PRESIDENT', 'OWNER', 'ANALYST', 'COORDINATOR'];
    
    for (const p of players) {
        const posStr = String(p.position ?? p.role ?? '').toUpperCase();
        if (staffKeywords.some(kw => posStr.includes(kw))) continue;
        
        const id = p.player_id ?? p.person_id ?? p.id;
        if (!id) continue;
        
        const player = mapHtPlayer(p, clientCode, statsMap.get(String(id)));
        if (player.positionCode === 'G') goalies.push(player);
        else if (player.positionCode === 'D') defensemen.push(player);
        else forwards.push(player);
    }
    return { forwards, defensemen, goalies };
}

function normalizeHtPosition(pos: string): string {
    pos = pos.toLocaleUpperCase();
    if (['LW', 'RW', 'C', 'D', 'G'].includes(pos)) return pos;
    if (pos.includes('GOALIE')) return 'G';
    if (pos.includes('LEFT WING')) return 'LW';
    if (pos.includes('RIGHT WING')) return 'RW';
    if (pos.includes('RIGHT D')) return 'RD';
    if (pos.includes('LEFT D')) return 'LD';
    if (pos.includes('CENTER')) return 'C';
    if (pos.includes('DEFENSE')) return 'D';
    return 'F';
}
