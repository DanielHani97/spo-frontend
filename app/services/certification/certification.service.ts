import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import { Certification } from '../../model/certification/certification';
//import { CertificationCoach } from '../../model/certification/certificationCoach';
import { CertificationUser } from '../../model/certification/certificationUser';
import { User } from '../../model/user';
import { Agency } from '../../model/setup/agency';
import { Technology } from '../../model/setup/technology'

import { environment } from "../../../environments/environment"

@Injectable()
export class CertificationService {

    //URL for CRUD operations
    TOKEN_KEY = "jwtToken";
    hostname = environment.hostname;

    certURL = this.hostname + "/api/certificationgetall";
    certTxURL = this.hostname + "/api/certTxall";
    //urlTech = this.hostname+"/api/teknologi/senarai";
    createUrl = this.hostname + "/api/certification/create";
    //createCoachUrl = this.hostname+"/api/certificationCoach/create";
    ciptaUrl = this.hostname + "/api/certificationUser/create";
    userURL = this.hostname + "/api/certificationUser/list";
    //coachURL = this.hostname+"/api/certificationCoach/list";
    urlTest = this.hostname + "/api/user/edit/";
    nilaiURL = this.hostname + "/api/certificationUser";
    globalUrl = this.hostname + "/api/certification/edit";
    deleteUrl = this.hostname + "/api/certification/delete";
    updateUrl = this.hostname + "/api/certificationUser/update";
    padamUrl = this.hostname + "/api/certificationUser/delete";
    //padamCoachUrl = this.hostname+"/api/certificationCoach/delete";
    existUrl = this.hostname + "/api/certificationUser/isExist";

    constructor(private http: Http) { }

    getCertification() {
        let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: cpHeaders });
        return this.http.get(this.certURL, this.jwt())
            .map(this.extractData)
            .catch(this.handleError);
    }

    getCertTx() {
        let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: cpHeaders });
        return this.http.get(this.certTxURL, this.jwt())
            .map(this.extractData)
            .catch(this.handleError);
    }

    getCertificationById(certId: string): Observable<Certification> {
        return this.http.get(this.globalUrl + "/" + certId, this.jwt())
            .map(this.extractData)
            .catch(this.handleError);
    }

    getCertificationUserById(certUserId: string): Observable<CertificationUser> {
        return this.http.get(this.nilaiURL + "/" + certUserId, this.jwt())
            .map(this.extractData)
            .catch(this.handleError);
    }

    // getCoachByCertification(certId: string): Observable<CertificationCoach[]> {
    //   let cpHeaders = new Headers({ 'Content-Type': 'application/json'});
    //   let options = new RequestOptions({ headers: cpHeaders });
    //   console.log(this.coachURL + "/" + certId);
    //   return this.http.get(this.coachURL +"/"+ certId, this.jwt())
    //   .map(this.extractData)
    //   .catch(this.handleError);
    // }

    getUserByCertification(certId: string): Observable<Certification> {
        return this.http.get(this.userURL + "/" + certId, this.jwt())
            .map(this.extractData)
            .catch(this.handleError);
    }

    getUser(id: string): Observable<User> {
        return this.http.get(this.urlTest + id, this.jwt())
            .map(this.extractData)
            .catch(this.handleError);
    }

    // getTechnology(): Observable<Technology[]> {
    //   let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
    //    let options = new RequestOptions({ headers: cpHeaders });
    //    return this.http.get(this.urlTech, this.jwt())
    //   .map(this.extractData)
    //    .catch(this.handleError);
    // }

    //Create training
    createCertification(data: any): Observable<Certification> {
        return this.http.post(this.createUrl, data, this.jwtFile())
            .map(this.extractData)
            .catch(this.handleError);
    }

    // //Create trainingcoach
    // createCertificationCoach(certificationCoach: CertificationCoach):Observable<CertificationCoach>{
    //   let cpHeader = new Headers({ 'Content-Type': 'application/json' });
    //   let options = new RequestOptions({ headers: cpHeader });
    //   return this.http.post(this.createCoachUrl, certificationCoach, this.jwt())
    //   .map(success => success.status).catch(this.handleError);
    // }

    //Create traininguser
    createCertificationUser(certificationUser: CertificationUser): Observable<CertificationUser> {
        return this.http.post(this.ciptaUrl, certificationUser, this.jwt())
            .map(success => success.status).catch(this.handleError);
    }

    updateCertification(data: any): Observable<Certification> {
        return this.http.post(this.globalUrl, data, this.jwtFile())
            .map(this.extractData)
            .catch(this.handleError);
    }

    updateCertificationUser(certUser: CertificationUser): Observable<CertificationUser> {
        return this.http.put(this.updateUrl + "/" + certUser.id, JSON.stringify(certUser), this.jwt())
            .map(success => success.status)
            .catch(this.handleError);
    }

    updateCertificationUserFile(obj: any): Observable<CertificationUser> {
        return this.http.post(this.updateUrl, obj, this.jwtFile())
            .map(success => success.status)
            .catch(this.handleError);
    }

    deleteCertificationById(certId: string): Observable<Certification> {
        return this.http.delete(this.deleteUrl + "/" + certId, this.jwt())
            .map(success => success.status)
            .catch(this.handleError);
    }

    deleteCertificationUserById(certUserId: string): Observable<CertificationUser> {
        return this.http.delete(this.padamUrl + "/" + certUserId, this.jwt())
            .map(success => success.status)
            .catch(this.handleError);
    }

    // deleteCoach(certCoachId: CertificationCoach): Observable<CertificationCoach> {

    //     console.log(this.padamCoachUrl +"/"+ certCoachId);
    //     return this.http.delete(this.padamCoachUrl +"/"+ certCoachId, this.jwt())
    //      .map(success => success.status)
    //      .catch(this.handleError);
    // }

    isExistCertificationUser(obj: CertificationUser): Observable<CertificationUser> {
        return this.http.post(this.existUrl, obj, this.jwt())
            .map(success => success.status).catch(this.handleError);
    }

    fileUpload(data: any): Observable<Certification> {
        return this.http.post(this.hostname + "/auth/file", data, this.jwtFile())
            .map(success => success.status).catch(this.handleError);
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
