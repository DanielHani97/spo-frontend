import { Injectable } from "@angular/core";
import { Http, Response,Headers, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";
import { Observable } from 'rxjs';

import {User} from "../../model/user";
import { environment } from "../../../environments/environment"

@Injectable()
export class AuthenticationService {

    hostname = environment.hostname;

    url = this.hostname+"/auth/login";
    urlUser = this.hostname+"/auth/user";
    urlSignUp = this.hostname+"/auth/signup";
    urlReset = this.hostname+"/auth/resetPassword";
    urlRefresh = this.hostname+"/auth/refresh";
    TOKEN_KEY = "jwtToken";

    constructor(private http: Http) {
    }

    login(username: string, password: string){
    	let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: cpHeaders });
      return this.http.post(this.url, JSON.stringify({ username: username, password: password }), options)
      .map(
        success => {
          var token = JSON.parse(success['_body']).token;
          this.setJwtToken(token);

          return success.status;
        }
      ).catch(this.handleError);
    }

    refresh(token){
      console.log("lama:"+token);
      let cpHeaders = new Headers(
      {
        'Content-Type': 'application/json',
        "Authorization": "Bearer " + token
        //'Access-Control-Allow-Credentials' : true
      });
      let options = new RequestOptions({ headers: cpHeaders });
      return this.http.get(this.urlRefresh, options)
      .map(
        success => {
          var token = JSON.parse(success['_body']).token;
          this.setJwtToken(token);

          console.log("baru:"+token);

          return success.status;
        }
      ).catch(this.handleError);
    }

    signup(user: User):Observable<User> {
    	let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: cpHeaders });
      return this.http.post(this.urlSignUp, JSON.stringify(user), options)
      .map(success => success.status)
      .catch(
        this.throwErrorMessage
      );
    }

    resetPassword(user: User){
      let cpHeaders = new Headers(
      {
        'Content-Type': 'application/json'
        //'Access-Control-Allow-Credentials' : true
      });
     	let options = new RequestOptions({ headers: cpHeaders });
     	return this.http.post(this.urlReset, JSON.stringify(user), options)
      .map(this.extractData)
   	  .catch(this.throwErrorMessage);
    }

    getUserDetail(token){
      let cpHeaders = new Headers(
      {
        'Content-Type': 'application/json',
        "Authorization": "Bearer " + token
        //'Access-Control-Allow-Credentials' : true
      });
     	let options = new RequestOptions({ headers: cpHeaders });
     	return this.http.get(this.urlUser, options)
      .map(this.extractData)
   	  .catch(this.handleError);
    }

    logout() {
        // remove user from local storage to log user out
        this.removeCurrentUser();
        this.removeJwtToken();
        localStorage.clear();
    }

    isAdmin(token){
      let cpHeaders = new Headers(
      {
        'Content-Type': 'application/json',
        "Authorization": "Bearer " + token
        //'Access-Control-Allow-Credentials' : true
      });
     	let options = new RequestOptions({ headers: cpHeaders });
     	return this.http.get(this.urlUser, options)
      .map(
        res => {
          let body = res.json();

          var status = false;
          var isAdmin = body.authorities.findIndex(i => {
            if(i.authority === 'ROLE_ADMIN'){
              status = true;
            }
          });
          return status;
        }
      )
   	  .catch(this.handleError);
    }

    isCoach(token){
      let cpHeaders = new Headers(
      {
        'Content-Type': 'application/json',
        "Authorization": "Bearer " + token
        //'Access-Control-Allow-Credentials' : true
      });
     	let options = new RequestOptions({ headers: cpHeaders });
     	return this.http.get(this.urlUser, options)
      .map(
        res => {
          let body = res.json();

          var status = false;
          var isCoach = body.authorities.findIndex(i => {
            if(i.authority === 'ROLE_COACH'){
              status = true;
            }
          });
          return status;
        }
      )
   	  .catch(this.handleError);
    }

    private handleError (error: Response | any) {
      console.error(error.message || error);
      return Observable.throw(error.status);
   }

   private throwErrorMessage (error: Response | any) {
     console.error(error.message || error);
     return Observable.throw(JSON.parse(error._body).errorMessage);
  }

   private extractData(res: Response) {
     let body = res.json();
         return body;
   }

   createAuthorizationTokenHeader() {
        var token = this.getJwtToken();
        if (token) {
            return {"Authorization": "Bearer " + token};
        } else {
            return {};
        }
    }

    getJwtToken() {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    setJwtToken(token) {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    removeJwtToken() {
        localStorage.removeItem(this.TOKEN_KEY);
    }

    setCurrentUser(user:User){
      localStorage.setItem('currentUser', JSON.stringify(user));
    }

    getCurrentUser(){
        return localStorage.getItem('currentUser');
    }

    removeCurrentUser() {
        localStorage.removeItem('currentUser');
    }

    public decodeExpToken(token: string): any {
      if(token===null) {
        return null;
      }

      let parts = token.split('.');

      if (parts.length !== 3) {
        throw new Error('The inspected token doesn\'t appear to be a JWT. Check to make sure it has three parts and see https://jwt.io for more.');
      }

      var splitToken = token.split('.')[1];
      var base64 = splitToken.replace('-', '+').replace('_', '/');
      var decoded = JSON.parse(window.atob(base64))

      if (!window.atob(base64)) {
        throw new Error('Cannot decode the token.');
      }

      return decoded;
  }

  public getTokenExpirationDate(token: string): Date | null {
      let decoded: any;
      decoded = this.decodeExpToken(token);

      if (!decoded.hasOwnProperty('exp')) {
        return null;
      }

      const date = new Date(0);
      date.setUTCSeconds(decoded.exp);

      return date;
  }

  public isTokenExpired(token: string, offsetSeconds?: number): boolean {
      if (token === null || token === '') {
          return true;
      }
      let date = this.getTokenExpirationDate(token);
      offsetSeconds = offsetSeconds || 0;

      if (date === null) {
        return true;
      }

      return !(date.valueOf() > new Date().valueOf() + offsetSeconds * 1000);
  }

}
