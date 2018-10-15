import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import { Attendance } from '../../model/attendance/attendance';
import { User } from '../../model/user';
import { environment } from "../../../environments/environment"

@Injectable()
export class AttendanceService {

  //URL for CRUD operations

  TOKEN_KEY = "jwtToken";
  hostname = environment.hostname;

  createUrl = this.hostname+"/api/attendance/create";
  updateUrl = this.hostname+"/api/attendance/edit";
  attendURL = this.hostname+"/api/attendancegetall";
  existURL = this.hostname+"/api/attendance/exist";

  constructor(private http:Http) { }

  getAttendance() {
    return this.http.get(this.attendURL, this.jwt())
    .map(this.extractData)
    .catch(this.handleError);
  }

  // getAttendanceById(attendanceId: string): Observable<Attendance> {
    
  //    console.log(this.updateUrl +"/"+ attendanceId);
  //    return this.http.get(this.updateUrl +"/"+ attendanceId, this.jwt())
  //   .map(this.extractData)
  //    .catch(this.handleError);
  // }

  //Create attendance
  createAttendance(attendance: Attendance):Observable<Attendance> {
    return this.http.post(this.createUrl, attendance, this.jwt())
    .map(success => success.status).catch(this.handleError);
  }

  updateAttendance(attendance: Attendance):Observable<Attendance> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
     return this.http.put(this.updateUrl +"/"+ attendance.id, JSON.stringify(attendance), this.jwt())
             .map(success => success.status)
             .catch(this.handleError);
  }

  isExist(attendance: Attendance):Observable<Boolean> {
     return this.http.post(this.existURL +"/"+ attendance.instanceId, JSON.stringify(attendance), this.jwt())
     .map(success => success.status)
     .catch(this.handleError);
  }

  private extractData(res: Response) {
  let body = res.json();
        return body;
    }

   private handleError (error: Response | any) {
 	   console.error(error.message || error);
 	   return Observable.throw(error.status);
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
