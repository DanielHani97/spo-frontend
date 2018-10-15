import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import { Project } from '../model/project';
import { environment } from "../../environments/environment"

@Injectable()
export class ProjectService {

  //URL for CRUD operations
  TOKEN_KEY = "jwtToken";
  hostname = environment.hostname;

  createUrl = this.hostname+"/api/project/create";
  globalUrl = this.hostname+"/api/project/edit";
  deleteUrl = this.hostname+"/api/project/delete";
  getProjectUrl = this.hostname+"/api/project/all"


  constructor(private http:Http) { }

  getProject(): Observable<Project[]> {

    return this.http.get(this.getProjectUrl, this.jwt())
    .map(this.extractData)
    .catch(this.handleError);
  }

  //Create projects
  createProjects(project: Project):Observable<Project> {

  return this.http.post(this.createUrl, JSON.stringify(project), this.jwt())
  .map(success => success.status).catch(this.handleError);
  }

   getProjectById(projectId: string): Observable<Project> {
     console.log(this.globalUrl +"/"+ projectId);
     return this.http.get(this.globalUrl +"/"+ projectId, this.jwt())
    .map(this.extractData)
     .catch(this.handleError);
  }


  updateProject(project: Project):Observable<Project> {
     return this.http.put(this.globalUrl +"/"+ project.id, JSON.stringify(project), this.jwt())
     .map(success => success.status)
     .catch(this.handleError);
  }

  deleteProjectByUserId(projectId: string): Observable<Project> {
    return this.http.delete(this.deleteUrl +"/"+ projectId, this.jwt())
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
