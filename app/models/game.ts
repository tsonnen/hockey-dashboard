import { Team } from "./team";
import { LocalizedName } from "./localized-name";
import { TvBroadcast } from "./tv-broadcast";
import { PeriodDescriptor } from "./period-descriptor";

export class Game {
    id: number;
    season: number;
    gameType: number;
    venue: LocalizedName;
    neutralSite: boolean;
    startTimeUTC: string;
    easternUTCOffset: string;
    venueUTCOffset: string;
    venueTimezone: string;
    gameState: string;
    gameScheduleState: string;
    tvBroadcasts: TvBroadcast[];
    awayTeam: Team;
    homeTeam: Team;
    periodDescriptor: PeriodDescriptor;
    ticketsLink: string;
    ticketsLinkFr: string;
    gameCenterLink: string;

    constructor(data: Partial<Game>) {
        this.id = data.id ?? 0;
        this.season = data.season ?? 0;
        this.gameType = data.gameType ?? 0;
        this.venue = data.venue ?? { default: "" };
        this.neutralSite = data.neutralSite ?? false;
        this.startTimeUTC = data.startTimeUTC ?? "";
        this.easternUTCOffset = data.easternUTCOffset ?? "";
        this.venueUTCOffset = data.venueUTCOffset ?? "";
        this.venueTimezone = data.venueTimezone ?? "";
        this.gameState = data.gameState ?? "";
        this.gameScheduleState = data.gameScheduleState ?? "";
        this.tvBroadcasts = data.tvBroadcasts ?? [];
        this.awayTeam = data.awayTeam ? new Team(data.awayTeam) : new Team({});
        this.homeTeam = data.homeTeam ? new Team(data.homeTeam) : new Team({});
        this.periodDescriptor = data.periodDescriptor ?? {
            number: 0,
            periodType: "",
            maxRegulationPeriods: 0
        };
        this.ticketsLink = data.ticketsLink ?? "";
        this.ticketsLinkFr = data.ticketsLinkFr ?? "";
        this.gameCenterLink = data.gameCenterLink ?? "";
    }
} 