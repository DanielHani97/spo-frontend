import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from "../../../../../../environments/environment";
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { CoachingService } from '../../../../../services/coaching/coaching.service';
import { CoachingActivity } from '../../../../../model/coaching/coachingActivity';
import { UserService } from '../../../../../services/user.service';
import { Manday } from '../../../../../model/setup/manday';
import { MandayTransaction } from '../../../../../model/setup/mandayTransaction';
import { MandayService } from '../../../../../services/setup/manday.service';
import { AttendanceService } from '../../../../../services/attendance/attendance.service';
import { Attendance } from '../../../../../model/attendance/attendance';
import { KeygenService } from '../../../../../services/keygen.service';
import { Keygen } from '../../../../../model/keygen';

declare let $:any;
declare let moment:any;
declare let toastr:any;

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./coaching-update-attendance.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [CoachingService, UserService, MandayService, AttendanceService, KeygenService]
})
export class CoachingUpdateAttendanceComponent implements OnInit, AfterViewInit {

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
    manday: any[];
    manday2: any[];
    mandayObj: any;
    usedManday: number;
    user: any;

    key: any;
    tamat: any;

    message: any = {
          danger: "Kehadiran Telah Wujud",
          success: "Kehadiran Telah Disimpan"
        }

    constructor(
        private _script: ScriptLoaderService,
        private mandayService: MandayService,
        private keygenService: KeygenService,
        private userService: UserService,
        private attendanceService: AttendanceService,
        private coachingService: CoachingService,
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

        this.mandayService.getManday().subscribe(
            data => {
                this.manday = data;
                this.manday2= this.manday.filter(value =>value.category==='coaching');
                this.mandayObj = this.manday2[0];
                this.usedManday = this.mandayObj.mandayUsed;
            }
        );

        this.attForm = new FormGroup({
            attendance: new FormControl(),
            date: new FormControl({value: '', disabled: true}, Validators.required),
            name: new FormControl({value: '', disabled: true}, Validators.required)

        })
    }

    ngAfterViewInit() {
        this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
            'assets/osdec/validation/coaching/coaching-attendance.js',
             'assets/osdec/validation/validation.js');

        var CalendarBackgroundEvents = {
            init: function () {

                $("#m_calendar_coach").fullCalendar({

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

                                    if(event.attendance == "Tiada"){
                                        $("#eventTitle2").attr('value', event.title);
                                        $("#eventVenue2").attr('placeholder', event.description);
                                        $("#eventDate2").attr('value', moment(event.start).format('DD/MM/YYYY'));
                                        $("#m_modal_2").modal("show");
                                    }else{
                                        if(event.isExist){
                                            $("#eventTitle3").attr('value', event.title);
                                            $("#eventVenue3").attr('placeholder', event.description);
                                            $("#eventDate3").attr('value', moment(event.start).format('DD/MM/YYYY'));
                                            $("#m_modal_3").modal("show");
                                        }else{
                                            $("#eventTitle").attr('placeholder', event.title);
                                            $("#eventTitle").attr('value', event.id);
                                            $("#eventVenue").attr('placeholder', event.description);
                                            $("#eventDate").attr('placeholder', moment(event.start).format('DD/MM/YYYY'));
                                            $("#eventDate").attr('value', event.start);

                                            $("#m_modal_1").modal("show");
                                        }

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

    generate(){
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++){
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }
    
    onSubmit(){
    
        if(this.attForm.valid){
            var dateEvent = $('#eventDate').attr('value');
            var idEvent = $('#eventTitle').attr('value');
            var checker = "no";
            var mandayTxId = "";

            let attendance : Attendance = new Attendance (
                this.user,
                null,
                null,
                idEvent,
                "coaching-coach",
                dateEvent,
                null
            )
            this.attendanceService.createAttendance(attendance).subscribe(
                success=>{
                    this.mandayService.getMandayTrans().subscribe(
                        data=>{
                            this.attendanceObj = data;
                            for (var i = 0; i < this.attendanceObj.length; ++i) {
                                if(this.attendanceObj[i].instanceId == idEvent && this.attendanceObj[i].instanceDate == dateEvent) {
                                    checker = "yes";
                                    mandayTxId = this.attendanceObj[i].id;
                                }
                            }

                            if(checker == "no"){
                                let mandayTx: MandayTransaction = new MandayTransaction(
                                    'Coaching',
                                    idEvent,
                                    1,
                                    null,
                                    dateEvent
                                )

                                this.usedManday = this.usedManday +1;

                                this.mandayService.createMandayTrans(mandayTx).subscribe(
                                    success=>{
                                        let manday: Manday = new Manday(
                                            null,
                                            null,
                                            this.usedManday,
                                            null,
                                            this.mandayObj.id
                                        )
                                        this.mandayService.updateMandayUsed(manday).subscribe(
                                            success=>{

                                                this.isEditable = true;
                                                this.loading = false;
                                                toastr.success(this.message.success);
                                                this.attForm.reset();
                                                $("#m_modal_1").modal("hide");
                                                window.location.reload();
                                                $("m_calendar").fullCalendar('refetchEvents');
                                                $("m_calendar").fullCalendar('rerenderEvents');
                                                    
                                                
                                            }
                                        )
                                    }
                                )
                            }else{

                                this.mandayService.updateCoachingManday(mandayTxId).subscribe(
                                    success=>{
                                        this.usedManday = this.usedManday +1;
                                        let manday: Manday = new Manday(
                                            null,
                                            null,
                                            this.usedManday,
                                            null,
                                            this.mandayObj.id
                                        )
                                        this.mandayService.updateMandayUsed(manday).subscribe(
                                            success=>{

                                                this.isEditable = true;
                                                this.loading = false;
                                                toastr.success(this.message.success);
                                                this.attForm.reset();
                                                $("#m_modal_1").modal("hide");
                                                window.location.reload();
                                                $("m_calendar").fullCalendar('refetchEvents');
                                                $("m_calendar").fullCalendar('rerenderEvents');
                                                    
                                                
                                            }
                                        )
                                    }
                                )
                            }
                        }
                    )
                }
            )
        }
        
    }

    keygen(){

        this.keygenService.isExist(this.id).subscribe(
            data=>{

                if (data == true){
                    this.keygenService.getKeygenByInstanceId(this.id).subscribe(
                        key=>{
                            this.key = key.keygen;
                            this.tamat = key.expiredDate;
                            $("#keygen_exist").modal("show");
                        }
                    )
                
                }else{

                    let key = this.generate();

                    let keygen: Keygen = new Keygen(
                        null,
                        this.id,
                        key,
                        null,
                        null
                    )
                    this.keygenService.createKeygen(keygen).subscribe(
                        success=>{
                            this.keygenService.getKeygenByInstanceId(this.id).subscribe(
                                key=>{
                                    this.key = key.keygen;
                                    this.tamat = key.expiredDate;
                                    $("#keygen_exist").modal("show");
                                }
                            )
                        }
                    )
                }
            }
        )
    }

    redirectFeedback(){
      this.router.navigate(['/coaching/feedback', this.id]);
    }

    redirectInfo(){
      this.router.navigate(['/coaching/info', this.id]);
    }

}
