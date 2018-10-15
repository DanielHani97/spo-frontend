import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, NavigationEnd} from '@angular/router';
import { Location } from "@angular/common";

import { Capability } from '../../../../../model/capability/capability';
import { CapabilityService } from '../../../../../services/capability/capability.service'

import { environment } from "../../../../../../environments/environment";

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./cap-list-admin.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [CapabilityService]
})
export class CapListAdminComponent implements OnInit, AfterViewInit, OnDestroy {

    datatable: any;
    token : string;
    bearToken : string;

    id: string;
    user: any;

    private sub: any;

    constructor(private _script: ScriptLoaderService, private capabilityService:CapabilityService, private router:Router, private route: ActivatedRoute) { }


    ngOnInit() {

        this.bearToken = "Bearer "+localStorage.getItem('jwtToken');


        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
        });
    }

    redirectValuation(id){
        this.router.navigate(['/cap/approval/'+id]);
    }

    ngOnDestroy(): void{
       this.sub.unsubscribe();
    }

    ngAfterViewInit() {

        var options = {
        data: {
                    type: "remote",
                    source: {
                        read: {
                            url: environment.hostname+"/api/capabilityUser/all",
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
                    field: "pemohon",
                    title: "Nama Peserta",
                    sortable: "asc",
                    filterable: !1,
                    width: 150,
                    template: function(row){
                        return row.user.name;
                    }
                }, {
                    field: "agency",
                    title: "Agensi",
                    sortable: !1,
                    filterable: !1,
                    width: 200,
                    template: function(row){

                        var agency;

                        if(row.user.type=="GOV"){
                            if(row.user.agency!=null){
                                agency = row.user.agency.code;
                            }else{
                                agency = "";
                            }
                        }else if(row.user.type=="PRIVATE"){
                            if(row.user.company!=null){
                                agency = row.user.company.name;
                            }else{
                                agency = "";
                            }
                        }else{
                            agency = "";
                        }

                        return agency;
                    }
                }, {
                    field: "name",
                    title: "Nama Kepakaran",
                    sortable: "asc",
                    filterable: !1,
                    width: 150,
                    template: function(row){
                        return row.capability.name;
                    }
                }, {
                    field: "status",
                    title: "Status",
                    template: function(t) {

                        var e = {
                            1: {
                                title: "Baru",
                                class: "m-badge--brand"
                            },
                            2: {
                                title: "Penilaian",
                                class: " m-badge--metal"
                            },
                            3: {
                                title: "Diterima",
                                class: " m-badge--success"
                            },
                            4: {
                                title: "Ditolak",
                                class: " m-badge--danger"
                            },
                            5: {
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

                        var toreturn = '<a href="/cap/view/'+t.capability.id+'" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill btn-outline-success" title="Lihat Maklumat">\t\t\t\t\t\t\t<i class="la la-ellipsis-h"></i>\t\t\t\t\t\t</a>';
                        if(t.status==2){
                            toreturn = toreturn +'<a href="/cap/approval/'+t.id+'" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill btn-outline-success" title="Kelulusan Permohonan">\t\t\t\t\t\t\t<i class="la la-check"></i>\t\t\t\t\t\t</a>';
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
                if(flag == 'YES'){
                  datatable.reload();
                  localStorage.removeItem('RELOAD');
          }

          /////////////////////////////////////////////////////////////////////////////////////////////

      var options2 = {
            data: {
                    type: "remote",
                    source: {
                        read: {
                            url: environment.hostname+"/api/capabilityUser/audit",
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
                    width: 150,
                    template: function(row) {
                        var result;
                        var e = row.capability;
                        if (e==null){
                           result = " ";
                        }else{
                            result = row.capability.name;
                        }

                        return result;
                    }
                }, {
                    field: "createdBy",
                    title: "Pemohon",
                    width: 150,
                    template: function(row) {
                        var result;
                        var e = row.createdBy;
                        if (e==null){
                           result = " ";
                        }else{
                            result = row.createdBy.name;
                        }

                        return result;
                    }
                },{
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
                        if (e==null){
                           result = " ";
                        }else{
                            datemagic = new Date(e);
                            day = datemagic.getDate();
                            month = datemagic.getMonth()+1;
                            year = datemagic.getFullYear();
                            result = day + '/' + month + '/' + year;
                        }

                        return result;
                    }
                },{
                    field: "evaluatedBy",
                    title: "Penilai",
                    width: 150,
                    template: function(row) {
                        var result;
                        var e = row.evaluatedBy;
                        if (e==null){
                           result = " ";
                        }else{
                            result = row.evaluatedBy.name;
                        }

                        return result;
                    }
                },{
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
                        if (e==null){
                           result = " ";
                        }else{
                            datemagic = new Date(e);
                            day = datemagic.getDate();
                            month = datemagic.getMonth()+1;
                            year = datemagic.getFullYear();
                            result = day + '/' + month + '/' + year;
                        }

                        return result;
                    }
                },{
                    field: "status",
                    title: "Status",
                    template: function(t) {

                        var e = {
                            1: {
                                title: "Baru",
                                class: "m-badge--brand"
                            },
                            2: {
                                title: "Penilaian",
                                class: " m-badge--metal"
                            },
                            3: {
                                title: "Diterima",
                                class: " m-badge--success"
                            },
                            4: {
                                title: "Ditolak",
                                class: " m-badge--danger"
                            },
                            5: {
                                title: "Dibatal",
                                class: " m-badge--warning"
                            }
                        };
                        return '<span class="m-badge ' + e[t.status].class + ' m-badge--wide">' + e[t.status].title + "</span>"
                    }
                },{
                    field: "approvedBy",
                    title: "Pelaksana",
                    width: 150,
                    template: function(row) {
                        var result;
                        var e = row.approvedBy;
                        if (e==null){
                           result = " ";
                        }else{
                            result = row.approvedBy.name;
                        }

                        return result;
                    }
                },{
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
                        if (e==null){
                           result = " ";
                        }else{
                            datemagic = new Date(e);
                            day = datemagic.getDate();
                            month = datemagic.getMonth()+1;
                            year = datemagic.getFullYear();
                            result = day + '/' + month + '/' + year;
                        }

                        return result;
                    }
                }
                ]
            }

            let datatable2 = (<any>$('#auditCapabilityList')).mDatatable(options2);

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
