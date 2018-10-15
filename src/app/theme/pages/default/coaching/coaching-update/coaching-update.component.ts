import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy  } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";

import { Coaching } from '../../../../../model/coaching/coaching';
import { CoachingService } from '../../../../../services/coaching/coaching.service'
import { CoachingActivity } from '../../../../../model/coaching/coachingActivity';
import { User } from '../../../../../model/user';
import { NgbDatepickerConfig, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateFRParserFormatter } from "../../../../../_directives/ngb-date-fr-parser-formatter";

declare var $: any;
declare let toastr:any;
@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./coaching-update.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [CoachingService, {provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class CoachingUpdateComponent implements OnInit, AfterViewInit, OnDestroy  {

    model;
    minDate: NgbDateStruct = {year: 1950, month: 1, day: 1};
    maxDate: NgbDateStruct = {year: 2099, month: 12, day: 31};
    minDate2: NgbDateStruct = {year: 1950, month: 1, day: 1};
    maxDate2: NgbDateStruct = {year: 2099, month: 12, day: 31};

	  coaching: Coaching;
    coach: User;
	  id: string;
    jumlahManday: number = 0;
    reservedManday: number = 0;

	  user: any;
    bearToken : string;
    coachLs: any[];
    aktivitiLs: any[];
    currentCoach: any;
	  coachingForm: FormGroup;
    belowForm: FormGroup;
    activityForm: FormGroup;

    loading: boolean = false;
    isEditable = false;
    message: any = {
      success: "Maklumat Telah Berjaya Dikemaskini"
    }

	private sub: any;
    private activities = [];
    private newLs = [];
    private aktiviti = [];
    private sendLs = [];
    private oldLs = [];

    constructor(
        private _script: ScriptLoaderService,
        private coachingService:CoachingService,
        private router:Router,
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

    ngOnInit() {

        this.bearToken = "Bearer "+localStorage.getItem('jwtToken');

        this.coachingForm = new FormGroup({
            name: new FormControl({value: '', disabled: true}, Validators.required),
            user: new FormControl({value: '', disabled: true}, Validators.required),
            agency: new FormControl({value: '', disabled: true}, Validators.required),
            status: new FormControl({value: '', disabled: true}, Validators.required),
            frontend: new FormControl({value: '', disabled: true}, Validators.required),
            backend: new FormControl({value: '', disabled: true}, Validators.required),
            frontendlevel: new FormControl({value: '', disabled: true}, Validators.required),
            backendlevel: new FormControl({value: '', disabled: true}, Validators.required),
            databaselevel: new FormControl({value: '', disabled: true}, Validators.required),
            database: new FormControl({value: '', disabled: true}, Validators.required),
            remarks: new FormControl({value: '', disabled: true}, Validators.required),
        });

        this.belowForm =new FormGroup({
            coach_remarks: new FormControl({value: '', disabled: true}, Validators.required),
            admin_remarks: new FormControl({value: '', disabled: true}, Validators.required),
            starting_date: new FormControl({value: '', disabled: true}, Validators.required),
            ending_date: new FormControl({value: '', disabled: true}, Validators.required),
            reservedManday: new FormControl({value: '', disabled: true}, Validators.required)
        });

        this.activityForm = new FormGroup ({
           name: new FormControl('', Validators.required),
            place: new FormControl('', Validators.required),
            start: new FormControl('', Validators.required),
            endo: new FormControl('', Validators.required),
            attendance: new FormControl('', Validators.required)
        })

    	this.sub = this.route.params.subscribe(
    		params => {
    			this.id = params['id'];


                if (this.id){

                    this.coachingService.getCoachingCoach(this.id).subscribe(
                        data => {
                            this.currentCoach = data;

                        }
                    );

                    this.coachingService.getCoachingById(this.id).subscribe(
                        coaching => {
                            this.reservedManday = Number(coaching.mandayReserved);
                            let agensi = "";

                            if(coaching.user.type=="GOV"){
                                if(coaching.user.agency!=null){
                                    agensi = coaching.user.agency.name;
                                }else{
                                    agensi = "";
                                }
                            }else if(coaching.user.type=="PRIVATE"){
                                if(coaching.user.company!=null){
                                    agensi = coaching.user.company.name;
                                }else{
                                    agensi = "";
                                }
                            }else{
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
                            var startDate = new Date(coaching.starting_date);
                            var endDate = new Date(coaching.ending_date);
                            this.minDate = {year: startDate.getFullYear(), month: startDate.getMonth()+1, day: startDate.getDate()};
                            this.maxDate = {year: endDate.getFullYear(), month: endDate.getMonth()+1, day: endDate.getDate()};

                            this.belowForm.patchValue({
                                coach_remarks: coaching.coach_remarks,
                                admin_remarks: coaching.admin_remarks,
                                starting_date: this.formatDate(startDate),
                                ending_date: this.formatDate(endDate),
                                reservedManday: coaching.mandayReserved
                            })

                            var frameName = "";
                            var langName = "";
                            var dbName = "";

                            var frameLvl = "";
                            var langLvl = "";
                            var dbLvl = "";

                            var frameId = "";
                            var langId = "";
                            var dbId = "";

                            if(coaching.frontend){
                              frameName = coaching.frontend.name;
                              frameId = coaching.frontend.id;
                              frameLvl= coaching.frontendlevel;
                            }if(coaching.backend){
                              langName = coaching.backend.name;
                              langId = coaching.backend.id;
                              langLvl= coaching.backendlevel;
                            }if(coaching.database){
                              dbName = coaching.database.name;
                              dbId = coaching.database.id;
                              dbLvl= coaching.databaselevel;
                            }

                            this.coachingService.getUserByCoaching(this.id).subscribe(
                                data => {
                                    this.user = data;

                                    for(let obj of this.user){
                                      var skills = obj.user.skill;

                                      for(let skill of skills){
                                        var skillTechId = skill.technology.id
                                        var skillLvl = skill.level;
                                        var skillMark = skill.mark;

                                        if(frameId){
                                          if((frameId == skillTechId) && (frameLvl == skillLvl) ){
                                            obj.coaching.frontend.modifiedby = skillMark;
                                          }else{
                                            obj.coaching.frontend.modifiedby = 0;
                                          }
                                        }
                                        if(langId){
                                          if((langId == skillTechId) && (langLvl == skillLvl) ){
                                            obj.coaching.backend.modifiedby = skillMark;
                                          }else{
                                            obj.coaching.backend.modifiedby = 0;
                                          }
                                        }
                                        if(dbId){
                                          if((dbId == skillTechId) && (dbLvl == skillLvl) ){
                                            obj.coaching.database.modifiedby = skillMark;
                                          }else{
                                            obj.coaching.database.modifiedby = 0;
                                          }
                                        }

                                      }
                                    }
                                }
                            )
                        },

                        error => {
                            console.log(error);
                        }
                    );

                    this.coachingService.getCoachingAct(this.id).subscribe(
                        data => {

                            this.aktiviti = data;
                            for (var i = 0; i < this.aktiviti.length; ++i) {


                                let ngbDate = this.aktiviti[i].start_date;
                                var dateA = new Date(ngbDate)

                                let ngbDate2 = this.aktiviti[i].end_date;
                                var dateB = new Date(ngbDate2);

                                if(this.aktiviti[i].attendance == "Ada"){
                                    this.jumlahManday = this.jumlahManday + Number(this.aktiviti[i].duration);
                                }


                                this.activities.push({
                                        name: this.aktiviti[i].name,
                                        place: this.aktiviti[i].venue,
                                        start: dateA,
                                        endo: dateB,
                                        attendance: this.aktiviti[i].attendance,
                                        duration: this.aktiviti[i].duration,
                                        kelulusan: this.aktiviti[i].kelulusan

                                })

                                this.newLs.push({
                                    id: this.aktiviti[i].id,
                                    name: this.aktiviti[i].name,
                                    place: this.aktiviti[i].venue,
                                    start: dateA,
                                    endo: dateB,
                                    attendance: this.aktiviti[i].attendance,
                                    duration: this.aktiviti[i].duration
                                })

                                this.oldLs.push({
                                    id: this.aktiviti[i].id,
                                    name: this.aktiviti[i].name,
                                    place: this.aktiviti[i].venue,
                                    start: dateA,
                                    endo: dateB,
                                    attendance: this.aktiviti[i].attendance,
                                    duration: this.aktiviti[i].duration
                                })
                            }
                        }
                    )
                }
    		}
    	);
    }

    formatDate(date){
        var datemagic = new Date(date);
        var day = datemagic.getDate();
        var month = datemagic.getMonth()+1;
        var year = datemagic.getFullYear();
        return day + '/' + month + '/' + year;
    }


    deleteFn(index){
        if(this.activities[index].attendance == "Ada"){
            this.jumlahManday = this.jumlahManday - Number(this.activities[index].duration);
        }

        this.activities.splice(index, 1);
        this.newLs.splice(index, 1);
    }

    calcBusinessDays(dDate1, dDate2) { // input given as Date objects
        var iWeeks, iDateDiff, iAdjust = 0;
        if (dDate2 < dDate1) return -1; // error code if dates transposed
        var iWeekday1 = dDate1.getDay(); // day of week
        var iWeekday2 = dDate2.getDay();
        iWeekday1 = (iWeekday1 == 0) ? 7 : iWeekday1; // change Sunday from 0 to 7
        iWeekday2 = (iWeekday2 == 0) ? 7 : iWeekday2;
        if ((iWeekday1 > 5) && (iWeekday2 > 5)) iAdjust = 1; // adjustment if both days on weekend
        iWeekday1 = (iWeekday1 > 5) ? 5 : iWeekday1; // only count weekdays
        iWeekday2 = (iWeekday2 > 5) ? 5 : iWeekday2;

        // calculate differnece in weeks (1000mS * 60sec * 60min * 24hrs * 7 days = 604800000)
        iWeeks = Math.floor((dDate2.getTime() - dDate1.getTime()) / 604800000)

        if (iWeekday1 <= iWeekday2) {
          iDateDiff = (iWeeks * 5) + (iWeekday2 - iWeekday1)
        } else {
          iDateDiff = ((iWeeks + 1) * 5) - (iWeekday1 - iWeekday2)
        }

        iDateDiff -= iAdjust // take into account both days on weekend

        return (iDateDiff + 1); // add 1 because dates are inclusive
      }

    newAct(){

        var form = $('#activityForm');

         form.validate({
           rules:{
             start: "required",
             endo: "required"
           }
        });

        if(!form.valid()){
            return false;
        }else{
                if(this.activityForm.valid){

                //To Calculate Tempoh

                let ngbDate = this.activityForm.controls['start'].value;
                let date = new Date(ngbDate.year, ngbDate.month-1, ngbDate.day);
                let ngbDate2 = this.activityForm.controls['endo'].value;
                let date2 = new Date(ngbDate2.year, ngbDate2.month-1, ngbDate2.day);

                var dateone = new Date(date);
                var datetwo = new Date(date2);

                var tempohan = Math.round(this.calcBusinessDays(dateone,datetwo));

                if(this.activityForm.controls['attendance'].value == "Ada"){
                    this.jumlahManday = this.jumlahManday + Number(tempohan);
                }

                this.activities.push({
                    name: this.activityForm.controls['name'].value,
                    place: this.activityForm.controls['place'].value,
                    start: date,
                    endo: date2,
                    attendance: this.activityForm.controls['attendance'].value,
                    duration: tempohan,
                    kelulusan: "1"
                })

                this.newLs.push({
                    id: null,
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

    ngOnDestroy(): void{
    	this.sub.unsubscribe();
    }

    tambah(){
        this.activityForm.reset();
        $("#m_modal_1").modal("show");
        var startDate = new Date(this.coaching.starting_date);
        var endDate = new Date(this.coaching.ending_date);
        this.minDate = {year: startDate.getFullYear(), month: startDate.getMonth()+1, day: startDate.getDate()};
        this.maxDate = {year: endDate.getFullYear(), month: endDate.getMonth()+1, day: endDate.getDate()};
        this.minDate2 = {year: startDate.getFullYear(), month: startDate.getMonth()+1, day: startDate.getDate()};
        this.maxDate2 = {year: endDate.getFullYear(), month: endDate.getMonth()+1, day: endDate.getDate()};
    }

    onChange3(value){
        if(value==null){
            this.minDate2 = this.minDate2;
        }else{
            this.minDate2 = value;
        }
    }

    onChange4(value){
        if(value==null){
            this.maxDate2 = this.maxDate2;
        }else{
            this.maxDate2 = value;
        }
    }

    ngAfterViewInit() {
    	this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
             'assets/osdec/validation/coaching/coaching-approval.js',
             'assets/osdec/validation/validation.js');
    }

    simpan(){

        if (this.id){

            var usedManday = Number(this.jumlahManday);
            if(usedManday>this.reservedManday){
                $("#m_modal_used").modal("show");
            }else{
                for (var i = 0; i < this.newLs.length; ++i) {
                    if(this.newLs[i].id == null){
                        let coachingActivity: CoachingActivity = new CoachingActivity(
                            this.newLs[i].name,
                            this.newLs[i].attendance,
                            this.newLs[i].place,
                            this.newLs[i].duration,
                            this.newLs[i].start,
                            this.newLs[i].endo,
                            this.coaching,
                            '1',
                            null,
                            null,
                            null, null
                            )

                        this.coachingService.createActivity(coachingActivity).subscribe();
                    }
                    else{
                        for (var j = 0; j < this.oldLs.length; ++j) {
                            if(this.newLs[i].id == this.oldLs[j].id){
                                this.oldLs.splice(j, 1);

                            }
                        }
                    }
                }

                for (var i = 0; i < this.oldLs.length; ++i) {
                    this.coachingService.deleteCoachingAct(this.oldLs[i].id).subscribe();
                }

                this.isEditable = true;
                this.loading = false;
                toastr.success(this.message.success);
                this.redirectListPage();
            }
        }
    }

    onSubmit(){

    }

    redirectListPage() {
      this.router.navigate(['/coaching/list/coach']);
    }

    downloadFile(storageObj){
      var data = this.base64ToArrayBuffer(storageObj.content);

      var blob = new Blob([data]);
      var url= window.URL.createObjectURL(blob);
      window.open(url);
    }

    base64ToArrayBuffer(base64) {
      var binaryString = window.atob(base64);
      var binaryLen = binaryString.length;
      var bytes = new Uint8Array(binaryLen);
      for (var i = 0; i < binaryLen; i++) {
         var ascii = binaryString.charCodeAt(i);
         bytes[i] = ascii;
      }
      return bytes;
   }

}
