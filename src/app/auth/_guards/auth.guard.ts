import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { UserService } from "../_services/user.service";
import { Observable } from "rxjs/Rx";
import { AuthenticationService } from "../_services/authentication.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
      private _router: Router,
      private _userService: UserService,
      private _authService: AuthenticationService,) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        let token = this._authService.getJwtToken();
        let currentUser = JSON.parse(this._authService.getCurrentUser());

        if(token !== null && currentUser !==null){

          var status = this._authService.isTokenExpired(token);

          if(status == true){
            this._router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            return false;
          }

          return true;
        }else{
          this._router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
          return false;
        }
    }
}
