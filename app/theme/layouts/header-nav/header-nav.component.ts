import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../helpers';
import { AuthenticationService } from "../../../auth/_services/authentication.service";
import { Router } from '@angular/router';

import { AssesmentService } from "../../../services/assesment/assesment.service";
import { environment } from "../../../../environments/environment";

declare let $: any;
declare let mLayout: any;
declare let jQuery: any;
@Component({
    selector: "app-header-nav",
    templateUrl: "./header-nav.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [AssesmentService]
})
export class HeaderNavComponent implements OnInit, AfterViewInit {

    name: string;
    roles: any;
    isExist: boolean = false;

    isAdmin: boolean;
    isCoach: boolean;
    isUser: boolean;
    isSupervisor: boolean;

    coachingLs: any;
    count: number;

    constructor(
        private _authService: AuthenticationService,
        private assesmentService: AssesmentService,
        private router: Router) {

    }

    ngOnInit() {
        let currentUser = JSON.parse(this._authService.getCurrentUser());
        this.name = localStorage.getItem('currentName');
        this.roles = currentUser.authorities;

        for (let role of this.roles) {
            var authz = role.authority;
            if (authz == 'ROLE_USER') {
                this.isUser = true;
            } if (authz == 'ROLE_ADMIN') {
                this.isAdmin = true;
            } if (authz == 'ROLE_COACH') {
                this.isCoach = true;
            } if (authz == 'ROLE_SUPERVISOR') {
                this.isSupervisor = true;
            }
        }

        this.assesmentService.getTaskByUserid(currentUser.id).subscribe(
            success => {
                this.coachingLs = success;
                this.count = success.length;
            }
        );

    }
    ngAfterViewInit() {

        mLayout.initHeader();
    }

    expiredSession() {
        var token = localStorage.getItem("jwtToken");
        var status = this._authService.isTokenExpired(token);

        if (status == true) {
            jQuery('#m_modal_add').modal('show');
        }
    }

    refreshSession() {
        var token = localStorage.getItem("jwtToken");
        this._authService.refresh(token).subscribe();
    }

    isIdle() {
        window.onload = this.resetTimer;
        // DOM Events
        document.onmousemove = this.resetTimer;
        document.onkeypress = this.resetTimer;
        document.onload = this.resetTimer;
        document.onmousedown = this.resetTimer; // touchscreen presses
        document.ontouchstart = this.resetTimer;
        document.onclick = this.resetTimer;     // touchpad clicks
        document.onscroll = this.resetTimer;    // scrolling with arrow keys
        document.onkeypress = this.resetTimer;
    }

    resetTimer() {
        var t;
        clearTimeout(t);
        t = setTimeout(function() {

            console.log("test")

        }, 3000);
    }

    logout() {
        this.router.navigate(['logout']);
    }

    admin() {
        localStorage.setItem("CURRENT_ROLE", "ADMIN")
        this.router.navigate(['index']).then(() => { window.location.reload(); });
    }

    coach() {
        localStorage.setItem("CURRENT_ROLE", "COACH")
        this.router.navigate(['indexUser']).then(() => { window.location.reload(); });
    }

    supervisor() {
        localStorage.setItem("CURRENT_ROLE", "SUPERVISOR")
        this.router.navigate(['index']).then(() => { window.location.reload(); });
    }

    user() {
        localStorage.setItem("CURRENT_ROLE", "USER")
        this.router.navigate(['indexUser']).then(() => { window.location.reload(); });
    }

    goToAssesment(id) {
        localStorage.setItem("ASSESMODE", "COACHING")
        localStorage.setItem("COACHINGID", id)
        this.router.navigate(['assesment/user']).then(() => { window.location.reload(); });

    }
}
