import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import { Capability } from '../../model/capability/capability';
import { User } from '../../model/user';
import { Technology } from '../../model/setup/technology';
import { CapabilityCoach } from '../../model/capability/capabilityCoach';
import { CapabilityUser } from '../../model/capability/capabilityUser';
import { CapabilityActivity } from '../../model/capability/capabilityActivity';

import { environment } from "../../../environments/environment"

@Injectable()
export class CapabilityService {

  //Jwt token
  TOKEN_KEY = "jwtToken";
  hostname = environment.hostname;

  //URL for Capability CRUD
  globalUrl = this.hostname+"/api/capability";
  editUrl = this.hostname+"/api/capability/edit";
  deleteUrl = this.hostname+"/api/capability/delete";

  //URL for CapabilityCoach CRUD
  coachUrl = this.hostname+"/api/capabilityCoach";
  editCoachUrl = this.hostname+"/api/capabilityCoach/edit";
  deleteCoachUrl = this.hostname+"/api/capabilityCoach/delete";

  //URL for CapabilityUser CRUD
  userUrl = this.hostname+"/api/capabilityUser";
  editUserUrl = this.hostname+"/api/capabilityUser/edit";
  deleteUserUrl = this.hostname+"/api/capabilityUser/delete";
  isExistUrl = this.hostname+"/api/capUser/isExist";

  //URL for CapabilityActivity CRUD
  actUrl = this.hostname+"/api/capabilityActivities";
  editActUrl = this.hostname+"/api/capabilityActivities/edit";
  deleteActUrl = this.hostname+"/api/capabilityActivities";
  reportUrl = this.hostname+"/api/capabilityActivity/report"

  //URL for Feedback
  getCapabActvFbUrl = this.hostname+"/api/capabilityActivities/list";
  getCapabRoleUrl = this.hostname+"/api/capability/role";

  constructor(private http:Http) { }


  //Create
  createCapability(capability: Capability):Observable<Capability> {
    return this.http.post(this.globalUrl+"/create", capability, this.jwt())
    .map(this.extractData)
    .catch(this.handleError);
  }

  createCoach(capabilityCoach: CapabilityCoach):Observable<CapabilityCoach>{
    return this.http.post(this.coachUrl+"/create", capabilityCoach, this.jwt())
    .map(success => success.status)
    .catch(this.handleError);
  }

  createUser(capabilityUser: CapabilityUser):Observable<CapabilityUser>{
    return this.http.post(this.userUrl+"/create", capabilityUser, this.jwt())
    .map(success => success.status)
    .catch(this.handleError);
  }

  createAct(capabilityAct: CapabilityActivity):Observable<CapabilityActivity>{
    return this.http.post(this.actUrl+"/create", capabilityAct, this.jwt())
    .map(success => success.status)
    .catch(this.handleError);
  }

  //Read
  getCapability(): Observable<Capability> {
    return this.http.get(this.globalUrl, this.jwt())
    .map(this.extractData)
    .catch(this.handleError);
  }

  getCapabilityById(capId: string): Observable<Capability> {
    return this.http.get(this.globalUrl +"/"+ capId, this.jwt())
    .map(this.extractData)
    .catch(this.handleError);
  }

  getCapabilityCoach(id: string): Observable<CapabilityCoach[]> {
    return this.http.get(this.coachUrl+"/"+id, this.jwt())
    .map(this.extractData)
    .catch(this.handleError);
  }

  getCapabilityUser(capId: string): Observable<CapabilityUser> {
    return this.http.get(this.userUrl +"/list/"+ capId, this.jwt())
    .map(this.extractData)
    .catch(this.handleError);
  }

  getCapUserById(id: string): Observable<CapabilityUser> {
    return this.http.get(this.userUrl +"/"+ id, this.jwt())
    .map(this.extractData)
    .catch(this.handleError);
  }

  getCapabilityAct(id: string): Observable<CapabilityActivity[]> {
    return this.http.get(this.actUrl+"/cap/"+id, this.jwt())
    .map(this.extractData)
    .catch(this.handleError);
  }

  getCapabilityActById(id: string): Observable<CapabilityActivity> {
    return this.http.get(this.actUrl +"/"+ id, this.jwt())
    .map(this.extractData)
    .catch(this.handleError);
  }

  getCapabilityReport(capId: string): Observable<CapabilityActivity[]> {
    return this.http.get(this.reportUrl+"/"+ capId, this.jwt())
    .map(this.extractData)
    .catch(this.handleError);
  }

  //Update
  updateCapability(capability: Capability):Observable<Capability> {
    return this.http.put(this.editUrl +"/"+ capability.id, JSON.stringify(capability), this.jwt())
    .map(success => success.status)
    .catch(this.handleError);
  }

  updateCapabilityUser(capabilityUser:CapabilityUser): Observable<CapabilityUser> {
    return this.http.put(this.editUserUrl +"/"+ capabilityUser.id, JSON.stringify(capabilityUser), this.jwt())
    .map(success=> success.status)
    .catch(this.handleError)
  }

  updateKeygen(capabilityAct:CapabilityActivity): Observable<CapabilityActivity> {
    return this.http.put(this.editActUrl +"/"+ capabilityAct.id, JSON.stringify(capabilityAct), this.jwt())
    .map(success=> success.status)
    .catch(this.handleError)
  }
  //Delete
  deleteCapabilityById(capId: string): Observable<Capability> {
    return this.http.delete(this.deleteUrl +"/"+ capId, this.jwt())
    .map(success => success.status)
    .catch(this.handleError);
  }

  deleteCapabilityAct(id: string): Observable<CapabilityActivity> {
   return this.http.delete(this.deleteActUrl +"/"+ id, this.jwt())
   .map(success => success.status)
   .catch(this.handleError);
   }

   deleteCapabilityCoach(id: string): Observable<CapabilityCoach> {
   return this.http.delete(this.deleteCoachUrl +"/"+ id, this.jwt())
   .map(success => success.status)
   .catch(this.handleError);
   }

   isExistCapabilityUser(capUser: CapabilityUser):Observable<CapabilityUser> {
      return this.http.post(this.isExistUrl, capUser, this.jwt())
      .map(success => success.status).catch(this.handleError);
    }

    getCapabActvFb(capabId: String):Observable<CapabilityActivity[]> {
      return this.http.get(this.getCapabActvFbUrl+"/"+capabId, this.jwt())
       .map(this.extractData)
      .catch(this.handleError);
    }

    getCapabilityRole(capabId: String, userId: String):Observable<string> {
      return this.http.get(this.getCapabRoleUrl+"/"+capabId+"/"+userId, this.jwt())
      .map(
        data =>{
          return data["_body"];
        }
      ).catch(this.handleError);
    }

  //Etc
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
        }
      );
      return new RequestOptions({ headers: headers });
    }
  }
}
