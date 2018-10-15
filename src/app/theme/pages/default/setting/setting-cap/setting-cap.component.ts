import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";

import { Capability } from '../../../../../model/capability/capability';
import { CapabilityCoach } from '../../../../../model/capability/capabilityCoach';
import { CapabilityActivity } from '../../../../../model/capability/capabilityActivity';
import { CapabilityService } from '../../../../../services/capability/capability.service';
import { Technology } from '../../../../../model/setup/technology';
import { TechnologyService } from '../../../../../services/setup/technology.service';
import { UserService } from '../../../../../services/user.service';

import { NgbDatepickerConfig, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateFRParserFormatter } from "../../../../../_directives/ngb-date-fr-parser-formatter"
import { environment } from "../../../../../../environments/environment";
import { Manday } from '../../../../../model/setup/manday';
import { MandayTransaction } from '../../../../../model/setup/mandayTransaction';
import { MandayService } from '../../../../../services/setup/manday.service';

declare var $: any;
declare let toastr:any;
declare var moment: any;

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./setting-cap.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [CapabilityService, MandayService, TechnologyService, UserService, {provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})

export class SettingCapComponent implements OnInit, AfterViewInit, OnDestroy {
    model;
    minDate: NgbDateStruct = {year: 1950, month: 1, day: 1};
    maxDate: NgbDateStruct = {year: 2099, month: 12, day: 31};

    endMin: NgbDateStruct = {year: 1950, month: 1, day: 1};
    startMax: NgbDateStruct = {year: 2099, month: 12, day: 31};


    minDate2: NgbDateStruct = {year: 1950, month: 1, day: 1};
    maxDate2: NgbDateStruct = {year: 2099, month: 12, day: 31};
    datatable: any;
    mandayObj: any;
    manday: any;
    manday2:any;
    currentUser: any;

    usedManday: number;
    id: string;
    bearToken : string;
    technologies : any[];
    technologies2 : any[];
    currentTechnology : any;
    coachLs: any[];
    currentCoach: any;
    actLs: any[];
    currentAct: any;
    durationCap: any;

    capObj : Capability;
    capTemp : Capability;
    kepakaran : Technology;
    capForm : FormGroup;
    activityForm : FormGroup;
    coachList: String[] = [];

    loading: boolean = false;
    isEditable = false;

    message: any = {
      success: "Maklumat telah berjaya disimpan"
    }

    private sub : any;
    private coachers = [];
    private coachersOld = [];
    private activities = [];
    private oldLs = [];
    private newLs = [];

    constructor(private _script: ScriptLoaderService,
        private userService:UserService,
        private mandayService: MandayService,
        private capabilityService:CapabilityService,
        private technologyService:TechnologyService,
        private router:Router,
        private route: ActivatedRoute,
        private parserFormatter: NgbDateParserFormatter,
        config: NgbDatepickerConfig) {


        // customize default values of datepickers used by this component tree
        //config.minDate = this.minDate;
        //config.maxDate = this.maxDate;

        // days that don't belong to current month are not visible and the space should be collapsed
        config.outsideDays = 'collapsed';
        config.firstDayOfWeek = 7;
        // weekends are disabled
        config.markDisabled = (date: NgbDateStruct) => {
          const d = new Date(date.year, date.month - 1, date.day);
          return d.getDay() === 0 || d.getDay() === 6;
        };
    }

    onChange(value){
        if(value==null){
            this.endMin = this.endMin;
        }else{
            this.endMin = value;
        }
    }

    onChange2(value){
        if(value==null){
            this.startMax = this.startMax;
        }else{
            this.startMax = value;
        }
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
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.currentUser = currentUser.id;

        //capability form
        this.capForm = new FormGroup (
            {
                name: new FormControl('', Validators.required),
                kepakaran: new FormControl('', Validators.required),
                remarks: new FormControl('', Validators.required),
                //limitation: new FormControl('', Validators.required),
                starting_date: new FormControl('', Validators.required),
                ending_date: new FormControl('', Validators.required),
                status: new FormControl('', Validators.required),

            }
        )
        //activity form
        this.activityForm = new FormGroup (
            {
                name: new FormControl('', Validators.required),
                venue: new FormControl('', Validators.required),
                start: new FormControl('', Validators.required),
                endo: new FormControl('', Validators.required),
                attendance: new FormControl('', Validators.required)
            }
        )

        this.mandayService.getManday().subscribe(
           data => {
                this.manday = data;
                this.manday2= this.manday.filter(value =>value.category==='capability');
                this.mandayObj = this.manday2[0];
          }
        );
        //id for update
        this.sub = this.route.params.subscribe(
            params => {
                this.id = params['id'];
                //patch/edit capForm value
                if (this.id){
                    this.capabilityService.getCapabilityById(this.id).subscribe(
                        capability => {
                            this.capObj = capability;
                            this.id = capability.id
                            this.kepakaran = capability.kepakaran;
                            var startDate = new Date(capability.starting_date);
                            var endDate = new Date(capability.ending_date);
                            this.capForm.patchValue(
                                {
                                    name: capability.name,
                                    kepakaran: capability.kepakaran.id,
                                    remarks: capability.remarks,
                                    //limitation: capability.limitation,
                                    starting_date: {year: startDate.getFullYear(), month: startDate.getMonth()+1, day: startDate.getDate()},
                                    ending_date: {year: endDate.getFullYear(), month: endDate.getMonth()+1, day: endDate.getDate()},
                                    status: capability.status
                                }
                            )
                        }
                    )
                    this.capabilityService.getCapabilityCoach(this.id).subscribe(
                        data=>{
                            this.currentCoach = data;
                            for (var i = 0; i < this.currentCoach.length; ++i) {
                                this.coachersOld.push({
                                            id: this.currentCoach[i].id
                                        })
                                this.userService.getUserById(this.currentCoach[i].coach.id).subscribe(
                                    data => {
                                        this.coachList.push(data.id)
                                        this.coachers.push({
                                            id: data.id,
                                            name: data.name,
                                            email: data.email
                                        })


                                    }
                                )
                            }
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
            }
        );

        //for coach list
        this.bearToken = "Bearer "+localStorage.getItem('jwtToken');

        //for technology(kemahiran) list
        this.technologyService.getTechnology().subscribe(
            data => {
                this.technologies2 = data;
                this.technologies = this.technologies2.filter(value=> value.status === '1');
            }
        );

        $(document).on('click', '#m_datatable_check_all', (e) => {
            e.preventDefault();
            let cbArr: any[] = new Array();
            var $cbAnswer = $(".m-datatable__body").find(".m-checkbox > input");

            $cbAnswer.each( function(i) {
                var status = $(this).is(":checked");
                if(status){
                    var id = $(this).val();

                    cbArr.push(id);
                }
            });

            for (var i = 0; i < cbArr.length; ++i) {
                this.onCheckOn(cbArr[i])
            }

            $("#m_modal_1").modal("hide");
        });
    }

    formatDate(date){
        var datemagic = new Date(date);
        var day = datemagic.getDate();
        var month = datemagic.getMonth()+1;
        var year = datemagic.getFullYear();
        return year + '-' + month + '-' + day;
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

    ngAfterViewInit() {
        this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
            'assets/demo/default/custom/components/forms/widgets/bootstrap-datepicker.js',
            'assets/osdec/validation/cap/cap-val.js',
            'assets/osdec/validation/validation.js');
    }

    ngOnDestroy(): void{
    }

    //set technology from list
    setTechnology(id: string){
        this.currentTechnology = this.technologies.filter(value => value.id === id);
        this.kepakaran = this.currentTechnology[0];
    }

    onSubmit(){
        var form = $('#capForm');

         form.validate({
           rules:{
             starting_date: "required",
             ending_date: "required"
           }
        });

        if(!form.valid){
            return false;
        }else{
            if(this.capForm.valid){

                if(this.id){

                    let ngbDate = this.capForm.controls['starting_date'].value;
                    let date = new Date(ngbDate.year, ngbDate.month-1, ngbDate.day);
                    let ngbDate2 = this.capForm.controls['ending_date'].value;
                    let date2 = new Date(ngbDate2.year, ngbDate2.month-1, ngbDate2.day);

                    var dateone = new Date(date);
                    var datetwo = new Date(date2);

                    var tempohan = Math.round(this.calcBusinessDays(dateone,datetwo));

                    this.durationCap = tempohan;


                    let capability : Capability = new Capability (
                        this.capForm.controls['name'].value,
                        this.kepakaran,
                        this.capForm.controls['status'].value,
                        this.capForm.controls['remarks'].value,
                        this.durationCap,
                        null,
                        null,
                        date,
                        date2,
                        null,
                        this.currentUser,
                        this.id,
                    )

                    this.capabilityService.updateCapability(capability).subscribe(
                        success=>{
                            for (var i = 0; i < this.newLs.length; ++i) {
                                if(this.newLs[i].id == null){
                                    console.log("create new instance:", this.newLs[i].name)
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
                                    console.log("created instance:", capabilityActivity)
                                    this.capabilityService.createAct(capabilityActivity).subscribe();
                                }
                                else{
                                    for (var j = 0; j < this.oldLs.length; ++j) {
                                        if(this.newLs[i].id == this.oldLs[j].id){
                                            console.log("no change on instance", this.oldLs[j].name)
                                            this.oldLs.splice(j, 1);

                                        }
                                    }
                                }
                            }

                            for (var i = 0; i < this.oldLs.length; ++i) {
                                console.log("deleted instance from db:", this.oldLs[i].name)
                                this.capabilityService.deleteCapabilityAct(this.oldLs[i].id).subscribe();
                            }
                            for (var j = 0; j < this.coachersOld.length; ++j) {
                               this.capabilityService.deleteCapabilityCoach(this.coachersOld[j].id).subscribe();
                            }
                            for (var i = 0; i < this.coachers.length; ++i) {
                                this.userService.getUserById(this.coachers[i].id).subscribe(
                                  data => {
                                    let capabilityCoach: CapabilityCoach = new CapabilityCoach(
                                      data,
                                      this.capObj,
                                      null)

                                      this.capabilityService.createCoach(capabilityCoach).subscribe();
                                  }
                                );
                            }
                            this.redirectCapPage()
                            this.isEditable = true;
                            this.loading = false;
                            toastr.success(this.message.success);



                        });




                }else{
                    let ngbDate = this.capForm.controls['starting_date'].value;
                    let date = new Date(ngbDate.year, ngbDate.month-1, ngbDate.day);
                    let ngbDate2 = this.capForm.controls['ending_date'].value;
                    let date2 = new Date(ngbDate2.year, ngbDate2.month-1, ngbDate2.day);

                    var dateone = new Date(date);
                    var datetwo = new Date(date2);

                    var tempohan = Math.round(this.calcBusinessDays(dateone,datetwo));
                    this.durationCap = tempohan;

                    let capability : Capability = new Capability (
                        this.capForm.controls['name'].value,
                        this.kepakaran,
                        this.capForm.controls['status'].value,
                        this.capForm.controls['remarks'].value,
                        this.durationCap,
                        null,
                        null,
                        date,
                        date2,
                        this.currentUser,
                        null,
                        null,
                    )

                    this.capabilityService.createCapability(capability).subscribe(
                        data =>{
                            this.capTemp = data;

                            let manday: MandayTransaction = new MandayTransaction (
                                'Capability',
                                this.capTemp.id,
                                1,
                                null,
                                date
                            );

                            this.mandayService.createMandayTrans(manday).subscribe(
                                success=>{
                                    this.usedManday = this.mandayObj.mandayUsed;
                                    this.usedManday = this.usedManday +1;

                                    let manday2: Manday = new Manday (
                                        null,
                                        null,
                                        this.usedManday,
                                        null,
                                        this.mandayObj.id
                                    );

                                    this.mandayService.updateMandayUsed(manday2).subscribe();
                                }
                            )
                            for (var i = 0; i < this.activities.length; ++i) {
                                let capabilityActivity: CapabilityActivity = new CapabilityActivity(
                                    this.activities[i].name,
                                    this.activities[i].attendance,
                                    this.activities[i].venue,
                                    this.activities[i].duration,
                                    this.activities[i].start,
                                    this.activities[i].endo,
                                    this.capTemp,
                                    null,
                                    null,null,null
                                )
                                this.capabilityService.createAct(capabilityActivity).subscribe();
                            }
                            for (var i = 0; i < this.coachers.length; ++i) {
                                this.userService.getUserById(this.coachers[i].id).subscribe(
                                    data =>{
                                        let capCoach : CapabilityCoach = new CapabilityCoach(
                                            data,
                                            this.capTemp,
                                            null
                                        )
                                        this.capabilityService.createCoach(capCoach).subscribe();
                                    }
                                )
                            }

                            this.redirectCapPage()
                            this.isEditable = true;
                            this.loading = false;
                            toastr.success(this.message.success);
                        }
                    )
                }

            }
        }

    }

    redirectCapPage(){
        this.router.navigate(['/capability/listing']);
    }

    //coachers list /api/usergetcoach
    modalCoach(){
        if(this.datatable!=null){
            this.datatable.destroy();
        }
             var options = {
                data: {
                        type: "remote",
                        source: {
                            read: {

                                url: environment.hostname+"/api/usergetcoach",
                                headers: {
                                    "Authorization": this.bearToken
                                },
                                params:{
                                    coachLs: this.coachList
                                }

                            }
                        },
                        pageSize: 10,
                        saveState: {
                            cookie: false,
                            webstorage: false
                        },
                        serverPaging: !0,
                        serverFiltering: !0,
                        serverSorting: !0
                    },
                    layout: {
                        theme: "default",
                        class: "",
                        scroll: !1,
                        height: 550,
                        footer: !1
                    },
                    sortable: !0,
                    pagination: !0,
                    columns: [{
                        field: "id",
                        title: "#",
                        sortable: !1,
                        width: 40,
                        textAlign: "center",
                        template: function(row){
                            return row.user.id;
                           },
                        selector: {
                            class: "m-checkbox--solid m-checkbox--brand checkFn"
                        }
                    }, {
                        field: "name",
                        title: "Nama",
                        sortable: "asc",
                        filterable: !1,
                        width: 150,
                        template: function(row){
                            return row.user.name;
                           }
                    }, {
                        field: "email",
                        title: "Email",
                        width: 150,
                        template: function(row){
                            return row.user.email;
                           }
                    }]
                  }

                let datatable = (<any>$('#api_methods')).mDatatable(options);

                this.datatable = datatable;
                this.datatable.load();

                $("#m_form_search").on("keyup", function(e) {
                    this.datatable.setDataSourceParam("search", $(this).val());
                    this.datatable.load();
                })

               

              $(".m_datatable").on("m-datatable--on-check", function(e, a) {
                  var l = datatable.setSelectedRecords().getSelectedRecords().length;
                  $("#m_datatable_selected_number").html(l), l > 0 && $("#m_datatable_group_action_form").slideDown()
              }).on("m-datatable--on-uncheck m-datatable--on-layout-updated", function(e, a) {
                  var l = datatable.setSelectedRecords().getSelectedRecords().length;
                  $("#m_datatable_selected_number").html(l), 0 === l && $("#m_datatable_group_action_form").slideUp()
              })
    }

    //on add coach button
    onCheckOn(id: string){

        for (var i = 0; i < this.coachers.length; ++i) {
            if(this.coachers[i].id == id){
                this.coachList.splice(i, 1)
                this.coachers.splice(i, 1)
                break;
            }
        }

        this.userService.getUserById(id).subscribe(
            data => {
                this.coachList.push(data.id)
                this.coachers.push({
                    id: data.id,
                    name: data.name,
                    email: data.email
                })
            }
        )
    }

    onCheckOff(index){
      this.coachList.splice(index, 1);
      this.coachers.splice(index, 1);
    }

    deleteAktiviti(index){
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
                    endo: date,
                    attendance: this.activityForm.controls['attendance'].value,
                    duration: tempohan
                })

                this.activityForm.reset();
                $("#m_modal_2").modal("hide");

            }
        }

    }

    tambah(){
        if(this.capForm.controls['starting_date'].value==null||this.capForm.controls['ending_date'].value==null){
            $("#m_modal_date").modal("show");
        }else{
            let ngbDate = this.capForm.controls['starting_date'].value;
            let date = new Date(ngbDate.year, ngbDate.month-1, ngbDate.day);
            let dateA = moment(date, 'YYYY-MM-DD')
            let ngbDate2 = this.capForm.controls['ending_date'].value;
            let date2 = new Date(ngbDate2.year, ngbDate2.month-1, ngbDate2.day);
            let dateB = moment(date2, 'YYYY-MM-DD')
            if((dateA.isValid() && dateB.isValid())&&(ngbDate!=null && ngbDate2!=null)) {
                this.minDate = {year: ngbDate.year, month: ngbDate.month, day: ngbDate.day};
                this.minDate2 = {year: ngbDate.year, month: ngbDate.month, day: ngbDate.day};
                this.maxDate = {year: ngbDate2.year, month: ngbDate2.month, day: ngbDate2.day};
                this.maxDate2 = {year: ngbDate2.year, month: ngbDate2.month, day: ngbDate2.day};
                $("#m_modal_2").modal("show");
            }else{

                $("#m_modal_date").modal("show");
            }
        }


    }
}
