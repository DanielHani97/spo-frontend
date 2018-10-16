import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../helpers';
import { AuthenticationService } from "../../../auth/_services/authentication.service";

declare let mLayout: any;
@Component({
    selector: "app-aside-nav",
    templateUrl: "./aside-nav.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class AsideNavComponent implements OnInit, AfterViewInit {

    isAdmin: boolean;
    isCoach: boolean;
    isUser: boolean;
    isSupervisor: boolean;

    roles: any;

    mode: string;

    constructor(private _authService: AuthenticationService) {

    }
    ngOnInit() {
        let currentUser = JSON.parse(this._authService.getCurrentUser());
        this.roles = currentUser.authorities;

        for (let role of this.roles) {
            var authz = role.authority;
            if (authz == 'ROLE_ADMIN') {
                this.isAdmin = true;
            } else if (authz == 'ROLE_SUPERVISOR') {
                this.isSupervisor = true;
            } else if (authz == 'ROLE_COACH') {
                this.isCoach = true;
            } else if (authz == 'ROLE_USER') {
                this.isUser = true;
            }
        }

        var currRole = localStorage.getItem("CURRENT_ROLE");

        if (currRole) {
            this.mode = localStorage.getItem("CURRENT_ROLE");
        } else {
            if (this.isAdmin == true) {
                this.mode = "ADMIN";
            } else if (this.isSupervisor == true) {
                this.mode = "SUPERVISOR";
            } else if (this.isCoach == true) {
                this.mode = "COACH";
            } else if (this.isUser == true) {
                this.mode = "USER";
            }
        }
    }
    ngAfterViewInit() {

        mLayout.initAside();
        let menu = (<any>$('#m_aside_left')).mMenu();
        let item = $(menu).find('a[href="' + window.location.pathname + '"]').parent('.m-menu__item');
        (<any>$(menu).data('menu')).setActiveItem(item);
    }

}
