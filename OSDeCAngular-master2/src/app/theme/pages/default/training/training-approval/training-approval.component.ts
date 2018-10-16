import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";

import { TrainingTx } from '../../../../../model/training/trainingTx';
import { Training } from '../../../../../model/training/training';
import { TrainingService } from '../../../../../services/training/training.service';
import { UserService } from '../../../../../services/user.service';

declare let toastr: any;
declare var $: any;
declare var jQuery: any;

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./training-approval.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [TrainingService, UserService]

})
export class TrainingApprovalComponent implements OnInit, AfterViewInit, OnDestroy {

    trainingTx: TrainingTx;
    training: Training;
    id: string;
    userId: string;
    loading: boolean = false;
    isEditable = false;
    trainingId: string;
    limit: any;

    message: any = {
        success: "Permohonan telah berjaya diluluskan",
        new: "Bilangan baki had peserta : ",
        danger: "Bilangan baki had peserta : "
    }
    message2: any = {
        error: "Permohonan telah ditolak"
    }

    belowForm: FormGroup;
    trainingForm: FormGroup;
    private sub: any;
    mandayTra: any;
    mandayObj: any;

    trTra: any;
    bakiLimit: any;
    trObj: any;

    trainingObj = null;
    userObj = null;
    confirmType: string = "success";
    confirmType2: string = "danger";

    confirmMsg: string;

    mark: any;
    userid: string;
    objUser: any;

    constructor(private _script: ScriptLoaderService, private trainingService: TrainingService, private userService: UserService, private router: Router, private route: ActivatedRoute) { }


    ngOnInit() {

        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.userid = currentUser.id;

        this.trainingForm = new FormGroup({
            name: new FormControl({ value: '', disabled: true }, Validators.required),
            title: new FormControl({ value: '', disabled: true }, Validators.required),
            agency: new FormControl({ value: '', disabled: true }, Validators.required),
            technology: new FormControl({ value: '', disabled: true }, Validators.required),
            startDate: new FormControl({ value: '', disabled: true }, Validators.required),
            endDate: new FormControl({ value: '', disabled: true }, Validators.required),
            level: new FormControl({ value: '', disabled: true }, Validators.required),

        });

        this.belowForm = new FormGroup({
            qualification: new FormControl({ value: '', disabled: true }, Validators.required),
            coach_remarks: new FormControl({ value: '', disabled: true }, Validators.required),
            admin_remarks: new FormControl('', Validators.required),
            total: new FormControl({ value: '', disabled: true }, Validators.required),

        });

        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];

            this.userService.getUserById(this.userid).subscribe(
                data => {
                    this.objUser = data;
                }
            )

            this.trainingService.getTrainingTxById(this.id).subscribe(
                data => {

                    this.trainingId = data.training.id;
                    this.limit = data.training.limitation;

                    for (let obj of data.user.skill) {
                        var objId = obj.technology.id;
                        if (objId === data.training.technology.id) {
                            this.mark = obj.mark;
                        }
                    }

                    var agency = data.user.agency;
                    var agencyName = "";
                    if (agency) {
                        agencyName = agency.name;
                    }

                    this.trainingForm.patchValue({
                        name: data.user.name,
                        agency: agencyName,
                        title: data.training.title,
                        technology: data.training.technology.name,
                        startDate: this.formatDate(data.training.startDate),
                        endDate: this.formatDate(data.training.endDate),
                        level: data.training.level
                    })

                    this.trainingObj = data.training;
                    this.userObj = data.user;
                    this.userId = data.user.id;

                    this.belowForm.patchValue({
                        qualification: data.qualification,
                        coach_remarks: data.coach_remarks,
                        admin_remarks: data.admin_remarks

                    });

                    this.trainingService.getUserByTraining(this.trainingId).subscribe(
                        data => {
                            this.trTra = data;
                            this.trObj = this.trTra.filter(value => value.status === "3");
                            this.bakiLimit = this.limit - this.trObj.length;

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
        this.router.navigate(['/training/list/admin/', this.trainingId]);
        jQuery('#m_modal_add').modal('hide');
    }

    LihatProfilPage() {
        this.router.navigate(['/header/profile/view/', this.userId]);
    }

    onSubmit() { }

    terima() {

        if (this.belowForm.valid) {
            if (this.id) {
                this.isEditable = true;

                let data: TrainingTx = new TrainingTx(
                    this.userObj,
                    this.trainingObj,
                    this.belowForm.controls['total'].value,
                    this.belowForm.controls['coach_remarks'].value,
                    this.belowForm.controls['admin_remarks'].value,
                    "3",
                    this.belowForm.controls['qualification'].value,
                    this.id,
                    null,
                    null,
                    this.objUser
                );

                this.trainingService.updateTrainingTx(data).subscribe(

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

                let data: TrainingTx = new TrainingTx(
                    this.userObj,
                    this.trainingObj,
                    this.belowForm.controls['total'].value,
                    this.belowForm.controls['coach_remarks'].value,
                    this.belowForm.controls['admin_remarks'].value,
                    "4",
                    null,
                    this.id,
                    null,
                    null,
                    this.objUser
                );

                this.trainingService.updateTrainingTx(data).subscribe(

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

                this.confirmMsg = this.message.new + this.bakiLimit + " (" + this.trObj.length + "/" + this.limit + ")";
                this.confirmType = "success";
                jQuery('#m_modal_add').modal('show');

            }
        }
    }
}
