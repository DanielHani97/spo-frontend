import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';


import { Filestorage } from '../../model/ref/filestorage';
import { environment } from "../../../environments/environment"

@Injectable()
export class FilestorageService {

    //URL for CRUD operations
    TOKEN_KEY = "jwtToken";
    hostname = environment.hostname;

    saveUrl = this.hostname + "/api/file/save";
    loadUrl = this.hostname + "/api/file/edit";
    loadByInstanceUrl = this.hostname + "/api/file/download";

    constructor(private http: Http) { }

    //Create users
    saveFile(data: any): Observable<Filestorage> {
        return this.http.post(this.saveUrl, data, this.jwtFile())
            .map(success => success.status)
            .catch(this.handleError);
    }

    loadFile(userId: string): Observable<Filestorage> {
        return this.http.get(this.loadUrl + "/" + userId, this.jwt())
            .map(this.extractData)
            .catch(this.handleError);
    }

    loadByInstance(id: string): Observable<Filestorage> {
        return this.http.get(this.loadByInstanceUrl + "/" + id, this.jwt())
            .map(this.extractData)
            .catch(this.handleError);
    }

    private handleError(error: Response | any) {
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

    private jwtFile() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let token = localStorage.getItem(this.TOKEN_KEY)
        if (currentUser && token) {
            let headers = new Headers(
                {
                    //'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + token
                    //'Access-Control-Allow-Credentials' : true
                });
            return new RequestOptions({ headers: headers });
        }
    }

}
