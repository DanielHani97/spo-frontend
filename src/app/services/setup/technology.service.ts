import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import { Technology } from '../../model/setup/technology';
import { environment } from "../../../environments/environment"

@Injectable()
export class TechnologyService {

  //URL for CRUD operations
  TOKEN_KEY = "jwtToken";
  hostname = environment.hostname;

  //URL for CRUD operations
  createUrl = this.hostname+"/api/technology/create";
  globalUrl = this.hostname+"/api/technology/edit";
  deleteUrl = this.hostname+"/api/technology/delete";
  urlTech = this.hostname+"/api/teknologi/senarai";

  constructor(private http:Http) { }

  getTechnology(): Observable<Technology[]> {
    let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
     let options = new RequestOptions({ headers: cpHeaders });
     return this.http.get(this.urlTech, this.jwt())
    .map(this.extractData)
     .catch(this.handleError);
  }

  //Create
  createTechnology(technology: Technology):Observable<Technology> {
    let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: cpHeaders });
    return this.http.post(this.createUrl, technology, this.jwt())
    .map(success => success.status).catch(this.handleError);
  }

  getTechnologyById(technologyId: string): Observable<Technology> {
    let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
     let options = new RequestOptions({ headers: cpHeaders });
     return this.http.get(this.globalUrl +"/"+ technologyId, this.jwt())
    .map(this.extractData)
     .catch(this.handleError);
  }

  updateTechnology(technology: Technology):Observable<Technology> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
     return this.http.put(this.globalUrl +"/"+ technology.id, JSON.stringify(technology), this.jwt())
             .map(success => success.status)
             .catch(this.handleError);
  }

  deleteTechnologyById(technologyId: string): Observable<Technology> {
    let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: cpHeaders });
    return this.http.delete(this.deleteUrl +"/"+ technologyId, this.jwt())
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
