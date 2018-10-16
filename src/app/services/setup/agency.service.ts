import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import { Agency } from '../../model/setup/agency';
import { environment } from "../../../environments/environment"

@Injectable()
export class AgencyService {

    //URL for CRUD operations
    TOKEN_KEY = "jwtToken";
    hostname = environment.hostname;

    allUrl = this.hostname + "/api/agency";
    createUrl = this.hostname + "/api/agency/create";
    globalUrl = this.hostname + "/api/agency/edit";
    deleteUrl = this.hostname + "/api/agency/delete";
    idUrl = this.hostname + "/api/agency/";
    getAgencyUrl = this.hostname + "/api/agency/all"

    //agencyidUrl = "http://localhost:8080/api/agency/delete";

    constructor(private http: Http) { }

    getAgency(): Observable<Agency[]> {
        return this.http.get(this.getAgencyUrl, this.jwt())
            .map(this.extractData)
            .catch(this.handleError);

    }

    //Create agencies
    createAgencies(agency: Agency): Observable<Agency> {
        return this.http.post(this.createUrl, JSON.stringify(agency), this.jwt())
            .map(success => success.status).catch(this.handleError);
    }

    getAgencyById(agencyId: string): Observable<Agency> {
        return this.http.get(this.globalUrl + "/" + agencyId, this.jwt())
            .map(this.extractData)
            .catch(this.handleError);
    }

    updateAgency(agency: Agency): Observable<Agency> {
        return this.http.put(this.globalUrl + "/" + agency.id, JSON.stringify(agency), this.jwt())
            .map(success => success.status)
            .catch(this.handleError);
    }

    deleteAgencyById(agencyId: string): Observable<number> {
        return this.http.delete(this.deleteUrl + "/" + agencyId, this.jwt())
            .map(success => success.status)
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
