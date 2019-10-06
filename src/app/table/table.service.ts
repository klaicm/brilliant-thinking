import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable()
export class TableService {

    private static TABLE_URL = environment.url + '/table';
    private static ALL_MATCHES_URL = environment.url + '/allMatches';

    constructor(private http: HttpClient) {}

    getTable(): Observable<any> {
        return this.http.get(`${TableService.TABLE_URL}`);
    }

    getAllMatches(): Observable<any> {
        return this.http.get(`${TableService.ALL_MATCHES_URL}`);
    }
}
