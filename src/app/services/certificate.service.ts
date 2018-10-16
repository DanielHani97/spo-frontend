import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import { Certificate } from '../model/certificate';
import { environment } from "../../environments/environment"

@Injectable()
export class CertificateService {

    //URL for CRUD operations
    TOKEN_KEY = "jwtToken";
    hostname = environment.hostname;

    allUrl = this.hostname + "/api/certificate";
    createUrl = this.hostname + "/api/certificate/create";
    globalUrl = this.hostname + "/api/certificate/edit";
    deleteUrl = this.hostname + "/api/certificate/delete";
    getCertificateUrl = this.hostname + "/api/certificate/all"
    getCertificateUserUrl = this.hostname + "/api/certificate/user"

    constructor(private http: Http) { }

    getCertificates(): Observable<Certificate[]> {

        console.log(this.getCertificateUrl)
        return this.http.get(this.getCertificateUrl, this.jwt())
            .map(this.extractData)
            .catch(this.handleError);
    }

    //Create projects
    createCertificates(certificate: Certificate): Observable<Certificate> {

        return this.http.post(this.createUrl, JSON.stringify(certificate), this.jwt())
            .map(success => success.status).catch(this.handleError);
    }

    getCertificateById(certificateId: string): Observable<Certificate> {

        console.log(this.globalUrl + "/" + certificateId);
        return this.http.get(this.globalUrl + "/" + certificateId, this.jwt())
            .map(this.extractData)
            .catch(this.handleError);
    }


    updateCertificate(certificate: Certificate): Observable<Certificate> {

        return this.http.put(this.globalUrl + "/" + certificate.id, JSON.stringify(certificate), this.jwt())
            .map(success => success.status)
            .catch(this.handleError);
    }

    deleteCertificateById(certificateId: string): Observable<Certificate> {

        return this.http.delete(this.allUrl + "/" + certificateId, this.jwt())
            .map(success => success.status)
            .catch(this.handleError);
    }

    getCertificateByUser(userId: string): Observable<Certificate[]> {
        return this.http.get(this.getCertificateUserUrl + "/" + userId, this.jwt())
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
