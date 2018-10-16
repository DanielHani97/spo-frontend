import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";

import { Coaching } from '../../../../../model/coaching/coaching';
import { Manday } from '../../../../../model/setup/manday';
import { CoachingService } from '../../../../../services/coaching/coaching.service';
import { User } from '../../../../../model/user';
import { CoachingActivity } from '../../../../../model/coaching/coachingActivity';
import { NgbDatepickerConfig, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateFRParserFormatter } from "../../../../../_directives/ngb-date-fr-parser-formatter";
import { UserService } from '../../../../../services/user.service';

import { MandayService } from '../../../../../services/setup/manday.service';

declare var $: any;
declare let toastr: any;
declare var moment: any;
@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./coaching-approval.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [CoachingService, MandayService, UserService, { provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class CoachingApprovalComponent implements OnInit, AfterViewInit, OnDestroy {
    model;
    minDate: NgbDateStruct = { year: 1950, month: 1, day: 1 };
    maxDate: NgbDateStruct = { year: 2099, month: 12, day: 31 };

    endMin: NgbDateStruct = { year: 1950, month: 1, day: 1 };
    startMax: NgbDateStruct = { year: 2099, month: 12, day: 31 };


    minDate2: NgbDateStruct = { year: 1950, month: 1, day: 1 };
    maxDate2: NgbDateStruct = { year: 2099, month: 12, day: 31 };

    coaching: Coaching;
    coach: User;
    id: string;
    userid: string;
    userObj: any;

    jumlahManday: number = 0;
    mandayId: any;
    mandayReserved: number;
    user: any;
    mandayBalance: any;
    confirmMsg: any;
    coachLs: any[];
    currentCoach: any;
    coachingForm: FormGroup;
    belowForm: FormGroup;
    activityForm: FormGroup;

    loading: boolean = false;
    isEditable = false;
    message: any = {
        success: "Coaching Telah Berjaya Diterima",
        danger: "Coaching Telah Berjaya Ditolak"
    }

    private sub: any;
    private activities = [];

    constructor(private _script: ScriptLoaderService,
        private coachingService: CoachingService,
        private mandayService: MandayService,
        private userService: UserService,
        private router: Router,
        private route: ActivatedRoute,
        private parserFormatter: NgbDateParserFormatter,
        config: NgbDatepickerConfig) {

        config.outsideDays = 'collapsed';
        config.firstDayOfWeek = 7;

        config.markDisabled = (date: NgbDateStruct) => {
            const d = new Date(date.year, date.month - 1, date.day);
            return d.getDay() === 0 || d.getDay() === 6;
        };
    }

    onChange(value) {
        if (value == null) {
            this.endMin = this.endMin;
        } else {
            this.endMin = value;
        }
    }

    onChange2(value) {
        if (value == null) {
            this.startMax = this.startMax;
        } else {
            this.startMax = value;
        }
    }

    onChange3(value) {
        if (value == null) {
            this.minDate2 = this.minDate2;
        } else {
            this.minDate2 = value;
        }
    }

    onChange4(value) {
        if (value == null) {
            this.maxDate2 = this.maxDate2;
        } else {
            this.maxDate2 = value;
        }
    }


    ngOnInit() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.userid = currentUser.id;



        this.coachingForm = new FormGroup({
            name: new FormControl({ value: '', disabled: true }, Validators.required),
            user: new FormControl({ value: '', disabled: true }, Validators.required),
            agency: new FormControl({ value: '', disabled: true }, Validators.required),
            status: new FormControl({ value: '', disabled: true }, Validators.required),
            frontend: new FormControl({ value: '', disabled: true }, Validators.required),
            backend: new FormControl({ value: '', disabled: true }, Validators.required),
            frontendlevel: new FormControl({ value: '', disabled: true }, Validators.required),
            backendlevel: new FormControl({ value: '', disabled: true }, Validators.required),
            databaselevel: new FormControl({ value: '', disabled: true }, Validators.required),
            database: new FormControl({ value: '', disabled: true }, Validators.required),
            remarks: new FormControl({ value: '', disabled: true }, Validators.required),
        });

        this.belowForm = new FormGroup({
            coach: new FormControl({ value: '', disabled: true }, Validators.required),
            coach_remarks: new FormControl({ value: '', disabled: true }, Validators.required),
            admin_remarks: new FormControl('', Validators.required),
            kelayakan: new FormControl({ value: '', disabled: true }, Validators.required),
            cstart: new FormControl('', Validators.required),
            cendo: new FormControl('', Validators.required),
            reservedManday: new FormControl('', Validators.required)
        });

        this.activityForm = new FormGroup({
            name: new FormControl('', Validators.required),
            place: new FormControl('', Validators.required),
            start: new FormControl('', Validators.required),
            endo: new FormControl('', Validators.required),
            attendance: new FormControl('', Validators.required)
        })

        this.mandayService.getManday().subscribe(
            data => {
                let manday2 = data.filter(value => value.category === 'coaching');
                let mandayObj = manday2[0];
                this.mandayId = mandayObj.id;
                this.mandayReserved = Number(mandayObj.mandayReserved);
                this.mandayBalance = mandayObj.total - Number(mandayObj.mandayReserved);
                this.confirmMsg = "Baki manday Coaching: " + this.mandayBalance + " hari (" + mandayObj.mandayUsed + "/" + mandayObj.total + ")";
            }
        );

        this.sub = this.route.params.subscribe(
            params => {
                this.id = params['id'];


                if (this.id) {

                    this.userService.getUserById(this.userid).subscribe(
                        data => {
                            this.userObj = data;
                        }
                    )

                    this.coachingService.getCoachingById(this.id).subscribe(
                        coaching => {

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

                            let agensi = "";

                            if (coaching.user.type == "GOV") {
                                if (coaching.user.agency != null) {
                                    agensi = coaching.user.agency.name;
                                } else {
                                    agensi = "";
                                }
                            } else if (coaching.user.type == "PRIVATE") {
                                if (coaching.user.company != null) {
                                    agensi = coaching.user.company.name;
                                } else {
                                    agensi = "";
                                }
                            } else {
                                agensi = "";
                            }
                            this.id = coaching.id;
                            this.coachingForm.patchValue({
                                name: coaching.name,
                                user: coaching.user.name,
                                agency: agensi,
                                status: coaching.status,
                                frontend: coaching.frontend.name,
                                backend: coaching.backend.name,
                                frontendlevel: coaching.frontendlevel,
                                backendlevel: coaching.backendlevel,
                                databaselevel: coaching.databaselevel,
                                database: coaching.database.name,
                                remarks: coaching.remarks
                            });


                            this.coaching = coaching;

                            this.coachingService.getCoachingCoach(this.id).subscribe(
                                data => {
                                    this.currentCoach = data;
                                    this.belowForm.patchValue({
                                        kelayakan: this.coaching.kelayakan,
                                        coach_remarks: coaching.coach_remarks
                                    })
                                }
                            );

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

    calcBusinessDays(dDate1, dDate2) {
        var iWeeks, iDateDiff, iAdjust = 0;
        if (dDate2 < dDate1) return -1;
        var iWeekday1 = dDate1.getDay();
        var iWeekday2 = dDate2.getDay();
        iWeekday1 = (iWeekday1 == 0) ? 7 : iWeekday1;
        iWeekday2 = (iWeekday2 == 0) ? 7 : iWeekday2;
        if ((iWeekday1 > 5) && (iWeekday2 > 5)) iAdjust = 1;
        iWeekday1 = (iWeekday1 > 5) ? 5 : iWeekday1;
        iWeekday2 = (iWeekday2 > 5) ? 5 : iWeekday2;

        iWeeks = Math.floor((dDate2.getTime() - dDate1.getTime()) / 604800000)

        if (iWeekday1 <= iWeekday2) {
            iDateDiff = (iWeeks * 5) + (iWeekday2 - iWeekday1)
        } else {
            iDateDiff = ((iWeeks + 1) * 5) - (iWeekday1 - iWeekday2)
        }

        iDateDiff -= iAdjust

        return (iDateDiff + 1);
    }

    deleteFn(index) {
        if (this.activities[index].attendance == "Ada") {
            this.jumlahManday = this.jumlahManday - Number(this.activities[index].duration);
        }

        this.activities.splice(index, 1);
    }
    newAct() {

        var form = $('#activityForm');

        form.validate({
            rules: {
                start: "required",
                endo: "required"
            }
        });


        if (!form.valid()) {
            return false;
        } else {
            if (this.activityForm.valid) {

                //To Calculate Tempoh

                let ngbDate = this.activityForm.controls['start'].value;
                let date = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
                let ngbDate2 = this.activityForm.controls['endo'].value;
                let date2 = new Date(ngbDate2.year, ngbDate2.month - 1, ngbDate2.day);

                var dateone = new Date(date);
                var datetwo = new Date(date2);

                var tempohan = Math.round(this.calcBusinessDays(dateone, datetwo));
                if (this.activityForm.controls['attendance'].value == "Ada") {
                    this.jumlahManday = this.jumlahManday + Number(tempohan);
                }

                this.activities.push({
                    name: this.activityForm.controls['name'].value,
                    place: this.activityForm.controls['place'].value,
                    start: date,
                    endo: date2,
                    attendance: this.activityForm.controls['attendance'].value,
                    duration: tempohan
                })




                this.activityForm.reset();
                $("#m_modal_1").modal("hide");

            }
        }

    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    ngAfterViewInit() {
        this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
            'assets/osdec/validation/coaching/coaching-approval.js',
            'assets/osdec/validation/validation.js');
    }

    onSubmit() {
        var form = $('#belowForm');

        form.validate({
            rules: {
                cstart: "required",
                cendo: "required",
                reservedManday: {
                    required: !0,
                    number: !0
                }
            }
        });

        if (!form.valid) {
            return false;
        } else {

            if (this.belowForm.valid) {

                if (this.id) {
                    var mandayEntered = Number(this.belowForm.controls['reservedManday'].value);
                    if (mandayEntered > this.mandayBalance) {
                        $("#m_modal_manday").modal("show");
                    } else {
                        if (this.jumlahManday > Number(this.belowForm.controls['reservedManday'].value)) {
                            $("#m_modal_used").modal("show");
                        } else {
                            let ngbDate = this.belowForm.controls['cstart'].value;
                            let date = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
                            let ngbDate2 = this.belowForm.controls['cendo'].value;
                            let date2 = new Date(ngbDate2.year, ngbDate2.month - 1, ngbDate2.day);

                            this.mandayReserved = Number(this.mandayReserved) + Number(this.belowForm.controls['reservedManday'].value)

                            let coaching: Coaching = new Coaching(
                                null,
                                null,
                                null,
                                '4',
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                this.belowForm.controls['admin_remarks'].value,
                                this.belowForm.controls['coach_remarks'].value,
                                date,
                                date2,
                                this.coaching.kelayakan,
                                this.jumlahManday.toString(),
                                this.belowForm.controls['reservedManday'].value,
                                null,
                                null,
                                null,
                                this.userObj,
                                null,
                                this.id, null, null, null);



                            this.coachingService.approveCoaching(coaching).subscribe(
                                success => {

                                    let manday: Manday = new Manday(
                                        null,
                                        null,
                                        null,
                                        this.mandayReserved.toString(),
                                        this.mandayId
                                    )
                                    this.mandayService.updateMandayReserved(manday).subscribe(
                                        success => {
                                            for (var i = 0; i < this.activities.length; ++i) {
                                                let coachingActivity: CoachingActivity = new CoachingActivity(
                                                    this.activities[i].name,
                                                    this.activities[i].attendance,
                                                    this.activities[i].place,
                                                    this.activities[i].duration,
                                                    this.activities[i].start,
                                                    this.activities[i].endo,
                                                    this.coaching,
                                                    '1',
                                                    null,
                                                    null,
                                                    null, null
                                                )

                                                this.coachingService.createActivity(coachingActivity).subscribe();
                                            }

                                            this.isEditable = true;
                                            this.loading = false;
                                            toastr.success(this.message.success);
                                            this.redirectListPage();
                                        }
                                    )

                                }
                            );
                        }
                    }
                }
            }
        }
    }

    confirm() {

    }

    tambah() {
        this.activityForm.reset();
        if (this.belowForm.controls['cstart'].value == null || this.belowForm.controls['cendo'].value == null) {
            $("#m_modal_date").modal("show");
        } else {
            let ngbDate = this.belowForm.controls['cstart'].value;
            let date = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
            let dateA = moment(date, 'YYYY-MM-DD')
            let ngbDate2 = this.belowForm.controls['cendo'].value;
            let date2 = new Date(ngbDate2.year, ngbDate2.month - 1, ngbDate2.day);
            let dateB = moment(date2, 'YYYY-MM-DD')
            if (dateA.isValid() && dateB.isValid()) {
                this.minDate = { year: ngbDate.year, month: ngbDate.month, day: ngbDate.day };
                this.minDate2 = { year: ngbDate.year, month: ngbDate.month, day: ngbDate.day };
                this.maxDate = { year: ngbDate2.year, month: ngbDate2.month, day: ngbDate2.day };
                this.maxDate2 = { year: ngbDate2.year, month: ngbDate2.month, day: ngbDate2.day };
                $("#m_modal_1").modal("show");
            } else {

                $("#m_modal_date").modal("show");
            }
        }

    }

    tolak() {
        var form = $('#belowForm');

        form.validate({
            rules: {
                admin_remarks: {
                    required: true
                }
            }
        });

        if (!form.valid) {
            false
        } else {

            if (this.id) {
                let coaching: Coaching = new Coaching(
                    null,
                    null,
                    null,
                    '5',
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    this.belowForm.controls['admin_remarks'].value,
                    this.belowForm.controls['coach_remarks'].value,
                    null,
                    null,
                    this.coaching.kelayakan,
                    null,
                    null,
                    null,
                    null,
                    null,
                    this.userObj,
                    null,
                    this.id, null, null, null);

                this.coachingService.updateCoaching(coaching).subscribe(
                    success => {
                        this.isEditable = true;
                        this.loading = false;
                        toastr.success(this.message.danger);
                        this.redirectListPage();
                    });
            }

        }
    }



    redirectListPage() {
        this.router.navigate(['/coaching/list/admin']);
    }

    redirectProfile(id) {
        this.router.navigate(['/header/profile/view/', id]);
    }

}
