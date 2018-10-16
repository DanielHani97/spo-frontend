import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { User } from "../../../../../model/user";
import { AppAuthority } from "../../../../../model/setup/appauthority";
import { RoleService } from '../../../../../services/setup/role.service';
import { UserService } from '../../../../../services/user.service';

import { NavigationEnd, Router } from '@angular/router';

import { message } from "../../../../../message/default";

declare let toastr: any;
@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./role-application.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [RoleService, UserService]
})
export class RoleApplicationComponent implements OnInit, AfterViewInit {

    appForm: FormGroup;
    currentUser: any;

    roleLs: any[];
    currentRole: any[];

    isNotValid: boolean;

    app: AppAuthority;


    constructor(
        private _script: ScriptLoaderService,
        private roleService: RoleService,
        private router: Router,
        private userService: UserService
    ) {

    }
    ngOnInit() {

        this.currentUser = JSON.parse(localStorage.getItem("currentUser"));

        this.appForm = new FormGroup({
            name: new FormControl({ value: '', disabled: true }),
            agency: new FormControl({ value: '', disabled: true }),
            email: new FormControl({ value: '', disabled: true }),
            role: new FormControl(''),
            remarks: new FormControl()
        });

        //this.countryForm.controls['country'].setValue

        this.roleService.getRole().subscribe(
            success => {
                this.roleLs = success;

                this.currentRole = this.currentUser.authorities;
                for (var i = 0; i < this.currentRole.length; i++) {
                    var role = this.currentRole[i].authority;

                    for (var j = 0; j < this.roleLs.length; j++) {
                        var name = this.roleLs[j].name;
                        if (name === role) {
                            this.roleLs.splice(j, 1);
                        }
                    }
                }

                if (this.currentUser.id) {
                    this.userService.getUserById(this.currentUser.id).subscribe(
                        success => {

                            var type = success.type;
                            var agencyName = "";

                            if (type === "GOV") {
                                var agency = success.agency
                                if (agency) {
                                    agencyName = agency.name;
                                }
                            } else {
                                var company = success.company
                                if (company) {
                                    agencyName = company.name;
                                }
                            }

                            this.appForm.patchValue({
                                name: success.name,
                                agency: agencyName,
                                email: success.email,
                                role: "0"
                            });
                        }
                    );
                }
            }
        );



    }
    ngAfterViewInit() {
        this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
            'assets/demo/default/custom/header/actions.js');

    }

    onSubmit() {
        var role = this.appForm.controls['role'].value;

        if (role === "0") {
            this.isNotValid = true;
            return false;
        } else {

            let app: AppAuthority = new AppAuthority(
                null,
                this.appForm.controls['remarks'].value,
                "NEW",
                null,
                null,
                null,
                null,
                role,
                this.currentUser,
                null);

            this.roleService.createAppAuth(app).subscribe(
                success => {
                    toastr.success(message.global.success);
                    this.router.navigate(['indexUser']);
                }
            );
        }
    }

}
