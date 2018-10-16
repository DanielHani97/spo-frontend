import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";

import { CertificationUser } from '../../../../../model/certification/certificationUser';
import { CertificationService } from '../../../../../services/certification/certification.service';

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./cert-approval-2.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [CertificationService]
})
export class CertApproval2Component implements OnInit, AfterViewInit, OnDestroy {

    certificationUser: CertificationUser;
    id: string;

    belowForm: FormGroup;
    certForm: FormGroup;
    private sub: any;
    userObj = null;
    certObj = null;
    mark: any;
    userId: string;

    constructor(private _script: ScriptLoaderService, private certificationService: CertificationService, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {

        this.certForm = new FormGroup({
            name: new FormControl({ value: '', disabled: true }, Validators.required),
            title: new FormControl({ value: '', disabled: true }, Validators.required),
            agency: new FormControl({ value: '', disabled: true }, Validators.required),
            technology: new FormControl({ value: '', disabled: true }, Validators.required),
            startDate: new FormControl({ value: '', disabled: true }, Validators.required),
            endDate: new FormControl({ value: '', disabled: true }, Validators.required),
            level: new FormControl({ value: '', disabled: true }, Validators.required),

        });

        this.belowForm = new FormGroup({
            //coach_remarks: new FormControl({value: '', disabled: true}, Validators.required),
            admin_remarks: new FormControl('', Validators.required)
        });

        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];

            this.certificationService.getCertificationUserById(this.id).subscribe(
                data => {

                    for (let obj of data.user.skill) {
                        var objId = obj.technology.id;
                        if (objId === data.certification.technology.id) {
                            this.mark = obj.mark;
                        }
                    }

                    this.certForm.patchValue({
                        name: data.user.name,
                        agency: data.user.agency.name,
                        title: data.certification.title,
                        technology: data.certification.technology.name,
                        startDate: this.formatDate(data.certification.startDate),
                        endDate: this.formatDate(data.certification.endDate),
                        level: data.certification.level
                    })

                    this.userId = data.user.id;
                    this.userObj = data.user;
                    this.certObj = data.certification;

                    this.belowForm.patchValue({
                        //coach_remarks: data.coach_remarks,
                        admin_remarks: data.admin_remarks
                    });
                },

                error => {
                    console.log(error);
                }
            );
        });

    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    ngAfterViewInit() {
    }

    LihatProfilPage() {
        this.router.navigate(['/header/profile/view/', this.userId]);
    }

    formatDate(date) {
        var datemagic = new Date(date);
        var day = datemagic.getDate();
        var month = datemagic.getMonth() + 1;
        var year = datemagic.getFullYear();
        return day + '/' + month + '/' + year;
    }

    redirectListPage() {
        this.router.navigate(['/cert/list/admin']);
    }

    onSubmit() {

    }
}
