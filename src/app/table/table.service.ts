import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class TableService {

    private static TABLE_URL = 'http://localhost:8080/table';
    private static ALL_MATCHES_URL = 'http://localhost:8080/allMatches';

    constructor(private http: HttpClient) {}

    getTable(): Observable<any> {
        return this.http.get(`${TableService.TABLE_URL}`);
    }

    getAllMatches(): Observable<any> {
        return this.http.get(`${TableService.ALL_MATCHES_URL}`);
    }
}
