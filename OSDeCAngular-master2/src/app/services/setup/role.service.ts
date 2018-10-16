import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import { AppAuthority } from '../../model/setup/appauthority';
import { environment } from "../../../environments/environment"

@Injectable()
export class RoleService {

    hostname = environment.hostname;
    TOKEN_KEY = "jwtToken";
    urlRole = this.hostname + "/api/ref/role"
    urlCreate = this.hostname + "/api/role/create"
    urlEdit = this.hostname + "/api/role/edit"

    constructor(private http: Http) { }

    getRole() {
        return this.http.get(this.urlRole, this.jwt())
            .map(this.extractData)
            .catch(this.handleError);
    }

    createAppAuth(app: AppAuthority): Observable<AppAuthority> {
        return this.http.post(this.urlCreate, JSON.stringify(app), this.jwt())
            .map(success => success.status).catch(this.handleError);
    }

    updateAppAuth(app: AppAuthority): Observable<AppAuthority> {
        return this.http.put(this.urlEdit + "/" + app.id, JSON.stringify(app), this.jwt())
            .map(success => success.status)
            .catch(this.handleError);
    }

    getAppAuthById(id: string): Observable<AppAuthority> {
        console.log(this.urlEdit + "/" + id);
        return this.http.get(this.urlEdit + "/" + id, this.jwt())
            .map(this.extractData)
            .catch(this.handleError);
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

    private handleError(error: Response | any) {
        console.error(error.message || error);
        return Observable.throw(error.status);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body;
    }
}
