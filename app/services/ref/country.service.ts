import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import { State } from '../../model/ref/state';
import { City } from '../../model/ref/city';

import { environment } from "../../../environments/environment"

@Injectable()
export class CountryService {

    TOKEN_KEY = "jwtToken";
    hostname = environment.hostname;

    //URL for CRUD operations
    getStateUrl = this.hostname + "/api/ref/states";
    getCityUrl = this.hostname + "/api/ref/city";

    constructor(private http: Http) { }

    getState(): Observable<State[]> {
        return this.http.get(this.getStateUrl, this.jwt())
            .map(this.extractData)
            .catch(this.handleError);
    }

    getCity(stateId: String): Observable<City[]> {
        return this.http.get(this.getCityUrl + "/" + stateId, this.jwt())
            .map(this.extractData)
            .catch(this.handleError);
    }

    private handleError(error: Response | any) {
        console.error(error.message || error);
        return Observable.throw(error.status);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body;
    }

    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let token = localStorage.getItem(this.TOKEN_KEY)
        if (currentUser && token) {
            let headers = new Headers(
                {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                    //'Access-Control-Allow-Credentials' : true
                });
            return new RequestOptions({ headers: headers });
        }
    }
}
