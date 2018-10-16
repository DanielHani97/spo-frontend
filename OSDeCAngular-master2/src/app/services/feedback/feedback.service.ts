import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import { UserFeedbackTrax } from '../../model/feedback/userFeedbackTrax';
import { UserFeedback } from '../../model/feedback/userFeedback';
import { Feedback } from '../../model/feedback/feedback';
import { TrainingTx } from '../../model/training/trainingTx';
import { Coaching } from '../../model/coaching/coaching';
import { FeedbackCollection } from '../../model/feedback/feedbackCollection';
import { environment } from "../../../environments/environment"

@Injectable()
export class FeedbackService {

    TOKEN_KEY = "jwtToken";
    hostname = environment.hostname;

    //URL for CRUD operations
    createUrl = this.hostname + "/api/feedback/create";
    loadUrl = this.hostname + "/api/feedback/edit";
    getCoachingFbUrl = this.hostname + "/api/feedback/getCoaching";
    getTrainingFbUrl = this.hostname + "/api/feedback/training";
    createUserFbUrl = this.hostname + "/api/feedback/user/create";
    getFeedbackStatusUrl = this.hostname + "/api/feedback/status";
    getFeedbackUrl = this.hostname + "/api/feedback/getTrax";
    getCapabFbUrl = this.hostname + "/api/feedback/getCapab";

    constructor(private http: Http) { }

    create(obj: FeedbackCollection): Observable<Feedback> {
        return this.http.post(this.createUrl, JSON.stringify(obj), this.jwt())
            .map(this.extractData).catch(this.throwErrorMessage);
    }

    load(id: String): Observable<Feedback> {
        return this.http.get(this.loadUrl + "/" + id, this.jwt())
            .map(this.extractData).catch(this.throwErrorMessage);
    }

    getCoachingFb(userId: String, activityId: String): Observable<Feedback> {
        return this.http.get(this.getCoachingFbUrl + "/" + userId + "/" + activityId, this.jwt())
            .map(this.extractData).catch(this.throwErrorMessage);
    }

    getCapabFb(userId: String, activityId: String): Observable<Feedback> {
        return this.http.get(this.getCapabFbUrl + "/" + userId + "/" + activityId, this.jwt())
            .map(this.extractData).catch(this.throwErrorMessage);
    }

    getTrainingFb(obj: TrainingTx): Observable<Feedback> {
        return this.http.post(this.getTrainingFbUrl, JSON.stringify(obj), this.jwt())
            .map(this.extractData).catch(this.throwErrorMessage);
    }

    createUserFb(obj: FeedbackCollection): Observable<Feedback> {
        return this.http.post(this.createUserFbUrl, JSON.stringify(obj), this.jwt())
            .map(this.extractData).catch(this.throwErrorMessage);
    }

    getFeedbackStatus(coachingId: String, activityId: String, userId: String): Observable<boolean> {
        return this.http.get(this.getFeedbackStatusUrl + "/" + coachingId + "/" + activityId + "/" + userId, this.jwt())
            .map(
            data => {
                console.log(data["_body"]);
                return data["_body"];
            }
            ).catch(this.handleError);
    }

    getFeedbackTrax(obj: UserFeedbackTrax): Observable<UserFeedback> {
        return this.http.post(this.getFeedbackUrl, JSON.stringify(obj), this.jwt())
            .map(this.extractData).catch(this.throwErrorMessage);
    }

    private handleError(error: Response | any) {
        console.error(error.message || error);
        return Observable.throw(error.status);
    }

    private throwErrorMessage(error: Response | any) {
        console.error(error.message || error);
        return Observable.throw(JSON.parse(error._body).errorMessage);
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
