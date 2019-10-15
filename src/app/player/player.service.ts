import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Match } from 'src/app/player/matches/match.model';
import { environment } from 'src/environments/environment';

@Injectable()
export class PlayerService {

    private static PLAYER_URL = environment.url + '/player';
    private static ALL_PLAYERS_URL = environment.url + '/allPlayers';
    private static SAVE_MATCH_URL = environment.url + '/saveMatch';
    private static ELO_STATS_URL = environment.url + '/elo-stats';

    constructor(private http: HttpClient) { }

    getPlayer(playerId: number): Observable<any> {
        return this.http.get(`${PlayerService.PLAYER_URL}/${playerId}`);
    }

    getPlayerMatches(playerId: number): Observable<any> {
        return this.http.get(`${PlayerService.PLAYER_URL}/matches/${playerId}`);
    }

    getAllPlayers(): Observable<any> {
        return this.http.get(PlayerService.ALL_PLAYERS_URL);
    }

    saveMatch(match: Match): Observable<any> {
        return this.http.post(PlayerService.SAVE_MATCH_URL, match);
    }

    getEloStats(playerAElo: number, playerBElo: number): Observable<any> {
        const params = new HttpParams()
            .set('playerAElo', playerAElo.toString())
            .set('playerBElo', playerBElo.toString());
        return this.http.get(`${PlayerService.ELO_STATS_URL}`, {params})
    }
}
