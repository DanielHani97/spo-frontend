import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  AfterViewInit,
  ViewChildren, QueryList
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ScriptLoaderService } from "../_services/script-loader.service";
import { AuthenticationService } from "./_services/authentication.service";
import { AlertService } from "./_services/alert.service";
import { UserService } from "./_services/user.service";
import { AlertComponent } from "./_directives/alert.component";
import { LoginCustom } from "./_helpers/login-custom";
import { Helpers } from "../helpers";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../model/user';
import { Agency } from '../model/setup/agency';
import { Company } from '../model/setup/company';

import { AgencyService } from '../services/setup/agency.service';

declare var $: any;
@Component({
    selector: ".m-grid.m-grid--hor.m-grid--root.m-page",
    templateUrl: './templates/login-1.component.html',
    encapsulation: ViewEncapsulation.None
})

export class AuthComponent implements OnInit, AfterViewInit {
    model: any = {};
    loading = false;
    returnUrl: string;

    agencyLs : any[];
    currentAgency: any;
    agency : Agency;

    isNotValid : boolean;

    isGov: boolean = true;
    roles : any;

    @ViewChild('alertSignin', { read: ViewContainerRef }) alertSignin: ViewContainerRef;
    @ViewChild('alertSignup', { read: ViewContainerRef }) alertSignup: ViewContainerRef;
    @ViewChild('alertForgotPass', { read: ViewContainerRef }) alertForgotPass: ViewContainerRef;
    @ViewChildren('agency') agencyid: QueryList<any>;

    constructor(private _router: Router,
        private _script: ScriptLoaderService,
        private _userService: UserService,
        private _route: ActivatedRoute,
        private _authService: AuthenticationService,
        private _alertService: AlertService,
        private cfr: ComponentFactoryResolver,
        private _agencyService: AgencyService) {
          this.isNotValid = false;
    }

    ngOnInit() {
        this.model.remember = true;
        this.model.type = true;
        // get return url from route parameters or default to '/'
        // this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
        // this._router.navigate([this.returnUrl]);

        this._script.load('body', 'assets/vendors/base/vendors.bundle.js',
        'assets/demo/default/base/scripts.bundle.js')
            .then(() => {
                Helpers.setLoading(false);
                LoginCustom.init();
            });

        


    }

    ngAfterViewInit() {

      this.agencyid.changes.subscribe(t => {
          this.ngForRendred();
      })
    }

    ngForRendred() {
      $(".m_selectpicker").selectpicker('refresh');
    }

    register(){
      $(".m_selectpicker").selectpicker();

        this._agencyService.getAgency().subscribe(
          success => {
            this.agencyLs = success;
          }
        );

        $(document).on('click', '.cbAnswer', (e) => {
          var radio = this.model.type;
          if(radio){
            this.isGov = false;
          }else{
            this.isGov = true;
          }

        });
    }

    signin() {
        this.loading = true;
        this._authService.login(this.model.username, this.model.password)
            .subscribe(
            success => {
                var token = this._authService.getJwtToken();
                this._authService.getUserDetail(token).subscribe(
                  res => {
                    this._authService.setCurrentUser(res);
                    localStorage.setItem('currentName', res.name);

                    this.roles = res.authorities;

                    var isAdmin = this.roles.findIndex(i => {
                      if(i.authority === 'ROLE_ADMIN' || i.authority === 'ROLE_SUPERVISOR'){
                        return true;
                      }return false;

                    });

                    if (isAdmin > -1) {//exist
                      this._router.navigate(['/index']);
                    }else{
                      this._router.navigate(['/indexUser']);
                    }

                  }
                );
            },
            error => {
                this.showAlert('alertSignin');
                this._alertService.error("Nama Pengguna / Kata Laluan tidak sah");
                this.loading = false;
            });
    }

    signup() {

        //console.log(this.agency);
        var isGov = this.model.type;
        var isValid = false;
        var type = "";
        var txtMessage = "Terima Kasih. Untuk melengkapkan pendaftaran anda, sila periksa emel anda.";

        if(isGov){
          type = "GOV"
          if(typeof this.agency !== "undefined"){
            isValid = true;
          }
        }else{
          txtMessage = "Terima Kasih. Sila hubungi pentadbir sistem untuk proses permohonan ini."
          type = "PRIVATE"
          isValid = true;
        }

        if(isValid){
          this.loading = true;
          this.isNotValid = false;

          let company: Company = new Company(
            null,
            this.model.company,
            null,
            null,
            null,
            null,
            null
          );

          let user : User = new User(
            null,
            this.model.username,
            this.model.name,
            this.model.email,
            null,
            null,//password
            null,
            null,
            null,
            null,
            this.agency,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            type,
            company
          );

          this._authService.signup(user).subscribe(
            data => {
                  this.showAlert('alertSignin');
                  this._alertService.success(txtMessage, true);
                  this.loading = false;
                  LoginCustom.displaySignInForm();
                  this.model = {};
            },
            error => {
                  this.showAlert('alertSignup');
                  this._alertService.error(error);
                  this.loading = false;
            }
          );
        }else{
          this.isNotValid = true;
        }

    }

    forgotPass() {
        this.loading = true;

        let user : User = new User(
          null,
          null,
          null,
          this.model.email,
          null,
          null,//password
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null
        );

        this._authService.resetPassword(user)
            .subscribe(
            data => {
                this.showAlert('alertSignin');
                this._alertService.success('Terima Kasih. Kata laluan yang baru telah dihantar kepada emel anda.', true);
                this.loading = false;
                LoginCustom.displaySignInForm();
                this.model = {};
            },
            error => {
                this.showAlert('alertForgotPass');
                this._alertService.error(error);
                this.loading = false;
            });
    }

    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }

    setSBAgency(id: any): void {
      // Match the selected ID with the ID's in array
      this.currentAgency= this.agencyLs.filter(value => value.id === id);
      this.agency = this.currentAgency[0];

    }
}
