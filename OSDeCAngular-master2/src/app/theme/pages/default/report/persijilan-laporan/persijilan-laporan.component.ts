import { Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { NavigationEnd, Router } from '@angular/router';

import { Certification } from '../../../../../model/certification/certification';
import { CertificationService } from '../../../../../services/certification/certification.service';

import { environment } from "../../../../../../environments/environment";
declare var $: any;

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./persijilan-laporan.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [CertificationService]
})
export class PersijilanLaporanComponent implements OnInit, AfterViewInit {

    datatable: any;
    token: string;
    bearToken: string;
    att: any;

    constructor(private _script: ScriptLoaderService, private router: Router, private certificationService: CertificationService) { }

    ngOnInit() {
        this.bearToken = "Bearer " + localStorage.getItem('jwtToken');

    }

    ngAfterViewInit() {

        var options = {
            data: {
                type: "remote",
                source: {
                    read: {
                        url: environment.hostname + "/api/persijilan/report",
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
                field: "name",
                title: "Nama Peserta",
                sortable: "asc",
                filterable: !1,
                width: 150,
                template: function(row) {
                    var user = row.user;

                    if (user != null) {
                        user = user.name;
                    } else {
                        user = "";
                    }
                    return user;
                }
            }, {
                field: "name2",
                title: "Agensi",
                sortable: "asc",
                filterable: !1,
                width: 200,
                template: function(row) {
                    var user = row.user;
                    var result = "";
                    if (user != null) {
                        var agency = user.agency;
                        if (agency != null) {
                            result = agency.code;
                        } else {
                            result = "";
                        }
                    } else {
                        result = "";
                    }

                    return result;
                }
            }, {
                field: "email",
                title: "Email",
                sortable: "asc",
                filterable: !1,
                width: 200,
                template: function(row) {
                    var user = row.user;
                    if (user != null) {
                        user = user.email;
                    } else {
                        user = "";
                    }
                    return user;
                }
            }, {
                field: "position",
                title: "Jawatan",
                sortable: "asc",
                filterable: !1,
                width: 200,
                template: function(row) {
                    var user = row.user;
                    if (user != null) {
                        user = user.position;
                    } else {
                        user = "";
                    }
                    return user;
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
                field: "statusResult",
                title: "Status",
                template: function(t) {

                    var result = t.statusResult;
                    if (result == "1") {
                        return '<span class="m-badge m-badge--success m-badge--wide">Lulus</span>';
                    } else if (result == "2") {
                        return '<span class="m-badge m-badge--danger m-badge--wide">Tidak Lulus</span>';
                    } else if (result == "3") {
                        return '<span class="m-badge m-badge--primary m-badge--wide">Lain-lain</span>';
                    } else {
                        return " "
                    }

                }
            },
            ]
        }

        let datatable = (<any>$('#laporanPersijilanList')).mDatatable(options);
        this.datatable = datatable;


        $("#m_form_search").on("keyup", function(e) {
            datatable.setDataSourceParam("search", $(this).val());
            datatable.load();
        })

        var flag = localStorage.getItem('RELOAD');
        if (flag == 'YES') {
            datatable.reload();
            localStorage.removeItem('RELOAD');
        };
    }
}


