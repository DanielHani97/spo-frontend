import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../helpers';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";
import { environment } from "../../../../../environments/environment";
import { Manday } from '../../../../model/setup/manday';
import { MandayService } from '../../../../services/setup/manday.service';
import { Attendance } from '../../../../model/attendance/attendance';
import { AttendanceService } from '../../../../services/attendance/attendance.service';
import { User } from '../../../../model/user';
import { UserService } from '../../../../services/user.service';
import { MandayTransaction } from '../../../../model/setup/mandayTransaction';
import { AuthenticationService } from "../../../../auth/_services/authentication.service";


declare let $: any;
declare let moment: any;
declare let jQuery: any;

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./index.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [MandayService, AttendanceService, UserService, AuthenticationService]
})
export class IndexComponent implements OnInit, AfterViewInit {

    manday: Manday;

    trainDate: any[];
    capabDate: any[];
    coachDate: any[];
    certDate: any[];


    trainId: string;
    capabId: string;
    coachId: string;
    certId: string;
    mandayForm: FormGroup;
    DashForm: FormGroup;

    trainTl: number;
    trainUsed: number;
    trainBal: number;
    trainPerc: number;
    trainPerc2: number;

    capabTl: number;
    capabUsed: number;
    capabBal: number;
    capabPerc: number;
    capabPerc2: number;

    coachTl: number;
    coachUsed: number;
    coachBal: number;
    coachPerc: number;
    coachPerc2: number;

    certTl: number;
    certUsed: number;
    certBal: number;
    certPerc: number;
    certPerc2: number;

    mandays: any;

    arrayTrain = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    arrayCoach = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    arrayCert = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    arrayData2: number[];

    created_date: Date;

    data: any;
    data2: any;

    id: string;
    userObj: any;
    bearToken: string;
    fullCalendar: any;
    private sub: any;
    userid: string;

    isAdmin: boolean;
    isCoach: boolean;
    isUser: boolean;
    isSupervisor: boolean;

    roles: any;

    mode: string;

    noUser: number;


    constructor(private _script: ScriptLoaderService,
        private mandayService: MandayService,
        private userService: UserService,
        private router: Router,
        private route: ActivatedRoute,
        private _authService: AuthenticationService) {


    }
    ngOnInit() {

        let currentUser2 = JSON.parse(this._authService.getCurrentUser());
        this.roles = currentUser2.authorities;

        for (let role of this.roles) {
            var authz = role.authority;
            if (authz == 'ROLE_ADMIN') {
                this.isAdmin = true;
            } else if (authz == 'ROLE_SUPERVISOR') {
                this.isSupervisor = true;
            } else if (authz == 'ROLE_COACH') {
                this.isCoach = true;
            } else if (authz == 'ROLE_USER') {
                this.isUser = true;
            }
        }

        var currRole = localStorage.getItem("CURRENT_ROLE");

        if (currRole) {
            this.mode = localStorage.getItem("CURRENT_ROLE");
        } else {
            if (this.isAdmin == true) {
                this.mode = "ADMIN";
            } else if (this.isSupervisor == true) {
                this.mode = "SUPERVISOR";
            } else if (this.isCoach == true) {
                this.mode = "COACH";
            } else if (this.isUser == true) {
                this.mode = "USER";
            }
        }

        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.userid = currentUser.id;
        localStorage.setItem('tokenId', this.userid);

        this.mandayForm = new FormGroup({
            totalTrain: new FormControl(''),
            totalCapab: new FormControl(''),
            totalCoach: new FormControl(''),
            totalCert: new FormControl('')
        })

        // load training
        this.mandayService.getMandayTransTrain().subscribe(
            data => {
                this.trainDate = data;

                for (let obj of data) {
                    var instanceDate = new Date(obj.instanceDate);
                    var currentDate = new Date();
                    var manday = obj.manday;
                    var month = instanceDate.getMonth();
                    var year = instanceDate.getFullYear();
                    var year2 = currentDate.getFullYear();

                    if (year == year2) {

                        if (month == 0) {
                            this.arrayTrain[0] = this.arrayTrain[0] + manday;
                        }
                        if (month == 1) {
                            this.arrayTrain[1] = this.arrayTrain[1] + manday;
                        }
                        if (month == 2) {
                            this.arrayTrain[2] = this.arrayTrain[2] + manday;
                        }
                        if (month == 3) {
                            this.arrayTrain[3] = this.arrayTrain[3] + manday;
                        }
                        if (month == 4) {
                            this.arrayTrain[4] = this.arrayTrain[4] + manday;
                        }
                        if (month == 5) {
                            this.arrayTrain[5] = this.arrayTrain[5] + manday;
                        }
                        if (month == 6) {
                            this.arrayTrain[6] = this.arrayTrain[6] + manday;
                        }
                        if (month == 7) {
                            this.arrayTrain[7] = this.arrayTrain[7] + manday;
                        }
                        if (month == 8) {
                            this.arrayTrain[8] = this.arrayTrain[8] + manday;
                        }
                        if (month == 9) {
                            this.arrayTrain[9] = this.arrayTrain[9] + manday;
                        }
                        if (month == 10) {
                            this.arrayTrain[10] = this.arrayTrain[10] + manday;
                        }
                        if (month == 11) {
                            this.arrayTrain[11] = this.arrayTrain[11] + manday;
                        }
                    }


                }
            }
        );
        // load coaching
        this.mandayService.getMandayTransCoach().subscribe(
            data => {
                this.coachDate = data
                for (let obj of data) {
                    var instanceDate = new Date(obj.instanceDate);
                    var currentDate = new Date();
                    var manday = obj.manday;
                    var month = instanceDate.getMonth();
                    var year = instanceDate.getFullYear();
                    var year2 = currentDate.getFullYear();

                    if (year == year2) {
                        if (month == 0) {
                            this.arrayCoach[0] = this.arrayCoach[0] + manday;
                        }
                        if (month == 1) {
                            this.arrayCoach[1] = this.arrayCoach[1] + manday;
                        }
                        if (month == 2) {
                            this.arrayCoach[2] = this.arrayCoach[2] + manday;
                        }
                        if (month == 3) {
                            this.arrayCoach[3] = this.arrayCoach[3] + manday;
                        }
                        if (month == 4) {
                            this.arrayCoach[4] = this.arrayCoach[4] + manday;
                        }
                        if (month == 5) {
                            this.arrayCoach[5] = this.arrayCoach[5] + manday;
                        }
                        if (month == 6) {
                            this.arrayCoach[6] = this.arrayCoach[6] + manday;
                        }
                        if (month == 7) {
                            this.arrayCoach[7] = this.arrayCoach[7] + manday;
                        }
                        if (month == 8) {
                            this.arrayCoach[8] = this.arrayCoach[8] + manday;
                        }
                        if (month == 9) {
                            this.arrayCoach[9] = this.arrayCoach[9] + manday;
                        }
                        if (month == 10) {
                            this.arrayCoach[10] = this.arrayCoach[10] + manday;
                        }
                        if (month == 11) {
                            this.arrayCoach[11] = this.arrayCoach[11] + manday;
                        }
                    }


                }
            }
        );
        // load certificate
        this.mandayService.getMandayTransCert().subscribe(
            data => {
                this.certDate = data
                for (let obj of data) {
                    var instanceDate = new Date(obj.instanceDate);
                    var currentDate = new Date();
                    var manday = obj.manday;
                    var month = instanceDate.getMonth();
                    var year = instanceDate.getFullYear();
                    var year2 = currentDate.getFullYear();

                    if (year == year2) {
                        if (month == 0) {
                            this.arrayCert[0] = this.arrayCert[0] + manday;
                        }
                        if (month == 1) {
                            this.arrayCert[1] = this.arrayCert[1] + manday;
                        }
                        if (month == 2) {
                            this.arrayCert[2] = this.arrayCert[2] + manday;
                        }
                        if (month == 3) {
                            this.arrayCert[3] = this.arrayCert[3] + manday;
                        }
                        if (month == 4) {
                            this.arrayCert[4] = this.arrayCert[4] + manday;
                        }
                        if (month == 5) {
                            this.arrayCert[5] = this.arrayCert[5] + manday;
                        }
                        if (month == 6) {
                            this.arrayCert[6] = this.arrayCert[6] + manday;
                        }
                        if (month == 7) {
                            this.arrayCert[7] = this.arrayCert[7] + manday;
                        }
                        if (month == 8) {
                            this.arrayCert[8] = this.arrayCert[8] + manday;
                        }
                        if (month == 9) {
                            this.arrayCert[9] = this.arrayCert[9] + manday;
                        }
                        if (month == 10) {
                            this.arrayCert[10] = this.arrayCert[10] + manday;
                        }
                        if (month == 11) {
                            this.arrayCert[11] = this.arrayCert[11] + manday;
                        }
                    }

                }
            }
        );

        this.mandayService.getManday().subscribe(
            manday => {

                this.mandays = manday;

                for (let obj of manday) {
                    var id = obj.id;
                    var category = obj.category;
                    var total = obj.total;
                    var mandayUsed = obj.mandayUsed;

                    if (category == "training") {
                        this.trainId = id
                        this.trainTl = total;
                        this.trainUsed = mandayUsed;
                        this.trainBal = this.trainTl - this.trainUsed;
                        this.trainPerc = (this.trainUsed / this.trainTl) * 100;
                        this.trainPerc2 = Math.round(this.trainPerc);
                    }
                    if (category == "capability") {
                        this.capabId = id
                        this.capabTl = total;
                        this.capabUsed = mandayUsed;
                        this.capabBal = this.capabTl - this.capabUsed;
                        this.capabPerc = (this.capabUsed / this.capabTl) * 100;
                        this.capabPerc2 = Math.round(this.capabPerc);

                    }
                    if (category == "coaching") {
                        this.coachId = id
                        this.coachTl = total;
                        this.coachUsed = mandayUsed;
                        this.coachBal = this.coachTl - this.coachUsed;
                        this.coachPerc = (this.coachUsed / this.coachTl) * 100;
                        this.coachPerc2 = Math.round(this.coachPerc);

                    }
                    if (category == "certificate") {
                        this.certId = id
                        this.certTl = total;
                        this.certUsed = mandayUsed;
                        this.certBal = this.certTl - this.certUsed;
                        this.certPerc = (this.certUsed / this.certTl) * 100;
                        this.certPerc2 = Math.round(this.certPerc);

                    }

                    // ----------------- KESELURUHAN ---------------
                    this.arrayData2 = [this.trainUsed, this.coachUsed, this.certUsed];


                    this.data2 = {
                        datasets: [{
                            data: this.arrayData2,
                            backgroundColor: [
                                "#4BC0C0",
                                "#f4516c",
                                "#36A2EB"
                            ],
                            label: 'My dataset'
                        }],
                        labels: [
                            "Latihan Teknikal",
                            "Coaching",
                            "Persijilan"
                        ]
                    }


                    // ----------------- GRAF ---------------

                    this.data = {
                        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'nov', 'Dec'],
                        datasets: [
                            {
                                label: 'Latihan',
                                backgroundColor: '#34bfa3',
                                borderColor: '#34bfa3',
                                data: this.arrayTrain
                            },
                            {
                                label: 'Coaching',
                                backgroundColor: '#f4516c',
                                borderColor: '#f4516c',
                                data: this.arrayCoach
                            },
                            {
                                label: 'Persijilan',
                                backgroundColor: '#00c5dc',
                                borderColor: '#00c5dc',
                                data: this.arrayCert
                            }
                        ]
                    }

                }
            })

        this.userService.countUser().subscribe(
            data => {
                console.log("sadasdasdasd:" + data)
                this.noUser = data;
            }
        )

    }
    ngAfterViewInit() {

        this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
            'assets/app/js/dashboard.js');

        var AdminCalendar = {
            init: function() {

                $("#m_calendar_dash2").fullCalendar({

                    buttonText: {
                        today: 'Hari Ini',
                        month: 'Bulan',
                        week: 'Minggu',
                        day: 'Hari',
                        list: 'Senarai'
                    },

                    dayNamesShort: ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'],

                    dayNames: ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'],

                    weekends: false,


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

                        // TRAINING -------------------------------------------------------------------->
                        {
                            url: environment.hostname + "/api/training/getall/",
                            headers: {
                                "Authorization": "Bearer " + localStorage.getItem('jwtToken')
                            },
                            type: 'POST',
                            color: '#34bfa3',
                            borderColor: '#34bfa3',
                            textColor: '#ffffff'
                        },
                        // // COACHING ---------------------------------------------------------------------->
                        {
                            url: environment.hostname + "/api/coachingActivities/getall/",
                            headers: {
                                "Authorization": "Bearer " + localStorage.getItem('jwtToken')
                            },
                            type: 'POST',
                            color: '#f4516c',
                            borderColor: '#f4516c',
                            textColor: 'white'
                        },

                        // CAPABILITY----------------------------------------------------------------------->
                        {
                            url: environment.hostname + "/api/capActivities/getall/",
                            headers: {
                                "Authorization": "Bearer " + localStorage.getItem('jwtToken')
                            },
                            type: 'POST',
                            color: '#716aca',
                            borderColor: '#716aca',
                            textColor: '#ffffff'
                        },
                        // CERTIFICATION----------------------------------------------------------------------->
                        {
                            url: environment.hostname + "/api/certification/getall/",
                            headers: {
                                "Authorization": "Bearer " + localStorage.getItem('jwtToken')
                            },
                            type: 'POST',
                            color: '#00c5dc',
                            borderColor: '#00c5dc',
                            textColor: '#ffffff'
                        }

                    ],

                    eventRender: function(event, element) {
                        element.attr('href', 'javascript:void(0);');

                        element.click(function() {

                            if (event.type == "coaching") {

                                $("#eventTitleCoach").attr('placeholder', event.title);
                                $("#eventNameCoach").attr('placeholder', event.name);
                                $("#eventVenueCoach").attr('placeholder', event.venue);
                                $("#eventStartDateCoach").attr('placeholder', moment(event.start).format('DD/MMM/YYYY'));
                                $("#eventEndDateCoach").attr('placeholder', moment(event.endDate).format('DD/MMM/YYYY'));
                                $("#eventBackend").attr('placeholder', event.backend);
                                $("#eventFrontend").attr('placeholder', event.frontend);
                                $("#eventDatabase").attr('placeholder', event.database);

                                $("#m_modal_coach").modal("show");

                            } else if (event.type == "capability") {
                                $("#eventTitleCapab").attr('placeholder', event.title);
                                $("#eventNameCapab").attr('placeholder', event.name);
                                $("#eventVenueCapab").attr('placeholder', event.venue);
                                $("#eventStartDateCapab").attr('placeholder', moment(event.start).format('DD/MMM/YYYY'));
                                $("#eventEndDateCapab").attr('placeholder', moment(event.endDate).format('DD/MMM/YYYY'));
                                $("#eventKepakaran").attr('placeholder', event.kepakaran);

                                $("#m_modal_capab").modal("show");

                            } else {

                                $("#eventTitle").attr('placeholder', event.title);
                                $("#eventVenue").attr('placeholder', event.description);
                                $("#eventStartDate").attr('placeholder', moment(event.start).format('DD/MMM/YYYY'));
                                $("#eventEndDate").attr('placeholder', moment(event.endDate).format('DD/MMM/YYYY'));
                                $("#eventTech").attr('placeholder', event.technology);
                                $("#eventLevel").attr('placeholder', event.level);
                                $("#m_modal_1").modal("show");

                            }

                        });
                    }

                })
            }
        };

        jQuery(document).ready(function() {
            AdminCalendar.init()
        });

    }

}
