import { ArchData } from 'src/app/player/details/archData.model';
import { Match } from 'src/app/player/matches/match.model';

export class Player {

    firstName: String;
    lastName: String;
    points: number;
    wins: number;
    loses: number;
    archData: Set<ArchData>;
    matches: Set<Match>;
    seasons: Set<Match>;

}
