import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import { User } from '../model/user';
import { environment } from "../../environments/environment"

@Injectable()
export class UserService {

    //URL for CRUD operations
    TOKEN_KEY = "jwtToken";
    hostname = environment.hostname;

    createUrl = this.hostname + "/api/user/create";
    globalUrl = this.hostname + "/api/user/edit";
    deleteUrl = this.hostname + "/api/user/delete";
    geturl = this.hostname + "/api/user/getall";
    userUrl = this.hostname + "/api/user";
    upProfileUrl = this.hostname + "/api/user/edit/profile";
    upAgencyUrl = this.hostname + "/api/user/edit/agency";
    upProjectUrl = this.hostname + "/api/user/edit/project";
    upSettingUrl = this.hostname + "/api/user/edit/setting";
    updatePictureUrl = this.hostname + "/api/user/edit/picture";
    updateAllUrl = this.hostname + "/api/user/edit/all";
    updateStatusUrl = this.hostname + "/api/user/update/status";
    appUrl = this.hostname + "/api/user/application"
    updateCertFileUrl = this.hostname + "/api/user/update/certificate";
    countUserUrl = this.hostname + "/api/user/count";


    constructor(private http: Http) { }

    getUsers(): Observable<User[]> {
        return this.http.get(this.geturl, this.jwt())
            .map(this.extractData)
            .catch(this.handleError);
    }

    //Create users
    createUsers(user: User): Observable<User> {

        return this.http.post(this.createUrl, user, this.jwt())
            .map(success => success.status).catch(this.handleError);
    }

    getUserById(userId: string): Observable<User> {
        return this.http.get(this.globalUrl + "/" + userId, this.jwt())
            .map(this.extractData)
            .catch(this.handleError);
    }


    updateUserProfile(user: User): Observable<User> {
        return this.http.put(this.upProfileUrl + "/" + user.id, JSON.stringify(user), this.jwt())
            .map(success => success.status)
            .catch(this.handleError);
    }

    updateUserAgency(user: User): Observable<User> {
        return this.http.put(this.upAgencyUrl + "/" + user.id, JSON.stringify(user), this.jwt())
            .map(success => success.status)
            .catch(this.handleError);
    }

    // updateUserSkill(user: User):Observable<User> {

    //    return this.http.put(this.globalUrl +"/"+ user.id, JSON.stringify(user), this.jwt())
    //            .map(success => success.status)
    //            .catch(this.handleError);
    // }

    updateUserProject(user: User): Observable<User> {
        return this.http.put(this.upProjectUrl + "/" + user.id, JSON.stringify(user), this.jwt())
            .map(success => success.status)
            .catch(this.handleError);
    }

    // updateUserCert(user: User):Observable<User> {

    //    return this.http.put(this.globalUrl +"/"+ user.id, JSON.stringify(user), this.jwt())
    //            .map(success => success.status)
    //            .catch(this.handleError);
    // }

    updateUserSetting(user: User): Observable<User> {
        return this.http.put(this.upSettingUrl + "/" + user.id, JSON.stringify(user), this.jwt())
            .map(success => success.status)
            .catch(this.handleError);
    }

    deleteUserById(userId: string): Observable<User> {
        return this.http.delete(this.deleteUrl + "/" + userId, this.jwt())
            .map(success => success.status)
            .catch(this.handleError);
    }

    updateProfilePicture(data: any): Observable<User> {
        return this.http.post(this.updatePictureUrl, data, this.jwtFile())
            .map(success => success.status)
            .catch(this.handleError);
    }

    updateUser(user: User): Observable<User> {
        return this.http.put(this.updateAllUrl + "/" + user.id, JSON.stringify(user), this.jwt())
            .map(success => success.status)
            .catch(this.handleError);
    }

    updateStatusUser(userId: string): Observable<User> {
        return this.http.get(this.updateStatusUrl + "/" + userId, this.jwt())
            .map(success => success.status)
            .catch(this.handleError);
    }

    updateCertFile(data: any): Observable<User> {
        return this.http.post(this.updateCertFileUrl, data, this.jwtFile())
            .map(success => success.status)
            .catch(this.handleError);
    }

    countUser(): Observable<number> {
        return this.http.get(this.countUserUrl, this.jwt())
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
