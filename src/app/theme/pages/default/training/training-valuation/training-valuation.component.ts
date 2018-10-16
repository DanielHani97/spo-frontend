import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";

import { TrainingTx } from '../../../../../model/training/trainingTx';
import { TrainingService } from '../../../../../services/training/training.service';
import { Skill } from '../../../../../model/skill';
import { SkillService } from '../../../../../services/skill.service';
import { UserService } from '../../../../../services/user.service';

declare let toastr: any;

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./training-valuation.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [TrainingService, SkillService, UserService]

})
export class TrainingValuationComponent implements OnInit, AfterViewInit, OnDestroy {

    trainingTx: TrainingTx;
    id: string;
    userId: string;
    trainingId: string;
    loading: boolean = false;
    isEditable = false;

    message: any = {
        success: "Maklumat penilaian telah berjaya disimpan"
    }

    user: any;
    skills: any;

    belowForm: FormGroup;
    trainingForm: FormGroup;
    private sub: any;

    status = '2';
    admin_remarks = null;

    userObj = null;
    trainingObj = null;
    skillObj = null;
    skillUserId: any;
    mark: any;
    userid: string;
    objUser: any;

    constructor(private _script: ScriptLoaderService, private trainingService: TrainingService, private skillService: SkillService, private userService: UserService, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {

        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.userid = currentUser.id;

        this.trainingForm = new FormGroup({
            name: new FormControl({ value: '', disabled: true }, Validators.required),
            agency: new FormControl({ value: '', disabled: true }, Validators.required),
            title: new FormControl({ value: '', disabled: true }, Validators.required),
            technology: new FormControl({ value: '', disabled: true }, Validators.required),
            startDate: new FormControl({ value: '', disabled: true }, Validators.required),
            endDate: new FormControl({ value: '', disabled: true }, Validators.required),
            level: new FormControl({ value: '', disabled: true }, Validators.required),

        });

        this.belowForm = new FormGroup({
            coach_remarks: new FormControl('', Validators.required),
            qualification: new FormControl('', Validators.required)
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
                        // markah: data.user.skill.mark,
                        title: data.training.title,
                        technology: data.training.technology.name,
                        startDate: this.formatDate(data.training.startDate),
                        endDate: this.formatDate(data.training.endDate),
                        level: data.training.level
                    })

                    this.userObj = data.user;
                    this.userId = data.user.id;
                    this.trainingObj = data.training;

                    this.belowForm.patchValue({
                        coach_remarks: data.coach_remarks,
                        qualification: data.qualification
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

    redirectListPage() {
        this.router.navigate(['/training/peserta/', this.trainingId]);
    }

    LihatProfilPage() {
        this.router.navigate(['/header/profile/view/', this.userId]);
    }

    onSubmit() {

        if (this.belowForm.valid) {
            if (this.id) {
                this.isEditable = true;

                let data: TrainingTx = new TrainingTx(
                    this.userObj,
                    this.trainingObj,
                    null,
                    this.belowForm.controls['coach_remarks'].value,
                    this.admin_remarks,
                    this.status,
                    this.belowForm.controls['qualification'].value,
                    this.id,
                    null,
                    this.objUser,
                    null,
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
}
