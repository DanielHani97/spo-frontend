import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from "../_services/authentication.service";

@Injectable()
export class AdminGuard implements CanActivate  {

  constructor(
    private _authService: AuthenticationService,
    private router: Router) {
    }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAdmin();
  }

  checkAdmin():Observable<boolean> {
    var token = this._authService.getJwtToken();
     return this._authService.isAdmin(token).map(data=>{
          if(data){
            return true;
          }
          this.router.navigate(['error/403']);
          return false;
    });
  }
}
