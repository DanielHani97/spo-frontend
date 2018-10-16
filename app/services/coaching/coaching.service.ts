import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import { Coaching } from '../../model/coaching/coaching';
import { User } from '../../model/user';
import { Technology } from '../../model/setup/technology';
import { CoachingCoach } from '../../model/coaching/coachingCoach';
import { CoachingUser } from '../../model/coaching/coachingUser';
import { CoachingActivity } from '../../model/coaching/coachingActivity';

import { environment } from "../../../environments/environment"

@Injectable()
export class CoachingService {

    //URL for CRUD operations
    TOKEN_KEY = "jwtToken";
    hostname = environment.hostname;

    //URL for CRUD operations
    urlTech = this.hostname + "/api/technology/list";
    urlTech2 = this.hostname + "/api/technology2/list";
    urlTech3 = this.hostname + "/api/technology3/list";
    urlTest = this.hostname + "/api/user/edit/";
    createUrl = this.hostname + "/api/coaching/create";
    globalUrl = this.hostname + "/api/coaching";
    editUrl = this.hostname + "/api/coaching/edit";
    approveURL = this.hostname + "/api/coaching/edit2";
    deleteUrl = this.hostname + "/api/coaching/delete";
    userURL = this.hostname + "/api/coachingUser/list";
    coachURL = this.hostname + "/api/coachingCoach/getall"
    createActURL = this.hostname + "/api/coachingActivities/create";
    getActURl = this.hostname + "/api/coachingAct/getall";
    updateAct = this.hostname + "/api/coachingActivities/update";
    lulusActURL = this.hostname + "/api/coachingActivities/lulus";
    keygenActURL = this.hostname + "/api/coachingActivities/keygen";
    deleteAct = this.hostname + "/api/coachingActivities";
    createCoachUrl = this.hostname + "/api/coachingCoach/create";
    createUserUrl = this.hostname + "/api/coachingUser/create";
    getCoachingUser = this.hostname + "/api/coachingUser/user";
    updateURL = this.hostname + "/api/coaching/update";
    deleteUser = this.hostname + "/api/coachingUser";
    deleteCoach = this.hostname + "/api/coachingCoach";
    verifiedUrl = this.hostname + "/api/coaching/verified";
    getCoachingRoleUrl = this.hostname + "/api/coaching/role";
    getCoachingActvFbUrl = this.hostname + "/api/coachingActivities/list";
    actReportURL = this.hostname + "/api/coachingActivity/report"

    constructor(private http: Http) { }

    getCoaching() {
        let url = "http://localhost:8080/api/coachingUser/all";
        return this.http.get(url, this.jwt());
    }

    getActivity(coachingId: string) {
        return this.http.get(this.hostname + "/api/coachingActivities/all/" + coachingId, this.jwt())
            .map(this.extractData)
            .catch(this.handleError);
    }

    getCoachingUserByUserId(id: string): Observable<CoachingUser> {
        return this.http.get(this.getCoachingUser + "/" + id, this.jwt())
            .map(this.extractData)
            .catch(this.handleError);
    }

    getCoachingActivityById(activityId: string): Observable<CoachingActivity> {
        return this.http.get(this.deleteAct + "/" + activityId, this.jwt())
            .map(this.extractData)
            .catch(this.handleError);
    }
    //Create coaching
    createCoaching(data: any): Observable<Coaching> {
        return this.http.post(this.createUrl, data, this.jwtFile())
            .map(this.extractData)
            .catch(this.handleError);
    }

    createCoach(coachingCoach: CoachingCoach): Observable<CoachingCoach> {
        let cpHeader = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: cpHeader });
        return this.http.post(this.createCoachUrl, coachingCoach, this.jwt())
            .map(success => success.status).catch(this.handleError);
    }

    createUser(coachingUser: CoachingUser): Observable<CoachingUser> {
        let cpHeader = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: cpHeader });
        return this.http.post(this.createUserUrl, coachingUser, this.jwt())
            .map(success => success.status).catch(this.handleError);
    }



    //create activity
    createActivity(coachingActivity: CoachingActivity): Observable<CoachingActivity> {
        let cpHeader = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: cpHeader });
        return this.http.post(this.createActURL, coachingActivity, this.jwt())
            .map(success => success.status).catch(this.handleError);
    }

    getCoachingAct(id: string): Observable<CoachingActivity[]> {
        return this.http.get(this.getActURl + "/" + id, this.jwt())
            .map(this.extractData)
            .catch(this.handleError);
    }

    getNewCoachingAct(id: string): Observable<CoachingActivity[]> {
        return this.http.get(this.getActURl + "/new/" + id, this.jwt())
            .map(this.extractData)
            .catch(this.handleError);
    }

    getCoachingCoach(id: string): Observable<CoachingCoach[]> {
        return this.http.get(this.coachURL + "/" + id, this.jwt())
            .map(this.extractData)
            .catch(this.handleError);
    }

    getFrontend(): Observable<Technology[]> {
        let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: cpHeaders });
        return this.http.get(this.urlTech, this.jwt())
            .map(this.extractData)
            .catch(this.handleError);
    }

    getBackend(): Observable<Technology[]> {
        let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: cpHeaders });
        return this.http.get(this.urlTech2, this.jwt())
            .map(this.extractData)
            .catch(this.handleError);
    }

    getDatabase(): Observable<Technology[]> {
        let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: cpHeaders });
        return this.http.get(this.urlTech3, this.jwt())
            .map(this.extractData)
            .catch(this.handleError);
    }

    getUserByCoaching(coachingId: string): Observable<CoachingUser[]> {
        let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: cpHeaders });
        return this.http.get(this.userURL + "/" + coachingId, this.jwt())
            .map(this.extractData)
            .catch(this.handleError);
    }

    getUser(id: string): Observable<User> {
        let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: cpHeaders });
        return this.http.get(this.urlTest + id, this.jwt())
            .map(this.extractData)
            .catch(this.handleError);
    }

    getCoachingById(coachingId: string): Observable<Coaching> {
        let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: cpHeaders });
        return this.http.get(this.globalUrl + "/" + coachingId, this.jwt())
            .map(this.extractData)
            .catch(this.handleError);
    }

    getActivitiReport(id): Observable<CoachingActivity[]> {
        return this.http.get(this.actReportURL + "/" + id, this.jwt())
            .map(this.extractData)
            .catch(this.handleError);
    }

    updateCoaching(coaching: Coaching): Observable<Coaching> {
        return this.http.put(this.editUrl + "/" + coaching.id, JSON.stringify(coaching), this.jwt())
            .map(success => success.status)
            .catch(this.handleError);
    }

    verifiedCoaching(coaching: Coaching): Observable<Coaching> {
        return this.http.put(this.verifiedUrl + "/" + coaching.id, JSON.stringify(coaching), this.jwt())
            .map(success => success.status)
            .catch(this.handleError);
    }

    editCoaching(data: any): Observable<Coaching> {
        return this.http.post(this.updateURL, data, this.jwtFile())
            .map(success => this.extractData)
            .catch(this.handleError);
    }

    approveCoaching(coaching: Coaching): Observable<Coaching> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.put(this.approveURL + "/" + coaching.id, JSON.stringify(coaching), this.jwt())
            .map(success => success.status)
            .catch(this.handleError);
    }

    deleteCoachingById(coachingId: string): Observable<Coaching> {
        let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: cpHeaders });
        return this.http.delete(this.deleteUrl + "/" + coachingId, this.jwt())
            .map(success => success.status)
            .catch(this.handleError);
    }

    deleteCoachingAct(id: string): Observable<CoachingActivity> {
        return this.http.delete(this.deleteAct + "/" + id, this.jwt())
            .map(success => success.status)
            .catch(this.handleError);
    }

    deleteCoachingUser(id: string): Observable<CoachingUser> {
        return this.http.delete(this.deleteUser + "/" + id, this.jwt())
            .map(success => success.status)
            .catch(this.handleError);
    }

    deleteCoachingCoach(id: string): Observable<CoachingCoach> {
        return this.http.delete(this.deleteCoach + "/" + id, this.jwt())
            .map(success => success.status)
            .catch(this.handleError);
    }

    updateActivity(array: any[]) {
        return this.http.post(this.updateAct, this.jwt())
            .map(success => success.status)
            .catch(this.handleError);
    }

    lulusAct(aktiviti: CoachingActivity): Observable<CoachingActivity> {
        return this.http.put(this.lulusActURL + "/" + aktiviti.id, JSON.stringify(aktiviti), this.jwt())
            .map(success => success.status)
            .catch(this.handleError);
    }

    keygenAct(aktiviti: CoachingActivity): Observable<CoachingActivity> {
        return this.http.put(this.keygenActURL + "/" + aktiviti.id, JSON.stringify(aktiviti), this.jwt())
            .map(success => success.status)
            .catch(this.handleError);
    }

    getCoachingRole(coachingId: String, userId: String): Observable<string> {
        return this.http.get(this.getCoachingRoleUrl + "/" + coachingId + "/" + userId, this.jwt())
            .map(
            data => {
                return data["_body"];
            }
            ).catch(this.handleError);
    }

    getCoachingActvFb(coachingId: String): Observable<CoachingActivity[]> {
        return this.http.get(this.getCoachingActvFbUrl + "/" + coachingId, this.jwt())
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

    private jwtFile2() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let token = localStorage.getItem(this.TOKEN_KEY)
        if (currentUser && token) {
            let headers = new Headers(
                {
                    //'Content-Type': 'application/json',
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + token
                    //'Access-Control-Allow-Credentials' : true
                });
            return new RequestOptions({ headers: headers });
        }
    }
}
