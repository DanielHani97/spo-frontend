import { Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { Router } from '@angular/router';

import { CoachingService } from '../../../../../services/coaching/coaching.service';
import { environment } from "../../../../../../environments/environment";

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./coaching-laporan.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [CoachingService]
})
export class CoachingLaporanComponent implements OnInit, AfterViewInit {

    datatable: any;
    bearToken : string;


   constructor(private elRef: ElementRef, private router: Router, private coachingService:CoachingService) { }

    ngOnInit() {
        this.bearToken = "Bearer "+localStorage.getItem('jwtToken');
    }

    ngAfterViewInit() {
        var options = {
            data: {
                    type: "remote",
                    source: {
                        read: {
                            url: environment.hostname+"/api/coaching/report",
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
                    sortable: !1,
                    width: 150,
                    template: function(row) {
                       let agensi = "";
                           
                        if(row.user.type=="GOV"){
                            if(row.user.agency!=null){
                                agensi = row.user.agency.code;
                            }else{
                                agensi = "";
                            }
                        }else if(row.user.type=="PRIVATE"){
                            if(row.user.company!=null){
                                agensi = row.user.company.name;
                            }else{
                                agensi = "";
                            }
                        }else{
                            agensi = "";
                        }

                      return agensi;
                    }
                },{
                    field: "starting_date",
                    title: "Tarikh Mula",
                    type: 'datetime',
                    sortable: !1,
                    template:    function (row) {
                        var date = row.starting_date;
                        var datemagic = new Date(date);
                        var day = datemagic.getDate();
                        var month = datemagic.getMonth()+1;
                        var year = datemagic.getFullYear();
                        return day + '/' + month + '/' + year;
                    }
                }, {
                    field: "ending_date",
                    title: "Tarikh Tamat",
                    type: 'datetime',
                    sortable: !1,
                    template:    function (row) {
                        var date = row.ending_date;
                        var datemagic = new Date(date);
                        var day = datemagic.getDate();
                        var month = datemagic.getMonth()+1;
                        var year = datemagic.getFullYear();
                        return day + '/' + month + '/' + year;
                   },
                },{
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
                        
                        var toreturn = '<a href="/coaching/laporan/kehadiran/'+ t.id +'" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill btn-outline-success" title="Lihat Laporan">\t\t\t\t\t\t\t<i class="la la-calendar"></i>\t\t\t\t\t\t</a>\t\t\t\t\t\t';
                        
                        return toreturn;
                    }

                }]
            }

            let datatable = (<any>$('#reportList')).mDatatable(options);

            $("#m_form_search").on("keyup", function(e) {
                datatable.setDataSourceParam("search", $(this).val());
                console.log($(this).val());
                datatable.load();
            })

            var flag = localStorage.getItem('RELOAD');
            if(flag == 'YES'){
                datatable.reload();
                localStorage.removeItem('RELOAD');
            }
    }
}
