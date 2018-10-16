import { Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { Router } from '@angular/router';

import { CoachingService } from '../../../../../services/coaching/coaching.service';
import { environment } from "../../../../../../environments/environment";

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./coaching-ls-coach.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [CoachingService]
})
export class CoachingLsCoachComponent implements OnInit, AfterViewInit {

    datatable: any;
    bearToken: string;
    userid: string;

    constructor(private elRef: ElementRef, private router: Router, private coachingService: CoachingService) { }

    ngOnInit() {
        this.bearToken = "Bearer " + localStorage.getItem('jwtToken');
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.userid = currentUser.id;
        console.log("userid------->", this.userid)
    }


    ngAfterViewInit() {

        var options = {
            data: {
                type: "remote",
                source: {
                    read: {

                        url: environment.hostname + "/api/coaching/coach/list/" + this.userid,
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
                selector: {
                    class: "m-checkbox--solid m-checkbox--brand"
                }
            }, {
                field: "name",
                title: "Nama",
                sortable: "asc",
                filterable: !1,
                width: 150,
                template: function(row) {
                    return row.coaching.name;
                }
            }, {
                field: "agency",
                title: "Agensi",
                width: 150,
                sortable: !1,
                template: function(row) {
                    let agensi = "";

                    if (row.coaching.user.type == "GOV") {
                        if (row.coaching.user.agency != null) {
                            agensi = row.coaching.user.agency.code;
                        } else {
                            agensi = "";
                        }
                    } else if (row.coaching.user.type == "PRIVATE") {
                        if (row.coaching.user.company != null) {
                            agensi = row.coaching.user.company.name;
                        } else {
                            agensi = "";
                        }
                    } else {
                        agensi = "";
                    }

                    return agensi;
                }
            }, {
                field: "starting_date",
                title: "Tarikh Mula",
                type: 'datetime',
                sortable: !1,
                template: function(row) {
                    var date = row.coaching.starting_date;
                    if (date == null) {
                        return "";
                    } else {
                        var datemagic = new Date(date);
                        var day = datemagic.getDate();
                        var month = datemagic.getMonth() + 1;
                        var year = datemagic.getFullYear();
                        return day + '/' + month + '/' + year;
                    }
                }
            }, {
                field: "ending_date",
                title: "Tarikh Tamat",
                type: 'datetime',
                sortable: !1,
                template: function(row) {
                    var date = row.coaching.ending_date;
                    if (date == null) {
                        return "";
                    } else {
                        var datemagic = new Date(date);
                        var day = datemagic.getDate();
                        var month = datemagic.getMonth() + 1;
                        var year = datemagic.getFullYear();
                        return day + '/' + month + '/' + year;
                    }
                },
            }, {
                field: "status",
                title: "Status",
                template: function(t) {
                    var newStatus = t.coaching.status;
                    var e = {
                        1: {
                            title: "Permohonan Baru",
                            class: "m-badge--brand"
                        },
                        2: {
                            title: "Penilaian Coach",
                            class: " m-badge--metal"
                        },
                        3: {
                            title: "Kelulusan",
                            class: " m-badge--primary"
                        },
                        4: {
                            title: "Sedang Berlangsung",
                            class: " m-badge--success"
                        },
                        5: {
                            title: "Ditolak",
                            class: " m-badge--danger"
                        },
                        6: {
                            title: "Dibatalkan",
                            class: " m-badge--warning"
                        },
                        7: {
                            title: "Selesai",
                            class: " m-badge--accent"
                        }
                    };
                    return '<span class="m-badge ' + e[newStatus].class + ' m-badge--wide">' + e[newStatus].title + "</span>"
                }
            }, {
                field: "Tindakan",
                width: 110,
                title: "Tindakan",
                sortable: !1,
                overflow: "visible",
                template: function(t) {
                    var e = {
                        1: {
                            title1: "/coaching/view/",
                            title2: "Lihat Maklumat",
                            class: " la-ellipsis-h"
                        },
                        2: {
                            title1: "/coaching/valuation/",
                            title2: "Penilaian",
                            class: " la-edit"
                        },
                        3: {
                            title1: "/coaching/view/",
                            title2: "Lihat Maklumat",
                            class: " la-ellipsis-h"
                        },
                        4: {
                            title1: "/coaching/view/",
                            title2: "Lihat Maklumat",
                            class: " la-ellipsis-h"
                        },
                        5: {
                            title1: "/coaching/view/",
                            title2: "Lihat Maklumat",
                            class: " la-ellipsis-h"
                        },
                        6: {
                            title1: "/coaching/view/",
                            title2: "Lihat Maklumat",
                            class: " la-ellipsis-h"
                        },
                        7: {
                            title1: "/coaching/view/",
                            title2: "Lihat Maklumat",
                            class: " la-ellipsis-h"
                        }
                    };

                    var toreturn = '<a href="' + e[t.coaching.status].title1 + t.coaching.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill btn-outline-success" title="' + e[t.coaching.status].title2 + '">\t\t\t\t\t\t\t<i class="la' + e[t.coaching.status].class + '"></i>\t\t\t\t\t\t</a>\t\t\t\t\t';
                    if (t.coaching.status == 4) {
                        toreturn = toreturn
                            + '<a href="/coaching/update/' + t.coaching.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill btn-outline-success" title="Kemaskini Aktiviti">\t\t\t\t\t\t\t<i class="la la-pencil"></i>\t\t\t\t\t\t</a>\t\t\t\t\t\t'
                            + '<a href="/coaching/update-attendance/' + t.coaching.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill btn-outline-success" title="Kehadiran">\t\t\t\t\t\t\t<i class="la la-calendar"></i>\t\t\t\t\t\t</a>\t\t\t\t\t\t';
                    }

                    return toreturn;
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
