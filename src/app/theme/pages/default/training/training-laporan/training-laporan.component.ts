import { Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { NavigationEnd, Router } from '@angular/router';

import { Technology } from '../../../../../model/setup/technology';
import { Training } from '../../../../../model/training/training';
import { TrainingService } from '../../../../../services/training/training.service';

import { environment } from "../../../../../../environments/environment";
declare var $: any;

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./training-laporan.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [TrainingService]
})
export class TrainingLaporanComponent implements OnInit, AfterViewInit {

    datatable: any;
    token: string;
    bearToken: string;

    constructor(private _script: ScriptLoaderService, private router: Router, private trainingService: TrainingService) { }

    ngOnInit() {
        this.bearToken = "Bearer " + localStorage.getItem('jwtToken');

    }

    ngAfterViewInit() {

        var options = {
            data: {
                type: "remote",
                source: {
                    read: {
                        url: environment.hostname + "/api/training",
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
                width: 150
            }, {
                field: "technology",
                title: "Teknologi",
                sortable: "asc",
                filterable: !1,
                width: 150,
                template: function(row) {

                    var result = row.technology;
                    if (result != null) {
                        result = row.technology.name
                    } else {
                        result = "";
                    }
                    return result;
                }
            }, {
                field: "start_date",
                title: "Tarikh Mula",
                type: 'datetime',
                sortable: "asc",
                template: function(row) {
                    var date = row.startDate;
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
                    var date = row.endDate;
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
                width: 150
            }, {
                field: "level",
                title: "Tahap Kesukaran",
                width: 150,
                sortable: "asc",
                template: function(row) {

                    var htmlInter = '<div class="m-widget4__info"> ' +
                        '<span class="fa fa-star star-checked w3-large"></span> ' +
                        '<span class="fa fa-star star-checked w3-large"></span> ' +
                        '<span class="fa fa-star star-checked w3-large"></span> ' +
                        '<span class="fa fa-star  w3-large"></span> ' +
                        '<span class="fa fa-star  w3-large"></span> ' +
                        '<span class="m-widget4__sub"></span> ' +
                        '</div>';

                    var htmlBegin = '<div class="m-widget4__info"> ' +
                        '<span class="fa fa-star star-checked w3-large"></span> ' +
                        '<span class="fa fa-star w3-large"></span> ' +
                        '<span class="fa fa-star w3-large"></span> ' +
                        '<span class="fa fa-star  w3-large"></span> ' +
                        '<span class="fa fa-star  w3-large"></span> ' +
                        '<span class="m-widget4__sub"></span> ' +
                        '</div>';

                    var htmlExp = '<div class="m-widget4__info"> ' +
                        '<span class="fa fa-star star-checked w3-large"></span> ' +
                        '<span class="fa fa-star star-checked w3-large"></span> ' +
                        '<span class="fa fa-star star-checked w3-large"></span> ' +
                        '<span class="fa fa-star star-checked w3-large"></span> ' +
                        '<span class="fa fa-star star-checked w3-large"></span> ' +
                        '<span class="m-widget4__sub"></span> ' +
                        '</div>';

                    var level = row.level;
                    if (level != null) {
                        if (level == "Permulaan") {
                            return htmlBegin;
                        } else if (level == "Pertengahan") {
                            return htmlInter;
                        } if (level == "Mahir") {
                            return htmlExp;
                        }
                    } else {
                        return "";
                    }
                }
            },
            {
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
            },
            {
                field: "Actions",
                width: 110,
                title: "Tindakan",
                sortable: !1,
                overflow: "visible",
                template: function(t) {
                    return '<a href="/training/laporan/kehadiran/' + t.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill btn-outline-primary" title="Laporan Kehadiran">\t\t\t\t\t\t\t<i class="la la-ellipsis-h"></i>\t\t\t\t\t\t</a>\t\t\t\t\t'
                }
            }]
        }

        let datatable = (<any>$('#laporanList')).mDatatable(options);
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


