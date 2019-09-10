import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class PlayerService {

    private static PLAYER_URL = 'http://localhost:8080/player';

    constructor(private http: HttpClient) { }

    getPlayer(playerId: number): Observable<any> {
        return this.http.get(`${PlayerService.PLAYER_URL}/${playerId}`);
    }

    getPlayerMatches(playerId: number): Observable<any> {
        return this.http.get(`${PlayerService.PLAYER_URL}/matches/${playerId}`);
    }
}
