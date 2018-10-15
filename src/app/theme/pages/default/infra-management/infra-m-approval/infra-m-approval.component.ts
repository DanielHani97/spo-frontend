import { Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { Router } from '@angular/router';

import { InfrastructureService } from '../../../../../services/infrastructure/infrastructure.service';
import { environment } from "../../../../../../environments/environment";

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./infra-m-approval.html",
    encapsulation: ViewEncapsulation.None,
    providers: [InfrastructureService]
})
export class InfraMApprovalComponent implements OnInit, AfterViewInit {

    datatable: any;
    token : string;
    bearToken : string;

    constructor(private elRef: ElementRef, private router: Router,private infrastructureService: InfrastructureService) {

    }
    ngOnInit() {
        this.bearToken = "Bearer "+localStorage.getItem('jwtToken');
    }
    ngAfterViewInit() {
       var options = {
            data: {
                    type: "remote",
                    source: {
                        read: {
                            url: environment.hostname+"/api/infras",
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
                    field: "user",
                    title: "Pemohon",
                    sortable: "asc",
                    filterable: !1,
                    width: 150,
                    template: function(row) {
                        return row.user.name;
                    }
                }, {
                    field: "agency",
                    title: "Agensi",
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
                }, {
                    field: "os",
                    title: "Sistem Operasi",
                    width: 150
                }, {
                    field: "type",
                    title: "Jenis",
                    width: 150
                }, {
                    field: "status",
                    title: "Status",
                    template: function(t) {
                        var e = {
                            1: {
                                title: "Permohonan Baru",
                                class: " m-badge--primary"
                            },
                            2: {
                                title: "Diterima",
                                class: " m-badge--success"
                            },
                            3: {
                                title: "Ditolak",
                                class: " m-badge--danger"
                            },
                            4: {
                                title: "Dibatal",
                                class: " m-badge--warning"
                            }
                        };
                        return '<span class="m-badge ' + e[t.status].class + ' m-badge--wide">' + e[t.status].title + "</span>"
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
                                title1: "/setting-infra/setting/",
                                title2: "Kelulusan",
                                title3: "la la-check"
                            },
                            2: {
                                title1: "/infra/view/",
                                title2: "Lihat Maklumat",
                                title3: "la la-ellipsis-h"
                            },
                            3: {
                                title1: "/infra/view/",
                                title2: "Lihat Maklumat",
                                title3: "la la-ellipsis-h"
                            },
                            4: {
                                title1: "/infra/view/",
                                title2: "Lihat Maklumat",
                                title3: "la la-ellipsis-h"
                            }
                        };
                        return '<a href="'+ e[t.status].title1 + t.id +'" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill btn-outline-success" title="'+ e[t.status].title2 +'">\t\t\t\t\t\t\t<i class="'+ e[t.status].title3 +'"></i>\t\t\t\t\t\t</a>'
                    }

                }]
            }

            let datatable = (<any>$('#recordList')).mDatatable(options);

          $("#m_form_search").on("keyup", function(e) {
              datatable.setDataSourceParam("search", $(this).val());
              datatable.load();
          })

          var flag = localStorage.getItem('RELOAD');
          if(flag == 'YES'){
            datatable.reload();
            localStorage.removeItem('RELOAD');
          }



          //
          //
          //            AUDIT TRAIL 
          //
          //

        
        var optionw = {
            data: {
                    type: "remote",
                    source: {
                        read: {
                            url: environment.hostname+"/api/infraAudit",
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
                    field: "createdBy",
                    title: "Pemohon",
                    width: 150,
                    template: function(row) {
                        return row.createdBy.name;
                    }
                }, {
                    field: "createdDate",
                    title: "Tarikh Permohonan",
                    sortable: "asc",
                    filterable: !1,
                    width: 150,
                    template: function(row) {
                        var date = row.createdDate;
                        var datemagic = new Date(date);
                        var day = datemagic.getDate();
                        var month = datemagic.getMonth()+1;
                        var year = datemagic.getFullYear();
                        return day + '/' + month + '/' + year;
                    }
                },{
                    field: "status",
                    title: "Tindakan",
                    template: function(t) {
                        var e = {
                            1: {
                                title: "Permohonan Baru",
                                class: " m-badge--primary"
                            },
                            2: {
                                title: "Diterima",
                                class: " m-badge--success"
                            },
                            3: {
                                title: "Ditolak",
                                class: " m-badge--danger"
                            },
                            4: {
                                title: "Dibatal",
                                class: " m-badge--warning"
                            }
                        };
                        return '<span class="m-badge ' + e[t.status].class + ' m-badge--wide">' + e[t.status].title + "</span>"
                    }
                }, {
                    field: "modifiedBy",
                    title: "Pelaksana",
                    width: 150,
                    template: function(row) {
                        return row.modifiedBy.name;
                    }
                }, {
                    field: "modifiedDate",
                    title: "Tarikh Perlaksanaan",
                    filterable: !1,
                    width: 150,
                    template: function(row) {
                        var date = row.modifiedDate;
                        var datemagic = new Date(date);
                        var day = datemagic.getDate();
                        var month = datemagic.getMonth()+1;
                        var year = datemagic.getFullYear();
                        return day + '/' + month + '/' + year;
                    }
                }
                ]
            }

            let datatable2 = (<any>$('#auditList')).mDatatable(optionw);

          $("#m_form_search2").on("keyup", function(e) {
              datatable2.setDataSourceParam("search", $(this).val());
              datatable2.load();
          })

          var flag = localStorage.getItem('RELOAD');
          if(flag == 'YES'){
            datatable2.reload();
            localStorage.removeItem('RELOAD');
          }
    }

    

}
