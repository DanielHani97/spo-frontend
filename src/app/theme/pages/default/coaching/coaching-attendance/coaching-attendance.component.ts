import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from "../../../../../../environments/environment";
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { User } from '../../../../../model/user';
import { Attendance } from '../../../../../model/attendance/attendance';
import { UserService } from '../../../../../services/user.service';
import { CoachingService } from '../../../../../services/coaching/coaching.service';
import { AttendanceService } from '../../../../../services/attendance/attendance.service';
import { KeygenService } from '../../../../../services/keygen.service';
import { Keygen } from '../../../../../model/keygen';

declare let $:any;
declare let moment:any;
declare let toastr:any;

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./coaching-attendance.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [UserService, AttendanceService, CoachingService, KeygenService]
})
export class CoachingAttendanceComponent implements OnInit, AfterViewInit {
    kehadiran: boolean = false;
    id: string;
    userObj: any;
    fullCalendar : any;
    bearToken : string;
    private sub: any;
    userid: string;
    attForm: FormGroup;
    attendanceObj: any[];
    loading: boolean = false;
    isEditable = false;
    user: any;

    message: any = {
          danger: "Kehadiran Telah Wujud",
          success: "Kehadiran Telah Disimpan"
        }

    constructor(
        private _script: ScriptLoaderService,
        private coachingService: CoachingService,
        private userService:UserService,
        private attendanceService:AttendanceService,
        private keygenService: KeygenService,
        private router:Router,
        private route: ActivatedRoute) {

    }
    ngOnInit() {

        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.userid = currentUser.id;
        this.user = currentUser;
        localStorage.setItem('userIdAttendance', this.userid);

        this.bearToken = "Bearer "+localStorage.getItem('jwtToken');
        this.sub = this.route.params.subscribe(
            params => {
                this.id = params['id'];
                localStorage.setItem('tokenId', this.id);
                let currentUser = JSON.parse(localStorage.getItem('currentUser'));
                this.userid = currentUser.id;
                this.userService.getUserById(this.userid).subscribe(
                    data=>{
                        this.userObj = data;
                    }
                )
            }
        )

        this.attForm = new FormGroup({
            remarks: new FormControl('', Validators.required),
            attendance: new FormControl(),
            kodKehadiran: new FormControl(),
            date: new FormControl({value: '', disabled: true}, Validators.required),
            name: new FormControl({value: '', disabled: true}, Validators.required)

        })

    }
    ngAfterViewInit() {
        this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
            'assets/osdec/validation/coaching/coaching-attendance2.js',
             'assets/osdec/validation/validation.js');

        var CalendarBackgroundEvents = {
            init: function () {

                $("#m_calendar").fullCalendar({

                        buttonText: {
                            today:    'Hari Ini',
                            month:    'Bulan',
                            week:     'Minggu',
                            day:      'Hari',
                            list:     'Senarai'
                        },

                        weekends: false,

                        dayNamesShort: ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'],

                        dayNames: ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'],

                        header: {
                            left: "prev,next today",
                            center: "title",
                            right: "month,agendaWeek,agendaDay,listWeek"
                        },
                        editable: !0,
                        eventLimit: !0,
                        navLinks: !0,
                        businessHours: !0,
                        eventSources: [


                            {
                                url: environment.hostname+"/api/coachingActivities/all/"+localStorage.getItem('tokenId')+"/"+localStorage.getItem('userIdAttendance'),
                                headers: {
                                    "Authorization": "Bearer "+localStorage.getItem('jwtToken')
                                },
                                type: 'GET'
                            },
                            {
                                url: environment.hostname+"/api/coachingActivities/all2/"+localStorage.getItem('tokenId')+"/"+localStorage.getItem('userIdAttendance'),
                                headers: {
                                    "Authorization": "Bearer "+localStorage.getItem('jwtToken')
                                },
                                type: 'GET'
                            }



                        ],

                        eventRender: function (event, element) {

                            if(moment(event.start).isoWeekday() == 7||moment(event.start).isoWeekday() == 6)
                            {
                                return false;
                            }

                            element.attr('href', 'javascript:void(0);');

                                element.click(function() {
                                    if(event.isExist){

                                        $("#m_modal_hadir").modal("show");

                                    }else{
                                        $("#eventTitle").attr('placeholder', event.title);
                                        $("#eventTitle").attr('value', event.id);
                                        $("#eventVenue").attr('placeholder', event.description);
                                        $("#eventDate").attr('placeholder', moment(event.start).format('DD/MM/YYYY'));
                                        $("#eventDate").attr('value', event.start);

                                        if(event.attendance == "Tiada") {
                                            $("#kodKehadiran").attr('style', "display: none;");
                                            $("#eventSah").attr('style', "display: none;");
                                            $("#eventSah1").attr('required', "false");
                                            $("#eventSah2").attr('required', "false");
                                        }
                                        else{
                                            $("#kodKehadiran").attr('style', "display: flex;");
                                            $("#eventSah").attr('style', "display: flex;");
                                            $("#eventSah1").attr('required', "true");
                                            $("#eventSah2").attr('required', "true");
                                        }
                                        $("#m_modal_1").modal("show");
                                    }
                                }
                            );
                        }
                        /*eventRender: function (e, t) {
                            t.hasClass("fc-day-grid-event") ? (t.data("content", e.description), t.data("placement", "top"), mApp.initPopover(t)) : t.hasClass(
                                    "fc-time-grid-event") ? t.find(".fc-title")
                                .append('<div class="fc-description">' + e.description + "</div>") : 0 !== t.find(".fc-list-item-title")
                                .lenght && t.find(".fc-list-item-title")
                                .append('<div class="fc-description">' + e.description + "</div>")
                        }*/
                    })
            }
        };

        jQuery(document).ready(function () {
                CalendarBackgroundEvents.init()
            });
    }

    open(){
        this.kehadiran=true;
    }

    close(){
        this.kehadiran=false;
    }

    closeModal(){
        this.attForm.reset();

        this.kehadiran=false;
        $("#m_modal_1").modal("hide");
    }
    onSubmit(){
        var form = $('#attForm');

         form.validate({
           rules:{
             remarks: "required"
           }
        });

        if(!form.valid){
            return false;
        }else{
            if(this.attForm.valid){
                var dateEvent = $('#eventDate').attr('value');
                var idEvent = $('#eventTitle').attr('value');
                var idTitle = $('#eventTitle').attr('placeholder');

                let attendance : Attendance = new Attendance (
                    this.user,
                    null,
                    null,
                    idEvent,
                    null,
                    dateEvent,
                    null
                )
                if(this.kehadiran==true){
                    this.coachingService.getCoachingActivityById(idEvent).subscribe(
                        data=>{

                            this.keygenService.getKeygenByInstanceId(this.id).subscribe(
                                data=>{
                                    var keygen = data.keygen;
                                    if(this.attForm.controls['kodKehadiran'].value===keygen){
                                        
                                        let attendance: Attendance = new Attendance (
                                            this.userObj,
                                            this.attForm.controls['attendance'].value,
                                            this.attForm.controls['remarks'].value,
                                            idEvent,
                                            "Coaching",
                                            dateEvent,
                                            null
                                        )
                                        this.attendanceService.createAttendance(attendance).subscribe(
                                            success=>{
                                                this.isEditable = true;
                                                this.loading = false;
                                                toastr.success(this.message.success);
                                                this.kehadiran = false;
                                                this.attForm.reset();
                                                $("#m_modal_1").modal("hide");
                                                window.location.reload();
                                                $("m_calendar").fullCalendar('refetchEvents');
                                                $("m_calendar").fullCalendar('rerenderEvents');
                                            }
                                        );
                                    }else{
                                        this.attForm.reset();
                                        this.kehadiran = false;
                                        $("#m_modal_1").modal("hide");
                                        $("#m_modal_code").modal("show");
                                    }
                                },
                                errorCode=>{
                                    this.attForm.reset();
                                    this.kehadiran = false;
                                    $("#m_modal_1").modal("hide");
                                    $("#m_modal_code").modal("show");
                                }
                            )

                            
                        }
                    );
                    
                }else{
                    
                    let attendance: Attendance = new Attendance (
                        this.userObj,
                        this.attForm.controls['attendance'].value,
                        this.attForm.controls['remarks'].value,
                        idEvent,
                        "Coaching",
                        dateEvent,
                        null
                    )
                    this.attendanceService.createAttendance(attendance).subscribe(
                        success=>{
                            this.isEditable = true;
                            this.loading = false;
                            toastr.success(this.message.success);
                            this.kehadiran = false;
                            this.attForm.reset();
                            $("#m_modal_1").modal("hide");
                            window.location.reload();
                            $("m_calendar").fullCalendar('refetchEvents');
                            $("m_calendar").fullCalendar('rerenderEvents');
                        }
                    );                    
                }
                    
            }
        }
    }

    redirectInfo(){
      this.router.navigate(['/coaching/info', this.id]);
    }

    redirectFeedback(){
      this.router.navigate(['/coaching/feedback', this.id]);
    }

}
