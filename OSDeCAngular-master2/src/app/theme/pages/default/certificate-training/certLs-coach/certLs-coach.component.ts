import { Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { NavigationEnd, Router } from '@angular/router';

import { Certification } from '../../../../../model/certification/certification';
import { CertificationService } from '../../../../../services/certification/certification.service';

import { environment } from "../../../../../../environments/environment";

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./certLs-coach.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [CertificationService]
})
export class CertListCoachComponent implements OnInit, AfterViewInit {

    datatable: any;
    token: string;
    bearToken: string;
    userid: String;

    constructor(private _script: ScriptLoaderService, private router: Router, private certificationService: CertificationService) { }

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
                        url: environment.hostname + "/api/certification/coach/list/" + this.userid,
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
                title: "Nama Persijilan",
                sortable: "asc",
                filterable: !1,
                width: 150,
                template: function(row) {
                    return row.certification.title;
                }
            }, {
                field: "technology",
                title: "Teknologi",
                sortable: "asc",
                filterable: !1,
                width: 150,
                template: function(row) {
                    return row.certification.technology.name;
                }
            }, {
                field: "start_date",
                title: "Tarikh Mula",
                type: 'datetime',
                sortable: "asc",
                template: function(row) {
                    var date = row.certification.startDate;
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
                    var date = row.certification.endDate;
                    var datemagic = new Date(date);
                    var day = datemagic.getDate();
                    var month = datemagic.getMonth() + 1;
                    var year = datemagic.getFullYear();
                    return day + '/' + month + '/' + year;
                },
            }, {
                field: "place",
                title: "Tempat Persijilan",
                sortable: "asc",
                filterable: !1,
                width: 150,
                template: function(row) {
                    return row.certification.place;
                }
            }, {
                field: "attendance",
                width: 110,
                title: "Tindakan",
                sortable: !1,
                overflow: "visible",
                template: function(t) {

                    return '<a href="/cert/peserta/' + t.certification.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill btn-outline-primary" title="Senarai Peserta">\t\t\t\t\t\t\t<i class="la la-ellipsis-h"></i>\t\t\t\t\t\t</a>\t\t\t\t\t\t'
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
