import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import { Keygen } from '../model/keygen';
import { environment } from "../../environments/environment"

@Injectable()
export class KeygenService {

  //URL for CRUD operations
  TOKEN_KEY = "jwtToken";
  hostname = environment.hostname;

  createUrl = this.hostname+"/api/keygen/create";
  globalUrl = this.hostname+"/api/keygen";
  deleteUrl = this.hostname+"/api/keygen/delete";
  getKeygenUrl = this.hostname+"/api/keygen/all"
  
  constructor(private http:Http) { }

  getKeygen(): Observable<Keygen[]> {
    return this.http.get(this.getKeygenUrl, this.jwt())
    .map(this.extractData)
    .catch(this.handleError);
  }

  createKeygen(keygen: Keygen):Observable<Keygen> {
    return this.http.post(this.createUrl, JSON.stringify(keygen), this.jwt())
    .map(success => success.status)
    .catch(this.handleError);
  }

  getKeygenByInstanceId(instanceId: string): Observable<Keygen> {
    return this.http.get(this.globalUrl +"/getInstance/"+ instanceId, this.jwt())
    .map(this.extractData)
    .catch(this.handleError);
  }

  isExist(instance: string): Observable<Boolean>{
    return this.http.get(this.globalUrl +"/instance/"+ instance, this.jwt())
    .map(this.extractData)
    .catch(this.handleError);
  }

  deleteKeygenById(keygenId: string): Observable<Keygen> {

    return this.http.delete(this.deleteUrl +"/"+ keygenId, this.jwt())
     .map(success => success.status)
     .catch(this.handleError);
   }

   private handleError (error: Response | any) {
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
