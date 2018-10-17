import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from "../../../../../../environments/environment";
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { User } from '../../../../../model/user';
import { Attendance } from '../../../../../model/attendance/attendance';
import { UserService } from '../../../../../services/user.service';
import { AttendanceService } from '../../../../../services/attendance/attendance.service';
import { CapabilityService } from '../../../../../services/capability/capability.service';
import { CapabilityActivity } from '../../../../../model/capability/capabilityActivity';
import { KeygenService } from '../../../../../services/keygen.service';
import { Keygen } from '../../../../../model/keygen';

declare let $: any;
declare let moment: any;
declare let toastr: any;

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./cap-coachAttendance.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [UserService, CapabilityService, AttendanceService, KeygenService]
})
export class CapCoachAttendanceComponent implements OnInit, AfterViewInit {

    kehadiran: boolean = false;
    id: string;
    userObj: any;
    fullCalendar: any;
    bearToken: string;
    private sub: any;
    userid: string;
    attForm: FormGroup;
    attendanceObj: any[];
    loading: boolean = false;
    isEditable = false;

    user: any;
    key: any;
    tamat: any;

    message: any = {
        danger: "Kehadiran Telah Wujud",
        success: "Kehadiran Telah Disimpan"
    }


    constructor(private _script: ScriptLoaderService, private keygenService: KeygenService, private userService: UserService, private capabilityService: CapabilityService, private attendanceService: AttendanceService, private router: Router, private route: ActivatedRoute) {

    }
    ngOnInit() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.userid = currentUser.id;
        this.user = currentUser;
        localStorage.setItem('userIdAttendance', this.userid);

        this.bearToken = "Bearer " + localStorage.getItem('jwtToken');
        this.sub = this.route.params.subscribe(
            params => {
                this.id = params['id'];
                localStorage.setItem('tokenId', this.id);
                let currentUser = JSON.parse(localStorage.getItem('currentUser'));
                this.userid = currentUser.id;
                this.userService.getUserById(this.userid).subscribe(
                    data => {
                        this.userObj = data;

                    }
                )
            }
        )

        this.attForm = new FormGroup({
            attendance: new FormControl(),
            date: new FormControl({ value: '', disabled: true }, Validators.required),
            name: new FormControl({ value: '', disabled: true }, Validators.required)

        })
    }
    ngAfterViewInit() {
        var CalendarBackgroundEvents = {
            init: function() {

                $("#m_calendar2").fullCalendar({

                    buttonText: {
                        today: 'Hari Ini',
                        month: 'Bulan',
                        week: 'Minggu',
                        day: 'Hari',
                        list: 'Senarai'
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
                            url: environment.hostname + "/api/capActivities/all/" + localStorage.getItem('tokenId') + "/" + localStorage.getItem('userIdAttendance'),
                            headers: {
                                "Authorization": "Bearer " + localStorage.getItem('jwtToken')
                            },
                            type: 'POST'
                        },
                        {
                            url: environment.hostname + "/api/capActivities2/all/" + localStorage.getItem('tokenId') + "/" + localStorage.getItem('userIdAttendance'),
                            headers: {
                                "Authorization": "Bearer " + localStorage.getItem('jwtToken')
                            },
                            type: 'POST'
                        }



                    ],

                    eventRender: function(event, element) {
                        if (moment(event.start).isoWeekday() == 7 || moment(event.start).isoWeekday() == 6) {
                            return false;
                        }
                        element.attr('href', 'javascript:void(0);');

                        element.click(function() {

                            if (event.isExist) {

                                $("#m_modal_hadir").modal("show");

                            } else {

                                if (event.attendance == "Tiada") {
                                    $("#eventTitle2").attr('value', event.title);
                                    $("#eventVenue2").attr('placeholder', event.description);
                                    $("#eventDate2").attr('value', moment(event.start).format('DD/MM/YYYY'));
                                    $("#m_modal_2").modal("show");
                                } else {

                                    $("#eventTitle").attr('placeholder', event.title);
                                    $("#eventTitle").attr('value', event.id);
                                    $("#eventVenue").attr('placeholder', event.description);
                                    $("#eventDate").attr('placeholder', moment(event.start).format('DD/MM/YYYY'));
                                    $("#eventDate").attr('value', event.start);
                                    $("#m_modal_1").modal("show");

                                }
                            }
                        });
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

        jQuery(document).ready(function() {
            CalendarBackgroundEvents.init()
        });
    }

    generate() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }


    onSubmit() {
        var form = $('#attForm');

        form.validate({
            rules: {
                keygen: "required"
            }
        });

        if (!form.valid) {
            return false;
        } else {
            if (this.attForm.valid) {
                var dateEvent = $('#eventDate').attr('value');
                var idEvent = $('#eventTitle').attr('value');

                let attendance: Attendance = new Attendance(
                    this.user,
                    null,
                    null,
                    idEvent,
                    "capability-coach",
                    dateEvent,
                    null
                )

                this.attendanceService.createAttendance(attendance).subscribe(
                    success => {
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
        }
    }

    keygen() {

        this.keygenService.isExist(this.id).subscribe(
            data => {

                if (data == true) {
                    this.keygenService.getKeygenByInstanceId(this.id).subscribe(
                        key => {
                            this.key = key.keygen;
                            this.tamat = key.expiredDate;
                            $("#keygen_exist").modal("show");
                        }
                    )

                } else {

                    let key = this.generate();

                    let keygen: Keygen = new Keygen(
                        null,
                        this.id,
                        key,
                        null,
                        null
                    )
                    this.keygenService.createKeygen(keygen).subscribe(
                        success => {
                            this.keygenService.getKeygenByInstanceId(this.id).subscribe(
                                key => {
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

    redirectFeedback() {
        this.router.navigate(['/cap/feedback', this.id]);
    }

    redirectInfo() {
        this.router.navigate(['/cap/info', this.id]);
    }

}
