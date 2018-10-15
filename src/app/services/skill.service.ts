import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import { Skill } from '../model/skill';
import { environment } from "../../environments/environment"

@Injectable()
export class SkillService {

  //URL for CRUD operations
  TOKEN_KEY = "jwtToken";
  hostname = environment.hostname;

  createUrl = this.hostname+"/api/skill/create";
  globalUrl = this.hostname+"/api/skill/edit";
  deleteUrl = this.hostname+"/api/skill/delete";
  getSkillUrl = this.hostname+"/api/skill/all"
  
  constructor(private http:Http) { }

  getSkill(): Observable<Skill[]> {

    console.log(this.getSkillUrl)
    return this.http.get(this.getSkillUrl, this.jwt())
    .map(this.extractData)
    .catch(this.handleError);
  }

  //Create users
  createSkills(skill: Skill[]):Observable<Skill> {

    return this.http.post(this.createUrl, JSON.stringify(skill), this.jwt())
    .map(success => success.status).catch(this.handleError);
  }

   getSkillById(skillId: string): Observable<Skill> {

     console.log(this.globalUrl +"/"+ skillId);
     return this.http.get(this.globalUrl +"/"+ skillId, this.jwt())
    .map(this.extractData)
     .catch(this.handleError);
  }


  updateSkill(skill: Skill):Observable<Skill> {

     return this.http.put(this.globalUrl +"/"+ skill.id, JSON.stringify(skill), this.jwt())
             .map(success => success.status)
             .catch(this.handleError);
  }

  deleteSkillById(skillId: string): Observable<Skill> {

    return this.http.delete(this.deleteUrl +"/"+ skillId, this.jwt())
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
