import { Game } from "./game";
import { DatePromo } from "./date-promo";

export class GameDay {
    date: string;
    dayAbbrev: string;
    numberOfGames: number;
    datePromo: DatePromo[];
    games: Game[];

    constructor(data: Partial<GameDay>) {
        this.date = data.date ?? "";
        this.dayAbbrev = data.dayAbbrev ?? "";
        this.numberOfGames = data.numberOfGames ?? 0;
        this.datePromo = data.datePromo ?? [];
        this.games = data.games ? data.games.map(game => new Game(game)) : [];
    }
} 