import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import { Assesment } from '../../model/assesment/assesment';
import { AssesmentQuestion } from '../../model/assesment/assesmentQuestion';
import { environment } from "../../../environments/environment"
import { UserAssesmentTrax } from '../../model/assesment/userAssesmentTrax';
import { AssesmentCollection } from '../../model/assesment/assesmentCollection';
import { Coaching } from '../../model/coaching/coaching';

@Injectable()
export class AssesmentService {

  //URL for CRUD operations
  TOKEN_KEY = "jwtToken";
  hostname = environment.hostname;

  listUrl = this.hostname+"/api/asses/list";
  createUrl = this.hostname+"/api/asses/create";
  editUrl = this.hostname+"/api/asses/edit";
  deleteUrl = this.hostname+"/api/asses/delete";

  createQueUrl = this.hostname+"/api/asses/que/create";
  editQueUrl = this.hostname+"/api/asses/que/edit";
  deleteQueUrl = this.hostname+"/api/asses/que/delete";
  listQueUrl = this.hostname+"/api/asses/que/list";

  genQueUrl = this.hostname+"/api/asses/generate/question";
  createUserAsses = this.hostname+"/api/asses/user/create";
  createHistory = this.hostname+"/api/asses/history/question/create";

  updateStatusUrl = this.hostname+"/api/asses/update/status";
  saveUserAsses = this.hostname+"/api/asses/user/save";
  taskUrl = this.hostname+"/api/asses/task/coaching"

  constructor(private http:Http) { }

  createAssesment(obj: Assesment):Observable<Assesment> {
    return this.http.post(this.createUrl, JSON.stringify(obj), this.jwt())
    .map(this.extractData).catch(this.throwErrorMessage);
  }

  getAssesmentById(id: string): Observable<Assesment> {
   	return this.http.get(this.editUrl +"/"+ id, this.jwt())
    .map(this.extractData)
 	  .catch(this.handleError);
  }

  updateAssesment(obj: Assesment):Observable<Assesment> {
     return this.http.put(this.editUrl +"/"+ obj.id, JSON.stringify(obj), this.jwt())
            .map(success => success.status)
             .catch(this.throwErrorMessage);
  }

  deleteAssesmentById(id: string): Observable<number> {
    return this.http.delete(this.deleteUrl +"/"+ id, this.jwt())
	   .map(success => success.status)
	   .catch(this.handleError);
   }

   createQue(obj: AssesmentQuestion):Observable<AssesmentQuestion> {
     return this.http.post(this.createQueUrl, JSON.stringify(obj), this.jwt())
     .map(success => success.status).catch(this.handleError);
   }

   getQueById(id: string): Observable<AssesmentQuestion> {
    	return this.http.get(this.editQueUrl +"/"+ id, this.jwt())
     .map(this.extractData)
  	  .catch(this.handleError);
   }

   updateQue(obj: AssesmentQuestion):Observable<AssesmentQuestion> {
      return this.http.put(this.editQueUrl +"/"+ obj.id, JSON.stringify(obj), this.jwt())
              .map(success => success.status)
              .catch(this.handleError);
   }

   deleteQueById(id: string): Observable<number> {
     return this.http.delete(this.deleteQueUrl +"/"+ id, this.jwt())
 	   .map(success => success.status)
 	   .catch(this.handleError);
    }

    generateQue(obj: Assesment[]):Observable<Assesment> {
      return this.http.post(this.genQueUrl, JSON.stringify(obj), this.jwt())
      .map(this.extractData).catch(this.handleError);
    }

    saveQue(obj: UserAssesmentTrax[]):Observable<UserAssesmentTrax> {
      return this.http.post(this.createUserAsses, JSON.stringify(obj), this.jwt())
      .map(this.extractData).catch(this.handleError);
    }

    historyCreate(obj: Assesment):Observable<Assesment> {
      return this.http.post(this.createHistory, JSON.stringify(obj), this.jwt())
      .map(success => success.status).catch(this.handleError);
    }

    updateStatusCoaching(id: string): Observable<Assesment> {
     	return this.http.get(this.updateStatusUrl +"/"+ id, this.jwt())
      .map(this.extractData)
   	  .catch(this.handleError);
    }

    saveAssesUser(data: AssesmentCollection):Observable<any> {
       return this.http.post(this.saveUserAsses, data, this.jwt())
               .map(this.extractData)
               .catch(this.handleError);
    }

    getTaskByUserid(id: string): Observable<Coaching[]> {
     	return this.http.get(this.taskUrl +"/"+ id, this.jwt())
      .map(this.extractData)
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
