import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import { Schema } from '../../model/setup/schema';
import { environment } from "../../../environments/environment"

@Injectable()
export class SchemaService {

    //URL for CRUD operations
    TOKEN_KEY = "jwtToken";
    hostname = environment.hostname;

    createUrl = this.hostname + "/api/schema/create";
    getSchemaUrl = this.hostname + "/api/schema/all";
    deleteUrl = this.hostname + "/api/schema/delete";
    globalUrl = this.hostname + "/api/schema/edit";
    countUrl = this.hostname + "/api/schema/count"


    constructor(private http: Http) { }

    getSchema(): Observable<Schema[]> {
        return this.http.get(this.getSchemaUrl, this.jwt())
            .map(this.extractData)
            .catch(this.handleError);
    }

    getSchemaCn(): Observable<Schema[]> {
        return this.http.get(this.countUrl, this.jwt())
            .map(this.extractData)
            .catch(this.handleError);
    }

    //Create schemas
    createSchemas(schema: Schema): Observable<Schema> {

        return this.http.post(this.createUrl, JSON.stringify(schema), this.jwt())
            .map(success => success.status).catch(this.handleError);
    }

    getSchemaById(schemaId: string): Observable<Schema> {
        return this.http.get(this.globalUrl + "/" + schemaId, this.jwt())
            .map(this.extractData)
            .catch(this.handleError);
    }

    updateSchema(schema: Schema): Observable<Schema> {

        return this.http.put(this.globalUrl + "/" + schema.id, JSON.stringify(schema), this.jwt())
            .map(success => success.status)
            .catch(this.handleError);
    }

    deleteSchemaById(schemaId: string): Observable<number> {

        return this.http.delete(this.deleteUrl + "/" + schemaId, this.jwt())
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
