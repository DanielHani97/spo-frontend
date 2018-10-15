import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import { Infrastructure } from '../../model/infrastructure/infrastructure';
import { Technology } from '../../model/setup/technology';
import { environment } from "../../../environments/environment"

@Injectable()
export class InfrastructureService {

  //URL for CRUD operations
  TOKEN_KEY = "jwtToken";
  hostname = environment.hostname;

  //URL for CRUD operations
  updateURL = this.hostname+"/api/infrastructure/edit2";
  urlTech = this.hostname+"/api/technology/list";
  urlTech2 = this.hostname+"/api/technology2/list";
  urlTech3 = this.hostname+"/api/technology3/list";
  createUrl = this.hostname+"/api/infrastructure/create";
  globalUrl = this.hostname+"/api/infrastructure/edit";
  deleteUrl = this.hostname+"/api/infrastructure/delete";

  constructor(private http:Http) { }

  getInfrastructure() {
    let url = "http://localhost:8080/api/infrastructure/all";
    return this.http.get(url, this.jwt());
  }

  //Create infrastructure
  createInfrastructure(infrastructure: Infrastructure):Observable<Infrastructure> {
    let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: cpHeaders });
    return this.http.post(this.createUrl,  infrastructure, this.jwt())
    .map(success => success.status).catch(this.handleError);
  }

  getInfrastructureById(infrastructureId: string): Observable<Infrastructure> {
    let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
     let options = new RequestOptions({ headers: cpHeaders });
     return this.http.get(this.globalUrl +"/"+ infrastructureId, this.jwt())
    .map(this.extractData)
     .catch(this.handleError);
  }

  updateInfrastructure(infrastructure: Infrastructure):Observable<Infrastructure> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
     return this.http.put(this.globalUrl +"/"+ infrastructure.id, JSON.stringify(infrastructure), this.jwt())
             .map(success => success.status)
             .catch(this.handleError);
  }

  updateInfra(infrastructure: Infrastructure):Observable<Infrastructure> {
     return this.http.put(this.updateURL +"/"+ infrastructure.id, JSON.stringify(infrastructure), this.jwt())
             .map(success => success.status)
             .catch(this.handleError);
  }

  deleteInfrastructureById(infrastructureId: string): Observable<Infrastructure> {
    let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: cpHeaders });
    return this.http.delete(this.deleteUrl +"/"+ infrastructureId, this.jwt())
     .map(success => success.status)
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
