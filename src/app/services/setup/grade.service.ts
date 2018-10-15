import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import { Grade } from '../../model/setup/grade';
import { environment } from "../../../environments/environment"

@Injectable()
export class GradeService {

  //URL for CRUD operations
    //URL for CRUD operations
  TOKEN_KEY = "jwtToken";
  hostname = environment.hostname;

  allUrl = this.hostname+"/api/grade";
  createUrl = this.hostname+"/api/grade/create";
  getGradeUrl = this.hostname+"/api/grade/all";
  deleteUrl = this.hostname+"/api/grade/delete";
   globalUrl = this.hostname+"/api/grade/edit";
   countUrl = this.hostname+"/api/grade/count"
  constructor(private http:Http) { }

  getGrade(): Observable<Grade[]> {
    return this.http.get(this.getGradeUrl, this.jwt())
    .map(this.extractData)
    .catch(this.handleError);
    //let url = this.hostname+"/api/grade/all";
    //return this.http.get(url);
  }

  getGradeCn(): Observable<Grade[]>{
    return this.http.get(this.countUrl, this.jwt())
    .map(this.extractData)
    .catch(this.handleError);
  }



  //Create grades
  createGrades(grade: Grade):Observable<Grade> {

    return this.http.post(this.createUrl, JSON.stringify(grade), this.jwt())
    .map(success => success.status).catch(this.handleError);
  }

  getGradeById(gradeId: string): Observable<Grade> {
     return this.http.get(this.globalUrl+"/"+gradeId, this.jwt())
    .map(this.extractData)
     .catch(this.handleError);
  }

   updateGrade(grade: Grade):Observable<Grade> {

     return this.http.put(this.globalUrl +"/"+ grade.id, JSON.stringify(grade), this.jwt())
             .map(success => success.status)
             .catch(this.handleError);
  }

  deleteGradeById(gradeId: string): Observable<number> {

    return this.http.delete(this.deleteUrl +"/"+ gradeId, this.jwt())
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
