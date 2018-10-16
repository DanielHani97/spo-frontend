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
import { TrainingService } from '../../../../../services/training/training.service';
import { TrainingTx } from '../../../../../model/training/trainingTx';
import { Training } from '../../../../../model/training/training';
import { KeygenService } from '../../../../../services/keygen.service';
import { Keygen } from '../../../../../model/keygen';

declare let $: any;
declare let moment: any;
declare let toastr: any;

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./training-coachAttendance.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [UserService, TrainingService, AttendanceService, KeygenService]
})
export class TrainingCoachAttendanceComponent implements OnInit, AfterViewInit {

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

    message: any = {
        danger: "Kehadiran Telah Wujud",
        success: "Kehadiran Telah Disimpan"
    }
    key: any;
    tamat: any;

    constructor(private _script: ScriptLoaderService, private userService: UserService, private trainingService: TrainingService, private attendanceService: AttendanceService, private keygenService: KeygenService, private router: Router, private route: ActivatedRoute) {

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
                this.trainingService.getTrainingById(this.id).subscribe(
                    data => {
                        this.userObj = data;

                    }
                )
            }
        )

        this.attForm = new FormGroup({
            attendance: new FormControl(),
            startDate: new FormControl({ value: '', disabled: true }, Validators.required),
            title: new FormControl({ value: '', disabled: true }, Validators.required),

        })
    }

    backPage() {
        this.router.navigate(['/training/list/coach/']);
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
                            url: environment.hostname + "/api/trainingCoachAttend/all/" + localStorage.getItem('tokenId') + "/" + localStorage.getItem('userIdAttendance'),
                            headers: {
                                "Authorization": "Bearer " + localStorage.getItem('jwtToken')
                            },
                            type: 'POST'
                        },
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
                                $("#eventTitle").attr('placeholder', event.title);
                                $("#eventTitle").attr('value', event.id);
                                $("#eventPlace").attr('placeholder', event.description);
                                $("#eventDate").attr('placeholder', moment(event.start).format('DD/MM/YYYY'));
                                $("#eventDate").attr('value', event.start);
                                $("#m_modal_1").modal("show");
                            }
                        });
                    }
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


    onSubmit() {

        if (this.attForm.valid) {

            var dateEvent = $('#eventDate').attr('value');
            var idEvent = $('#eventTitle').attr('value');

            let attendance: Attendance = new Attendance(
                this.user,
                "1",
                null,
                idEvent,
                "Training Coach",
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

    redirectInfo() {
        this.router.navigate(['/training/info', this.id]);
    }

    redirectFeedback() {
        this.router.navigate(['/training/feedback', this.id]);
    }

}
