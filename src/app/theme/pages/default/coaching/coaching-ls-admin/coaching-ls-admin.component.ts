import { Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { Router } from '@angular/router';

import { CoachingService } from '../../../../../services/coaching/coaching.service';
import { environment } from "../../../../../../environments/environment";

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./coaching-ls-admin.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [CoachingService]
})
export class CoachingLsAdminComponent implements OnInit, AfterViewInit {

    datatable: any;
    token: string;
    bearToken: string;


    constructor(private elRef: ElementRef, private router: Router, private coachingService: CoachingService) { }

    ngOnInit() {
        this.bearToken = "Bearer " + localStorage.getItem('jwtToken');
    }

    ngAfterViewInit() {

        var options = {
            data: {
                type: "remote",
                source: {
                    read: {
                        url: environment.hostname + "/api/coaching",
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
                width: 150
            }, {
                field: "agency",
                title: "Agensi",
                width: 150,
                sortable: !1,
                template: function(row) {
                    let agensi = "";

                    if (row.user.type == "GOV") {
                        if (row.user.agency != null) {
                            agensi = row.user.agency.code;
                        } else {
                            agensi = "";
                        }
                    } else if (row.user.type == "PRIVATE") {
                        if (row.user.company != null) {
                            agensi = row.user.company.name;
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
                    var date = row.starting_date;
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
                    var date = row.ending_date;
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
                    return '<span class="m-badge ' + e[t.status].class + ' m-badge--wide">' + e[t.status].title + '</span>';
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
                            title1: "/coaching/assign/coacher/",
                            title2: "Tetapan Coach",
                            class: " la-users"
                        },
                        2: {
                            title1: "/coaching/view/",
                            title2: "Lihat Maklumat",
                            class: " la-ellipsis-h"
                        },
                        3: {
                            title1: "/coaching/approval/",
                            title2: "Kelulusan Coaching",
                            class: " la-check"
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
                    var toreturn = '<a href="' + e[t.status].title1 + t.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill btn-outline-success" title="' + e[t.status].title2 + '">\t\t\t\t\t\t\t<i class="la' + e[t.status].class + '"></i>\t\t\t\t\t\t</a>\t\t\t\t\t\t';
                    if ((t.status != 7) && (t.status != 6) && (t.status != 5)) {
                        toreturn = toreturn + '<a href="/coaching/edit/' + t.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill btn-outline-success" title="Kemaskini Maklumat">\t\t\t\t\t\t\t<i class="la la-pencil"></i>\t\t\t\t\t\t</a>\t\t\t\t\t\t';
                    }
                    if (t.status == 4) {
                        toreturn = toreturn + '<a href="/coaching/update2/' + t.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill btn-outline-success" title="Kemaskini Aktiviti">\t\t\t\t\t\t\t<i class="la la-calendar"></i>\t\t\t\t\t\t</a>\t\t\t\t\t\t';
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

        /////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////         AUDIT          /////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////////////

        var options2 = {
            data: {
                type: "remote",
                source: {
                    read: {
                        url: environment.hostname + "/api/coachingAudit",
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
                field: "name",
                title: "Nama",
                sortable: "asc",
                filterable: !1,
                width: 150
            }, {
                field: "createdBy",
                title: "Pemohon",
                width: 150,
                template: function(row) {
                    var result;
                    var e = row.createdBy;
                    if (e == null) {
                        result = " ";
                    } else {
                        result = row.createdBy.name;
                    }

                    return result;
                }
            }, {
                field: "createdDate",
                title: "Tarikh Permohonan",
                width: 150,
                filterable: !1,
                template: function(row) {
                    var result;
                    var e = row.createdDate;
                    var datemagic;
                    var day;
                    var month;
                    var year;
                    if (e == null) {
                        result = " ";
                    } else {
                        datemagic = new Date(e);
                        day = datemagic.getDate();
                        month = datemagic.getMonth() + 1;
                        year = datemagic.getFullYear();
                        result = day + '/' + month + '/' + year;
                    }

                    return result;
                }
            }, {
                field: "modifiedBy",
                title: "Pengemaskini",
                width: 150,
                template: function(row) {
                    var result;
                    var e = row.modifiedBy;
                    if (e == null) {
                        result = " ";
                    } else {
                        result = row.modifiedBy.name;
                    }

                    return result;
                }
            }, {
                field: "modifiedDate",
                title: "Tarikh Kemaskini",
                width: 150,
                filterable: !1,
                template: function(row) {
                    var result;
                    var e = row.modifiedDate;
                    var datemagic;
                    var day;
                    var month;
                    var year;
                    if (e == null) {
                        result = " ";
                    } else {
                        datemagic = new Date(e);
                        day = datemagic.getDate();
                        month = datemagic.getMonth() + 1;
                        year = datemagic.getFullYear();
                        result = day + '/' + month + '/' + year;
                    }

                    return result;
                }
            }, {
                field: "evaluatedBy",
                title: "Penilai",
                width: 150,
                template: function(row) {
                    var result;
                    var e = row.evaluatedBy;
                    if (e == null) {
                        result = " ";
                    } else {
                        result = row.evaluatedBy.name;
                    }

                    return result;
                }
            }, {
                field: "evaluatedDate",
                title: "Tarikh Penilaian",
                width: 150,
                filterable: !1,
                template: function(row) {
                    var result;
                    var e = row.evaluatedDate;
                    var datemagic;
                    var day;
                    var month;
                    var year;
                    if (e == null) {
                        result = " ";
                    } else {
                        datemagic = new Date(e);
                        day = datemagic.getDate();
                        month = datemagic.getMonth() + 1;
                        year = datemagic.getFullYear();
                        result = day + '/' + month + '/' + year;
                    }

                    return result;
                }
            }, {
                field: "approvedBy",
                title: "Pelaksana",
                width: 150,
                template: function(row) {
                    var result;
                    var e = row.approvedBy;
                    if (e == null) {
                        result = " ";
                    } else {
                        result = row.approvedBy.name;
                    }

                    return result;
                }
            }, {
                field: "approvedDate",
                title: "Tarikh Perlaksanaan",
                width: 150,
                filterable: !1,
                template: function(row) {
                    var result;
                    var e = row.approvedDate;
                    var datemagic;
                    var day;
                    var month;
                    var year;
                    if (e == null) {
                        result = " ";
                    } else {
                        datemagic = new Date(e);
                        day = datemagic.getDate();
                        month = datemagic.getMonth() + 1;
                        year = datemagic.getFullYear();
                        result = day + '/' + month + '/' + year;
                    }

                    return result;
                }
            }, {
                field: "verifiedBy",
                title: "Pengesah",
                width: 150,
                template: function(row) {
                    var result;
                    var e = row.verifiedBy;
                    if (e == null) {
                        result = " ";
                    } else {
                        result = row.verifiedBy.name;
                    }

                    return result;
                }
            }, {
                field: "verifiedDate",
                title: "Tarikh Pengesahan",
                width: 150,
                filterable: !1,
                template: function(row) {
                    var result;
                    var e = row.verifiedDate;
                    var datemagic;
                    var day;
                    var month;
                    var year;
                    if (e == null) {
                        result = " ";
                    } else {
                        datemagic = new Date(e);
                        day = datemagic.getDate();
                        month = datemagic.getMonth() + 1;
                        year = datemagic.getFullYear();
                        result = day + '/' + month + '/' + year;
                    }

                    return result;
                }
            }, {
                field: "status",
                title: "Status",
                template: function(t) {
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
                            title: "Diterima",
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
                    return '<span class="m-badge ' + e[t.status].class + ' m-badge--wide">' + e[t.status].title + '</span>';
                }
            }
            ]
        }

        let datatable2 = (<any>$('#auditCoachingList')).mDatatable(options2);

        $("#m_form_search2").on("keyup", function(e) {
            datatable2.setDataSourceParam("search", $(this).val());
            datatable2.load();
        })

        var flag = localStorage.getItem('RELOAD');
        if (flag == 'YES') {
            datatable2.reload();
            localStorage.removeItem('RELOAD');
        }

    }
}
