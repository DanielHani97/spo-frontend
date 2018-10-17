import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from "../../../../../../environments/environment";

declare let $: any;
declare let moment: any;
declare let jQuery: any;

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./index-user.component.html",
    encapsulation: ViewEncapsulation.None
})
export class IndexUserComponent implements OnInit, AfterViewInit {

    bearToken: string;
    fullCalendar: any;
    userid: string;

    isAdmin: boolean;
    isCoach: boolean;
    isUser: boolean;
    isSupervisor: boolean;

    roles: any;

    mode: string;


    constructor(private _script: ScriptLoaderService,
        private router: Router,
        private route: ActivatedRoute) {

    }
    ngOnInit() {

        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.userid = currentUser.id;
        localStorage.setItem('tokenId', this.userid);

    }
    ngAfterViewInit() {
        var UserCalendar = {
            init: function() {

                $("#m_calendar_dash1").fullCalendar({

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
                            url: environment.hostname + "/api/training/getuserAll/" + localStorage.getItem('tokenId'),
                            headers: {
                                "Authorization": "Bearer " + localStorage.getItem('jwtToken')
                            },
                            type: 'POST',
                            color: '#34bfa3',
                            borderColor: '#34bfa3',
                            textColor: '#ffffff'
                        },
                        // COACHING ---------------------------------------------------------------------->
                        {
                            url: environment.hostname + "/api/coachingActivities/getuserAll/" + localStorage.getItem('tokenId'),
                            headers: {
                                "Authorization": "Bearer " + localStorage.getItem('jwtToken')
                            },
                            type: 'POST',
                            color: '#f4516c',
                            borderColor: '#f4516c',
                            textColor: '#ffffff'
                        },
                        //
                        //   // CAPABILITY----------------------------------------------------------------------->
                        {
                            url: environment.hostname + "/api/capActivities/getuserAll/" + localStorage.getItem('tokenId'),
                            headers: {
                                "Authorization": "Bearer " + localStorage.getItem('jwtToken')
                            },
                            type: 'POST',
                            color: '#716aca',
                            borderColor: '716aca',
                            textColor: '#ffffff'
                        },

                        // CERTIFICATION----------------------------------------------------------------------->
                        {
                            url: environment.hostname + "/api/certification/getuserAll/" + localStorage.getItem('tokenId'),
                            headers: {
                                "Authorization": "Bearer " + localStorage.getItem('jwtToken')
                            },
                            type: 'POST',
                            color: '#00c5dc',
                            borderColor: '00c5dc',
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
            UserCalendar.init()

        });
    }

}
