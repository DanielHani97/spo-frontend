import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import { Training } from '../../model/training/training';
import { TrainingTx } from '../../model/training/trainingTx';
import { TrainingCoach } from '../../model/training/trainingCoach';
import { User } from '../../model/user';
import { Agency } from '../../model/setup/agency';
import { Technology } from '../../model/setup/technology'
import { environment } from "../../../environments/environment"

@Injectable()
export class TrainingService {

    //URL for CRUD operations
    TOKEN_KEY = "jwtToken";
    hostname = environment.hostname;

    userURL = this.hostname + "/api/trainingTx/list2";
    coachURL = this.hostname + "/api/trainingCoach/list";
    urlTest = this.hostname + "/api/user/edit/";
    nilaiURL = this.hostname + "/api/trainingTx";
    createUrl = this.hostname + "/api/training/create";
    globalUrl = this.hostname + "/api/training/edit";
    trainingURL = this.hostname + "/api/traininggetall";
    trainingTxURL = this.hostname + "/api/trainingTxall";
    deleteUrl = this.hostname + "/api/training/delete";
    padamUrl = this.hostname + "/api/trainingTx/delete";
    updateUrl = this.hostname + "/api/trainingTx/update";
    ciptaUrl = this.hostname + "/api/trainingTx/create";
    createCoachUrl = this.hostname + "/api/trainingCoach/create";
    padamCoachUrl = this.hostname + "/api/trainingCoach/delete";
    isExistUrl = this.hostname + "/api/trainingTx/isExist";
    laporanUrl = this.hostname + "/api/training/laporan";
    getTrainingRoleUrl = this.hostname + "/api/training/role";
    getUserTrainingUrl = this.hostname + "/api/trainingTx/listFb";

    constructor(private http: Http) { }

    // getTraining() {
    //   let url = this.hostname+"/api/traininggetall";
    //   return this.http.get(url);
    // }

    getTraining() {
        let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: cpHeaders });
        return this.http.get(this.trainingURL, this.jwt())
            .map(this.extractData)
            .catch(this.handleError);
    }

    getTrainingTx() {
        let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: cpHeaders });
        return this.http.get(this.trainingTxURL, this.jwt())
            .map(this.extractData)
            .catch(this.handleError);
    }

    getTrainingLaporan(txId: string): Observable<Training[]> {
        return this.http.get(this.laporanUrl + "/" + txId, this.jwt())
            .map(this.extractData)
            .catch(this.handleError);
    }


    //Create traininguser
    createTrainingTx(trainingTx: TrainingTx): Observable<TrainingTx> {
        return this.http.post(this.ciptaUrl, trainingTx, this.jwt())
            .map(success => success.status).catch(this.handleError);
    }

    //Create training
    createTraining(data: any): Observable<Training> {
        return this.http.post(this.createUrl, data, this.jwtFile())
            .map(this.extractData)
            .catch(this.handleError);
    }

    createCoach(trainingCoach: TrainingCoach): Observable<TrainingCoach> {
        let cpHeader = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: cpHeader });
        return this.http.post(this.createCoachUrl, trainingCoach, this.jwt())
            .map(success => success.status).catch(this.handleError);
    }

    deleteCoach(trainingCoachId: TrainingCoach): Observable<TrainingCoach> {

        return this.http.delete(this.padamCoachUrl + "/" + trainingCoachId, this.jwt())
            .map(success => success.status)
            .catch(this.handleError);
    }

    getCoachByTraining(trainingId: string): Observable<TrainingCoach[]> {
        let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: cpHeaders });
        return this.http.get(this.coachURL + "/" + trainingId, this.jwt())
            .map(this.extractData)
            .catch(this.handleError);
    }

    getUserByTraining(trainingId: string): Observable<TrainingTx[]> {
        return this.http.get(this.userURL + "/" + trainingId, this.jwt())
            .map(this.extractData)
            .catch(this.handleError);
    }

    getUser(id: string): Observable<User> {
        return this.http.get(this.urlTest + id, this.jwt())
            .map(this.extractData)
            .catch(this.handleError);
    }

    getTrainingById(trainingId: string): Observable<Training> {

        return this.http.get(this.globalUrl + "/" + trainingId, this.jwt())
            .map(this.extractData)
            .catch(this.handleError);
    }

    getTrainingTxById(trainingTxId: string): Observable<TrainingTx> {
        return this.http.get(this.nilaiURL + "/" + trainingTxId, this.jwt())
            .map(this.extractData)
            .catch(this.handleError);
    }

    updateTraining(data: any): Observable<Training> {
        return this.http.post(this.globalUrl, data, this.jwtFile())
            .map(this.extractData)
            .catch(this.handleError);
    }

    updateTrainingTx(trainingTx: TrainingTx): Observable<TrainingTx> {
        return this.http.put(this.updateUrl + "/" + trainingTx.id, JSON.stringify(trainingTx), this.jwt())
            .map(success => success.status)
            .catch(this.handleError);
    }

    deleteTrainingById(trainingId: string): Observable<Training> {
        return this.http.delete(this.deleteUrl + "/" + trainingId, this.jwt())
            .map(success => success.status)
            .catch(this.handleError);
    }

    deleteTrainingTxById(trainingTxId: string): Observable<TrainingTx> {
        return this.http.delete(this.padamUrl + "/" + trainingTxId, this.jwt())
            .map(success => success.status)
            .catch(this.handleError);
    }

    fileUpload(data: any): Observable<Training> {
        return this.http.post(this.hostname + "/auth/file", data, this.jwtFile())
            .map(success => success.status).catch(this.handleError);
    }

    isExistTrainingTx(trainingTx: TrainingTx): Observable<TrainingTx> {
        return this.http.post(this.isExistUrl, trainingTx, this.jwt())
            .map(success => success.status).catch(this.handleError);
    }

    getTrainingRole(trainingId: String, userId: String): Observable<string> {
        return this.http.get(this.getTrainingRoleUrl + "/" + trainingId + "/" + userId, this.jwt())
            .map(
            data => {
                return data["_body"];
            }
            ).catch(this.handleError);
    }

    getUserTraining(trainingId: string): Observable<TrainingTx[]> {
        return this.http.get(this.getUserTrainingUrl + "/" + trainingId, this.jwt())
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
