import { Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { Router } from '@angular/router';

import { CapabilityService } from '../../../../../services/capability/capability.service';
import { environment } from "../../../../../../environments/environment";

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./cap-laporan.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [CapabilityService]
})
export class CapLaporanComponent implements OnInit, AfterViewInit {

    datatable: any;
    bearToken: string;


    constructor(private elRef: ElementRef, private router: Router, private capabilityService: CapabilityService) { }

    ngOnInit() {
        this.bearToken = "Bearer " + localStorage.getItem('jwtToken');
    }

    ngAfterViewInit() {
        var options = {
            data: {
                type: "remote",
                source: {
                    read: {
                        url: environment.hostname + "/api/capability/report",
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
                field: "kepakaran",
                title: "Kepakaran",
                width: 150,
                template: function(row) {
                    var type = row.kepakaran;
                    var result = "";

                    if (type == null) {
                        result = "";
                    } else {
                        result = row.kepakaran.name;
                    }

                    return result;

                }
            }, {
                field: "starting_date",
                title: "Tarikh Mula",
                type: 'datetime',
                filterable: !1,
                sortable: !1,
                template: function(row) {
                    var date = row.starting_date;
                    var datemagic = new Date(date);
                    var day = datemagic.getDate();
                    var month = datemagic.getMonth() + 1;
                    var year = datemagic.getFullYear();
                    return day + '/' + month + '/' + year;
                }
            }, {
                field: "ending_date",
                title: "Tarikh Tamat",
                type: 'datetime',
                filterable: !1,
                sortable: !1,
                template: function(row) {
                    var date = row.ending_date;
                    var datemagic = new Date(date);
                    var day = datemagic.getDate();
                    var month = datemagic.getMonth() + 1;
                    var year = datemagic.getFullYear();
                    return day + '/' + month + '/' + year;
                },
            }, {
                field: "Status",
                title: "Status",
                template: function(t) {

                    var result = t.status;
                    if (result == "1") {
                        return '<span class="m-badge m-badge--success m-badge--wide">Aktif</span>';
                    } else if (result == "2") {
                        return '<span class="m-badge m-badge--danger m-badge--wide">Tidak Aktif</span>';
                    }
                }
            }, {
                field: "Tindakan",
                width: 110,
                title: "Tindakan",
                sortable: !1,
                overflow: "visible",
                template: function(t) {

                    var toreturn = '<a href="/cap/laporan/kehadiran/' + t.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill btn-outline-success" title="Lihat Laporan">\t\t\t\t\t\t\t<i class="la la-calendar"></i>\t\t\t\t\t\t</a>\t\t\t\t\t\t';

                    return toreturn;
                }

            }]
        }

        let datatable = (<any>$('#reportCapList')).mDatatable(options);

        $("#m_form_search").on("keyup", function(e) {
            datatable.setDataSourceParam("search", $(this).val());
            console.log($(this).val());
            datatable.load();
        })

        var flag = localStorage.getItem('RELOAD');
        if (flag == 'YES') {
            datatable.reload();
            localStorage.removeItem('RELOAD');
        }
    }
}
