import { ArchData } from 'src/app/player/details/archData.model';
import { Match } from 'src/app/player/matches/match.model';

export class Player {

    id: number;
    firstName: String;
    lastName: String;
    points: number;
    winsInTwo: number;
    winsInTb: number;
    losesInTwo: number;
    losesInTb: number;
    elo: number;
    archData: Set<ArchData>;
    matches: Set<Match>;
    seasons: Set<Match>;

}
