import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";

import { CertificationUser } from '../../../../../model/certification/certificationUser';
import { CertificationService } from '../../../../../services/certification/certification.service';
import { UserService } from '../../../../../services/user.service';

declare let toastr: any;

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./cert-valuation.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [CertificationService, UserService]

})
export class CertValuationComponent implements OnInit, AfterViewInit, OnDestroy {

    certificationUser: CertificationUser;
    id: string;
    loading: boolean = false;
    isEditable = false;

    message: any = {
        success: "Maklumat penilaian telah berjaya disimpan"
    }
    user: any;

    belowForm: FormGroup;
    certForm: FormGroup;
    private sub: any;

    status = '2';
    admin_remarks = null;

    userObj = null;
    certObj = null;
    objUser: any;

    constructor(private _script: ScriptLoaderService, private certificationService: CertificationService, private userService: UserService, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {

        this.certForm = new FormGroup({
            name: new FormControl({ value: '', disabled: true }, Validators.required),
            agency: new FormControl({ value: '', disabled: true }, Validators.required),
            title: new FormControl({ value: '', disabled: true }, Validators.required),
            technology: new FormControl({ value: '', disabled: true }, Validators.required),
            startDate: new FormControl({ value: '', disabled: true }, Validators.required),
            endDate: new FormControl({ value: '', disabled: true }, Validators.required),
            level: new FormControl({ value: '', disabled: true }, Validators.required),

        });

        this.belowForm = new FormGroup({
            //  coach_remarks: new FormControl('', Validators.required)
        });

        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];

            this.userService.getUserById(this.id).subscribe(
                data => {
                    this.objUser = data;
                }
            )

            this.certificationService.getCertificationUserById(this.id).subscribe(

                data => {

                    this.certForm.patchValue({
                        name: data.user.name,
                        agency: data.user.agency.name,
                        title: data.certification.title,
                        technology: data.certification.technology.name,
                        startDate: this.formatDate(data.certification.startDate),
                        endDate: this.formatDate(data.certification.endDate),
                        level: data.certification.level
                    })

                    this.userObj = data.user;
                    this.certObj = data.certification;

                    this.belowForm.patchValue({
                        // coach_remarks: data.coach_remarks
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
        this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
            'assets/osdec/validation/training/trainingCoach-val.js', 'assets/osdec/validation/validation.js');
    }

    formatDate(date) {
        var datemagic = new Date(date);
        var day = datemagic.getDate();
        var month = datemagic.getMonth() + 1;
        var year = datemagic.getFullYear();
        return day + '/' + month + '/' + year;
    }

    redirectPesertaPage() {
        this.router.navigate(['/cert/list/coach']);
    }

    onSubmit() {

        if (this.belowForm.valid) {
            if (this.id) {
                let data: CertificationUser = new CertificationUser(
                    this.userObj,
                    this.certObj,
                    //this.belowForm.controls['coach_remarks'].value,
                    this.admin_remarks,
                    this.status,
                    this.id,
                    null,
                    this.objUser,
                    null,
                    null,
                    null, null);

                this.certificationService.updateCertificationUser(data).subscribe(

                    success => {
                        this.redirectPesertaPage();
                        this.isEditable = true;
                        this.loading = false;
                        toastr.success(this.message.success);
                    }

                );
            }

        }

    }
}
