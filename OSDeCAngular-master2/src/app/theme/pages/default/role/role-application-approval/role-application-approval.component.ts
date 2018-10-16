import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from "../../../../../model/user";
import { AppAuthority } from "../../../../../model/setup/appauthority";
import { RoleService } from '../../../../../services/setup/role.service';

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./role-application-approval.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [RoleService]
})
export class RoleApplicationApprovalComponent implements OnInit, AfterViewInit {

    appForm: FormGroup;
    currentUser: any;

    roleLs: any[];
    currentRole: any[];

    isNotValid: boolean;
    isEditable: boolean = true;

    app: AppAuthority;

    id: string;
    private sub: any;


    constructor(
        private _script: ScriptLoaderService,
        private roleService: RoleService,
        private router: Router,
        private route: ActivatedRoute
    ) {

    }
    ngOnInit() {

        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
        });

        this.currentUser = JSON.parse(localStorage.getItem("currentUser"));

        this.appForm = new FormGroup({
            name: new FormControl({ value: '', disabled: true }),
            agency: new FormControl({ value: '', disabled: true }),
            email: new FormControl({ value: '', disabled: true }),
            role: new FormControl({ value: '', disabled: true }),
            remarks: new FormControl({ value: '', disabled: true }),
            adminremarks: new FormControl(''),
            status: new FormControl('')
        });

        if (this.id) {
            this.roleService.getAppAuthById(this.id).subscribe(
                success => {

                    var type = success.user.type;
                    var agencyName = "";

                    if (type === "GOV") {
                        var agency = success.user.agency
                        if (agency) {
                            agencyName = agency.name;
                        }
                    } else {
                        var company = success.user.company
                        if (company) {
                            agencyName = company.name;
                        }
                    }

                    this.appForm.patchValue({
                        name: success.user.name,
                        agency: agencyName,
                        email: success.user.email,
                        role: success.roleid,
                        remarks: success.remarks
                    });

                    if (success.status === "APPROVE") {
                        this.appForm.patchValue({
                            status: "1",
                            adminremarks: success.adminremarks
                        });
                        this.appForm.get("status").disable();
                        this.appForm.get("adminremarks").disable();
                        this.isEditable = false;
                    } else if (success.status === "REJECT") {
                        this.appForm.patchValue({
                            status: "0",
                            adminremarks: success.adminremarks
                        });
                        this.appForm.get("status").disable();
                        this.appForm.get("adminremarks").disable();
                        this.isEditable = false;
                    }
                }
            );
        }

    }
    ngAfterViewInit() {
        this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
            'assets/demo/default/custom/header/actions.js');

    }

    onSubmit() {
        var status = this.appForm.controls['status'].value;

        if (status === null || status === undefined || status === "") {
            this.isNotValid = true;
            return false;
        } else {
            if (status === "0") {
                status = "REJECT";
            } else {
                status = "APPROVE";
            }

            let app: AppAuthority = new AppAuthority(
                this.id,
                null,
                status,
                null,
                null,
                null,
                null,
                null,
                this.currentUser,
                this.appForm.controls['adminremarks'].value);

            this.roleService.updateAppAuth(app).subscribe(
                success => {
                    this.redirectToList();
                }
            );
        }
    }

    redirectToList() {
        this.router.navigate(['/role/approval']);
    }

}
