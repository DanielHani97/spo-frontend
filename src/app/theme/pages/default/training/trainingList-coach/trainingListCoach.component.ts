import { Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { NavigationEnd, Router } from '@angular/router';

import { Training } from '../../../../../model/training/training';
import { TrainingService } from '../../../../../services/training/training.service';

import { environment } from "../../../../../../environments/environment";

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./trainingListCoach.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [TrainingService]
})
export class TrainingListCoachComponent implements OnInit, AfterViewInit {

    datatable: any;
    token: string;
    bearToken: string;
    userid: String;

    constructor(private _script: ScriptLoaderService, private router: Router, private trainingService: TrainingService) { }

    ngOnInit() {

        this.bearToken = "Bearer " + localStorage.getItem('jwtToken');
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.userid = currentUser.id;
    }

    ngAfterViewInit() {
        var options = {
            data: {
                type: "remote",
                source: {
                    read: {
                        url: environment.hostname + "/api/training/coach/list/" + this.userid,
                        headers: {
                            "Authorization": this.bearToken
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
                selector: {
                    class: "m-checkbox--solid m-checkbox--brand"
                }
            }, {
                field: "title",
                title: "Nama Latihan",
                sortable: "asc",
                filterable: !1,
                width: 150,
                template: function(row) {
                    return row.training.title;
                }
            }, {
                field: "technology",
                title: "Teknologi",
                sortable: "asc",
                filterable: !1,
                width: 150,
                template: function(row) {
                    return row.training.technology.name;
                }
            }, {
                field: "start_date",
                title: "Tarikh Mula",
                type: 'datetime',
                sortable: "asc",
                template: function(row) {
                    var date = row.training.startDate;
                    var datemagic = new Date(date);
                    var day = datemagic.getDate();
                    var month = datemagic.getMonth() + 1;
                    var year = datemagic.getFullYear();
                    return day + '/' + month + '/' + year;
                },
            }, {
                field: "end_date",
                title: "Tarikh Tamat",
                type: 'datetime',
                sortable: "asc",
                template: function(row) {
                    var date = row.training.endDate;
                    var datemagic = new Date(date);
                    var day = datemagic.getDate();
                    var month = datemagic.getMonth() + 1;
                    var year = datemagic.getFullYear();
                    return day + '/' + month + '/' + year;
                },
            }, {
                field: "place",
                title: "Tempat Latihan",
                sortable: "asc",
                filterable: !1,
                width: 150,
                template: function(row) {
                    return row.training.place;
                }
            }, {
                field: "attendance",
                width: 110,
                title: "Tindakan",
                sortable: !1,
                overflow: "visible",
                template: function(t) {

                    return '<a href="/training/peserta/' + t.training.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill btn-outline-primary" title="Senarai Peserta">\t\t\t\t\t\t\t<i class="la la-users"></i>\t\t\t\t\t\t</a>\t\t\t\t\t\t' + '<a href="/training/coachAttendance/' + t.training.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill btn-outline-success" title="Kehadiran">\t\t\t\t\t\t\t<i class="la la-calendar"></i>\t\t\t\t\t\t</a>\t\t\t\t\t\t';
                }
            }]
        }

        let datatable = (<any>$('#recordList')).mDatatable(options);

        $("#m_form_search").on("keyup", function(e) {
            datatable.setDataSourceParam("search", $(this).val());
            datatable.load();
        })

        var flag = localStorage.getItem('RELOAD');
        if (flag == 'YES') {
            datatable.reload();
            localStorage.removeItem('RELOAD');
        }
    }
}
