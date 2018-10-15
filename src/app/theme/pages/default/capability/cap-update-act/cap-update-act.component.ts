import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";

import { Capability } from '../../../../../model/capability/capability';
import { CapabilityService } from '../../../../../services/capability/capability.service';
import { CapabilityActivity } from '../../../../../model/capability/capabilityActivity';
import { NgbDatepickerConfig, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateFRParserFormatter } from "../../../../../_directives/ngb-date-fr-parser-formatter";

declare var $: any;
declare let toastr:any;
@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./cap-update-act.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [CapabilityService, {provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class CapUpdateActComponent implements OnInit, AfterViewInit, OnDestroy {
    model;
    minDate: NgbDateStruct = {year: 1950, month: 1, day: 1};
    maxDate: NgbDateStruct = {year: 2099, month: 12, day: 31};
    minDate2: NgbDateStruct = {year: 1950, month: 1, day: 1};
    maxDate2: NgbDateStruct = {year: 2099, month: 12, day: 31};

    loading: boolean = false;
    isEditable = false;
    message: any = {
      success: "Maklumat Telah Berjaya Dikemaskini"
    }

    capObj : Capability;
    capForm: FormGroup;
    activityForm : FormGroup;
    id: string;
    user: any;
    bearToken : string;
    coachLs: any[];
    currentCoach: any;
    tempCapid: string;
    actLs: any[];
    currentAct: any;
    private activities = [];
    private sub : any;
    private oldLs = [];
    private newLs = [];
    constructor(
        private _script: ScriptLoaderService,
        private capabilityService:CapabilityService,
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


    ngOnInit() {
        this.bearToken = "Bearer "+localStorage.getItem('jwtToken');

        this.capForm = new FormGroup({
            name: new FormControl({value: '', disabled: true}, Validators.required),
            kepakaran: new FormControl({value: '', disabled: true}, Validators.required),
            duration: new FormControl({value: '', disabled: true}, Validators.required),
            start_date: new FormControl({value: '', disabled: true}, Validators.required),
            end_date: new FormControl({value: '', disabled: true}, Validators.required),
            remarks: new FormControl({value: '', disabled: true}, Validators.required)
        })
        this.activityForm = new FormGroup (
            {
                name: new FormControl('', Validators.required),
                venue: new FormControl('', Validators.required),
                start: new FormControl('', Validators.required),
                endo: new FormControl('', Validators.required),
                attendance: new FormControl('', Validators.required)
            }
        )

        this.sub = this.route.params.subscribe(
            params => {
                this.id = params['id'];

                if (this.id){
                    this.capabilityService.getCapabilityById(this.id).subscribe(
                        data=>{
                            var startDate = new Date(data.starting_date);
                            var endDate = new Date(data.ending_date);
                            this.minDate = {year: startDate.getFullYear(), month: startDate.getMonth()+1, day: startDate.getDate()};
                            this.maxDate = {year: endDate.getFullYear(), month: endDate.getMonth()+1, day: endDate.getDate()};

                            this.tempCapid = data.id;
                            this.capObj = data;
                            this.capForm.patchValue({
                                name: data.name,
                                kepakaran: data.kepakaran.name,
                                duration: data.duration,
                                start_date: this.formatDate(startDate),
                                end_date: this.formatDate(endDate),
                                remarks: data.remarks
                            })
                            this.capabilityService.getCapabilityCoach(this.tempCapid).subscribe(
                                temp => {
                                    this.currentCoach = temp;
                                }
                            )

                            this.capabilityService.getCapabilityAct(this.id).subscribe(
                                data => {
                                    this.currentAct = data;

                                    for (var i = 0; i < this.currentAct.length; ++i) {

                                        let ngbDate = this.currentAct[i].start_date;
                                        var dateA = new Date(ngbDate)

                                        let ngbDate2 = this.currentAct[i].end_date;
                                        var dateB = new Date(ngbDate2);

                                        this.activities.push({
                                            name: this.currentAct[i].name,
                                            venue: this.currentAct[i].venue,
                                            start: dateA,
                                            endo: dateB,
                                            attendance: this.currentAct[i].attendance,
                                            duration: this.currentAct[i].duration
                                        })
                                        this.newLs.push({
                                            id: this.currentAct[i].id,
                                            name: this.currentAct[i].name,
                                            venue: this.currentAct[i].venue,
                                            start: dateA,
                                            endo: dateB,
                                            attendance: this.currentAct[i].attendance,
                                            duration: this.currentAct[i].duration
                                        })

                                        this.oldLs.push({
                                            id: this.currentAct[i].id,
                                            name: this.currentAct[i].name,
                                            venue: this.currentAct[i].venue,
                                            start: dateA,
                                            endo: dateB,
                                            attendance: this.currentAct[i].attendance,
                                            duration: this.currentAct[i].duration
                                        })
                                    }
                                }
                            )
                        }
                    )
                }
            }
        )
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

    formatDate(date){
        var datemagic = new Date(date);
        var day = datemagic.getDate();
        var month = datemagic.getMonth()+1;
        var year = datemagic.getFullYear();
        return day + '/' + month + '/' + year;
    }
    ngAfterViewInit() {
        this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
            'assets/osdec/validation/cap/cap-val.js',
            'assets/osdec/validation/validation.js');

    }

    onSubmit(){


            if(this.id){

                for (var i = 0; i < this.newLs.length; ++i) {
                    if(this.newLs[i].id == null){
                        let capabilityActivity: CapabilityActivity = new CapabilityActivity(
                            this.newLs[i].name,
                            this.newLs[i].attendance,
                            this.newLs[i].venue,
                            this.newLs[i].duration,
                            this.newLs[i].start,
                            this.newLs[i].endo,
                            this.capObj,
                            null,
                            null,null,null
                            )
                        this.capabilityService.createAct(capabilityActivity).subscribe();
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
                    this.capabilityService.deleteCapabilityAct(this.oldLs[i].id).subscribe();
                }

                this.isEditable = true;
                this.loading = false;
                toastr.success(this.message.success);
                this.redirectCapPage()
            }



    }

    redirectCapPage(){
        this.router.navigate(['/cap/list/coach']);
    }

    ngOnDestroy(): void{
        this.sub.unsubscribe();
    }

    deleteFn(index){
        this.activities.splice(index, 1);
        this.newLs.splice(index, 1);
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

                this.activities.push({
                    name: this.activityForm.controls['name'].value,
                    venue: this.activityForm.controls['venue'].value,
                    start: date,
                    endo: date2,
                    attendance: this.activityForm.controls['attendance'].value,
                    duration: tempohan
                })

                this.newLs.push({
                    id: null,
                    name: this.activityForm.controls['name'].value,
                    venue: this.activityForm.controls['venue'].value,
                    start: date,
                    endo: date2,
                    attendance: this.activityForm.controls['attendance'].value,
                    duration: tempohan
                })

                this.activityForm.reset();
                $("#m_modal_2").modal("hide");

            }
        }
    }

    tambah(){
        this.activityForm.reset();
        $("#m_modal_2").modal("show");
        var startDate = new Date(this.capObj.starting_date);
        var endDate = new Date(this.capObj.ending_date);
        this.minDate = {year: startDate.getFullYear(), month: startDate.getMonth()+1, day: startDate.getDate()};
        this.maxDate = {year: endDate.getFullYear(), month: endDate.getMonth()+1, day: endDate.getDate()};
        this.minDate2 = {year: startDate.getFullYear(), month: startDate.getMonth()+1, day: startDate.getDate()};
        this.maxDate2 = {year: endDate.getFullYear(), month: endDate.getMonth()+1, day: endDate.getDate()};
    }

}
