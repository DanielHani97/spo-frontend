import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";

import { Coaching } from '../../../../../model/coaching/coaching';
import { CoachingService } from '../../../../../services/coaching/coaching.service'

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./coaching-view-info.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [CoachingService]
})
export class CoachingViewInfoComponent implements OnInit, AfterViewInit, OnDestroy {

    coaching: Coaching;
    id: string;
    currentUser: any;
    user: any;
    bearToken: string;
    coachLs: any[];
    currentCoach: any[];
    coachingForm: FormGroup;
    belowForm: FormGroup;
    userForm: FormGroup;
    private sub: any;
    markFrame: number;
    markLang: number;
    markDb: number;

    constructor(
        private _script: ScriptLoaderService,
        private coachingService: CoachingService,
        private router: Router,
        private route: ActivatedRoute) { }

    ngOnInit() {

        this.bearToken = "Bearer " + localStorage.getItem('jwtToken');
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.currentUser = currentUser;

        this.coachingForm = new FormGroup({
            name: new FormControl({ value: '', disabled: true }, Validators.required),
            user: new FormControl({ value: '', disabled: true }, Validators.required),
            agency: new FormControl({ value: '', disabled: true }, Validators.required),
            status: new FormControl({ value: '', disabled: true }, Validators.required),
            frontend: new FormControl({ value: '', disabled: true }, Validators.required),
            backend: new FormControl({ value: '', disabled: true }, Validators.required),
            database: new FormControl({ value: '', disabled: true }, Validators.required),
            frontendlevel: new FormControl({ value: '', disabled: true }, Validators.required),
            backendlevel: new FormControl({ value: '', disabled: true }, Validators.required),
            databaselevel: new FormControl({ value: '', disabled: true }, Validators.required),
            remarks: new FormControl({ value: '', disabled: true }, Validators.required),
        });

        this.belowForm = new FormGroup({
            coach_remarks: new FormControl({ value: '', disabled: true }, Validators.required),
            admin_remarks: new FormControl({ value: '', disabled: true }, Validators.required),
            starting_date: new FormControl({ value: '', disabled: true }, Validators.required),
            ending_date: new FormControl({ value: '', disabled: true }, Validators.required),
            reservedManday: new FormControl({ value: '', disabled: true }, Validators.required)
        });

        this.sub = this.route.params.subscribe(
            params => {
                this.id = params['id'];

                if (this.id) {

                    this.coachingService.getCoachingCoach(this.id).subscribe(
                        data => {
                            this.currentCoach = data;
                        }
                    );

                    this.coachingService.getCoachingById(this.id).subscribe(
                        coaching => {
                            let agensi = "";
                            if (coaching.agency != null) {
                                agensi = coaching.agency.name
                            } else {
                                agensi = "";
                            }

                            var frameName = "";
                            var langName = "";
                            var dbName = "";

                            var frameLvl = "";
                            var langLvl = "";
                            var dbLvl = "";

                            var frameId = "";
                            var langId = "";
                            var dbId = "";

                            if (coaching.frontend) {
                                frameName = coaching.frontend.name;
                                frameId = coaching.frontend.id;
                                frameLvl = coaching.frontendlevel;
                            } if (coaching.backend) {
                                langName = coaching.backend.name;
                                langId = coaching.backend.id;
                                langLvl = coaching.backendlevel;
                            } if (coaching.database) {
                                dbName = coaching.database.name;
                                dbId = coaching.database.id;
                                dbLvl = coaching.databaselevel;
                            }

                            this.coachingForm.patchValue({
                                name: coaching.name,
                                user: coaching.user.name,
                                agency: agensi,
                                status: coaching.status,
                                frontend: frameName,
                                backend: langName,
                                database: dbName,
                                frontendlevel: coaching.frontendlevel,
                                backendlevel: coaching.backendlevel,
                                databaselevel: coaching.databaselevel,
                                remarks: coaching.remarks
                            });

                            var coach_remarks;
                            if (coaching.coach_remarks == null) {
                                coach_remarks = " ";
                            } else {
                                coach_remarks = coaching.coach_remarks;
                            }

                            var admin_remarks;
                            if (coaching.admin_remarks == null) {
                                admin_remarks = " ";
                            } else {
                                admin_remarks = coaching.admin_remarks;
                            }

                            var mandayReserved;
                            if (coaching.mandayReserved == null) {
                                mandayReserved = " ";
                            } else {
                                mandayReserved = coaching.mandayReserved;
                            }

                            var startingDate
                            if (coaching.starting_date == null) {
                                startingDate = " ";
                            } else {
                                var startDate = new Date(coaching.starting_date);
                                startingDate = this.formatDate(startDate);
                            }

                            var endingDate
                            if (coaching.ending_date == null) {
                                endingDate = " ";
                            } else {
                                var endDate = new Date(coaching.ending_date);
                                endingDate = this.formatDate(endDate);
                            }

                            this.belowForm.patchValue({
                                coach_remarks: coach_remarks,
                                admin_remarks: admin_remarks,
                                starting_date: startingDate,
                                ending_date: endingDate,
                                reservedManday: mandayReserved
                            })

                            //load user for coaching
                            this.coachingService.getUserByCoaching(this.id).subscribe(
                                data => {
                                    this.user = data;


                                    for (let obj of this.user) {
                                        var skills = obj.user.skill;

                                        for (let skill of skills) {
                                            var skillTechId = skill.technology.id
                                            var skillLvl = skill.level;
                                            var skillMark = skill.mark;

                                            if (frameId) {
                                                if ((frameId == skillTechId) && (frameLvl == skillLvl)) {
                                                    obj.coaching.frontend.modifiedby = skillMark;
                                                } else {
                                                    obj.coaching.frontend.modifiedby = 0;
                                                }
                                            }
                                            if (langId) {
                                                if ((langId == skillTechId) && (langLvl == skillLvl)) {
                                                    obj.coaching.backend.modifiedby = skillMark;
                                                } else {
                                                    obj.coaching.backend.modifiedby = 0;
                                                }
                                            }
                                            if (dbId) {
                                                if ((dbId == skillTechId) && (dbLvl == skillLvl)) {
                                                    obj.coaching.database.modifiedby = skillMark;
                                                } else {
                                                    obj.coaching.database.modifiedby = 0;
                                                }
                                            }

                                        }
                                    }
                                }
                            );
                        },

                        error => {
                            console.log(error);
                        }
                    );
                }
            }
        );
    }

    formatDate(date) {
        var datemagic = new Date(date);
        var day = datemagic.getDate();
        var month = datemagic.getMonth() + 1;
        var year = datemagic.getFullYear();
        return day + '/' + month + '/' + year;
    }


    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    ngAfterViewInit() {
        this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
            'assets/osdec/validation/coaching/coaching-val.js');
    }

    redirectListPage() {
        window.history.back();
    }

    onSubmit() {
        if (this.coachingForm.valid) {
            if (this.id) {
                console.log("submitted");
            }
        }
    }

    redirectProfile(id) {
        this.router.navigate(['/header/profile/view/', id]);
    }

    redirectAttend() {
        this.router.navigate(['/coaching/attendance', this.id]);
    }

    redirectFeedback() {
        this.router.navigate(['/coaching/feedback', this.id]);
    }
}
