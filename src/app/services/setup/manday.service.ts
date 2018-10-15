import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import { Manday } from '../../model/setup/manday';
import { MandayTransaction } from '../../model/setup/mandayTransaction';
import { environment } from "../../../environments/environment"

@Injectable()
export class MandayService{

TOKEN_KEY = "jwtToken";
hostname = environment.hostname;

createUrl =  this.hostname+"/api/manday/create/";
globalUrl = this.hostname+"/api/manday/edit/";
getMandayUrl = this.hostname+"/api/manday/all";
mandayUsedUrl = this.hostname+"/api/mandayUsed/edit/";
createTxUrl =  this.hostname+"/api/mandayTrans/create/";
editTxUrl = this.hostname+"/api/mandayTrans/edit/";
getTxUrl = this.hostname+"/api/mandayTrans/all";
mandayReservedURL = this.hostname+"/api/manday/updateReserved/";
getTrain = this.hostname+"/api/mandayTrans/getTrain";
getCapab = this.hostname+"/api/mandayTrans/getCapab";
getCoach = this.hostname+"/api/mandayTrans/getCoach";
getCert = this.hostname+"/api/mandayTrans/getCert";
updateCoachingTx = this.hostname+"/api/mandayTrans/coachingEdit";

constructor(private http:Http){}

  updateCoachingManday(id: string):Observable<MandayTransaction> {
   return this.http.get(this.updateCoachingTx +"/"+ id, this.jwt())
   .map(success => success.status)
   .catch(this.handleError);
  }

  getManday(): Observable<Manday[]>{
    console.log(this.getMandayUrl)
    return this.http.get(this.getMandayUrl, this.jwt())
    .map(this.extractData)
    .catch(this.handleError);
  }

  getMandayTransTrain(): Observable<MandayTransaction[]>{
    return this.http.get(this.getTrain, this.jwt())
    .map(this.extractData)
    .catch(this.handleError);
  }

  getMandayTransCap(): Observable<MandayTransaction[]>{
    return this.http.get(this.getCapab, this.jwt())
    .map(this.extractData)
    .catch(this.handleError);
  }

  getMandayTransCoach(): Observable<MandayTransaction[]>{
    return this.http.get(this.getCoach, this.jwt())
    .map(this.extractData)
    .catch(this.handleError);
  }

  getMandayTransCert(): Observable<MandayTransaction[]>{
    return this.http.get(this.getCert, this.jwt())
    .map(this.extractData)
    .catch(this.handleError);
  }

  getMandayTrans(): Observable<MandayTransaction[]>{
    console.log(this.getTxUrl)
    return this.http.get(this.getTxUrl, this.jwt())
    .map(this.extractData)
    .catch(this.handleError);
  }

//Create grades
  createMandays(manday: any[]):Observable<Manday> {

    return this.http.post(this.createUrl, JSON.stringify(manday), this.jwt())
    .map(success => success.status).catch(this.handleError);
  }

  getMandayById(mandayId: string): Observable<Manday> {

   return this.http.get(this.globalUrl+"/"+mandayId, this.jwt())
   .map(this.extractData).catch(this.handleError);
  }

  updateManday(manday: any[]):Observable<Manday> {

     return this.http.post(this.globalUrl, JSON.stringify(manday), this.jwt())
             .map(success => success.status)
             .catch(this.handleError);
  }

  updateMandayUsed(manday: Manday):Observable<Manday> {

     return this.http.put(this.mandayUsedUrl +manday.id,manday, this.jwt())
             .map(success => success.status)
             .catch(this.handleError);
  }

  updateMandayReserved(manday: Manday):Observable<Manday>{
      return this.http.put(this.mandayReservedURL +manday.id, manday, this.jwt())
      .map(success => success.status)
      .catch(this.handleError);
  }

  ////////////////////////////////////// MANDAY TX \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  createMandayTrans(mandayTransaction: any):Observable<MandayTransaction> {

    return this.http.post(this.createTxUrl, JSON.stringify(mandayTransaction), this.jwt())
    .map(success => success.status).catch(this.handleError);
  }

  getMandayTransactionById(mandayTransactionId: string): Observable<MandayTransaction> {

   return this.http.get(this.editTxUrl+"/"+mandayTransactionId, this.jwt())
   .map(this.extractData).catch(this.handleError);
  }

  updateMandayTrans(mandayTransaction: any):Observable<MandayTransaction> {

     return this.http.post(this.editTxUrl, JSON.stringify(mandayTransaction), this.jwt())
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
