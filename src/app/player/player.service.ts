import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor(private http: HttpClient) { }

  testUrl: string = 'http://localhost:8080/greeting';

  getPlayerData(): Observable<any> {
    return this.http.get(this.testUrl);
  }
}
