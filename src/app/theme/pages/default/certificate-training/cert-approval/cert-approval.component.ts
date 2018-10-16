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
declare var $: any;
declare var jQuery: any;

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./cert-approval.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [CertificationService, UserService]
})
export class CertApprovalComponent implements OnInit, AfterViewInit, OnDestroy {

    certificationUser: CertificationUser;
    id: string;
    certId: string;
    loading: boolean = false;
    isEditable = false;
    userId: string;

    message: any = {
        success: "Permohonan telah berjaya diluluskan",
        new: "Bilangan baki had peserta : ",
        danger: "Bilangan baki had peserta : "
    }
    message2: any = {
        error: "Permohonan telah ditolak"
    }

    crObj: any;
    crTra: any;
    bakiLimit: any;

    belowForm: FormGroup;
    certForm: FormGroup;
    private sub: any;
    userObj = null;
    certObj = null;
    limit: any;
    mark: any;

    objUser: any;
    userid: string;

    confirmType: string = "success";
    confirmType2: string = "danger";

    confirmMsg: string;

    constructor(private _script: ScriptLoaderService, private certificationService: CertificationService, private userService: UserService, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {

        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.userid = currentUser.id;

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

            this.userService.getUserById(this.userid).subscribe(
                data => {
                    this.objUser = data;
                }
            )

            this.certificationService.getCertificationUserById(this.id).subscribe(
                data => {

                    this.certId = data.certification.id;
                    this.limit = data.certification.limitation;

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

                    this.certificationService.getUserByCertification(this.certId).subscribe(
                        data => {

                            this.crObj = data;
                            this.crTra = this.crObj.filter(value => value.status === "3");
                            this.bakiLimit = this.limit - this.crTra.length;
                        }
                    )
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
            'assets/osdec/validation/training/trainingAdmin-val.js', 'assets/osdec/validation/validation.js');
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
        jQuery('#m_modal_add').modal('hide');
    }

    onSubmit() { }

    LihatProfilPage() {
        this.router.navigate(['/header/profile/view/', this.userId]);
    }

    terima() {

        if (this.belowForm.valid) {
            if (this.id) {
                this.isEditable = true;

                let data: CertificationUser = new CertificationUser(
                    this.userObj,
                    this.certObj,
                    //this.belowForm.controls['coach_remarks'].value,
                    this.belowForm.controls['admin_remarks'].value,
                    "3",
                    this.id,
                    null,
                    null,
                    this.objUser,
                    null,
                    null, null);

                this.certificationService.updateCertificationUser(data).subscribe(

                    success => {
                        this.redirectListPage();
                        this.isEditable = true;
                        this.loading = false;
                        toastr.success(this.message.success);
                    }
                );
            }
        }
    }

    tolak() {

        if (this.belowForm.valid) {
            if (this.id) {
                this.isEditable = true;

                let data: CertificationUser = new CertificationUser(
                    this.userObj,
                    this.certObj,
                    //this.belowForm.controls['coach_remarks'].value,
                    this.belowForm.controls['admin_remarks'].value,
                    "4",
                    this.id,
                    null,
                    null,
                    this.objUser,
                    null,
                    null, null);

                this.certificationService.updateCertificationUser(data).subscribe(

                    success => {
                        this.redirectListPage();
                        this.isEditable = true;
                        this.loading = false;
                        toastr.error(this.message2.error);
                    }

                );
            }
        }
    }

    onConfirm($event) {
        var form = $('#belowForm');

        form.validate({
            rules: {
                admin_remarks: "required"
            }
        });
        if (!form.valid()) {
            return false;
        } else {

            $event.preventDefault();

            if (this.bakiLimit == 0) {

                this.confirmMsg = this.message.danger + this.bakiLimit + ". Sila hubungi Pentadbir sistem untuk maklumat lanjut";
                this.confirmType = "danger";
                jQuery('#m_modal_add2').modal('show');


            } else {

                this.confirmMsg = this.message.new + this.bakiLimit + " (" + this.crTra.length + "/" + this.limit + ")";
                this.confirmType = "success";
                jQuery('#m_modal_add').modal('show');
            }
        }
    }
}
