import { Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { Router } from '@angular/router';

import { InfrastructureService } from '../../../../../services/infrastructure/infrastructure.service';
import { Infrastructure } from '../../../../../model/infrastructure/infrastructure';
import { environment } from "../../../../../../environments/environment";
declare var $:any;
declare let toastr:any;
@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./infra-m-list.html",
    encapsulation: ViewEncapsulation.None,
    providers: [InfrastructureService]
})
export class InfraMListComponent implements OnInit, AfterViewInit {

    datatable: any;
    token : string;
    bearToken : string;
    userid: string;
    confirmMsg : string;
    deleteId: any;
    isEditable = false;
    loading: boolean = false;
    message: any = {
         success: "Permohonan Prasarana Telah Berjaya Dibatalkan"
    }

    constructor(private elRef: ElementRef, private router: Router,private infrastructureService: InfrastructureService) {

    }
    ngOnInit() {
        this.bearToken = "Bearer "+localStorage.getItem('jwtToken');
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.userid = currentUser.id;
    }
    ngAfterViewInit() {
       var options = {
            data: {
                    type: "remote",
                    source: {
                        read: {
                            url: environment.hostname+"/api/infrastructure/"+this.userid,
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
                                title: "Baru",
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
                        var toreturn = '<a href="/infra/view/'+ t.id +'" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill btn-outline-success" title="Lihat Maklumat">\t\t\t\t\t\t\t<i class="la la-edit"></i>\t\t\t\t\t\t</a>';
                        if(t.status == 1){
                            toreturn = toreturn + '<a href="/infra-management/application/'+ t.id +'" class="m-portlet__nav-link btn m-btn m-btn--hover-primary m-btn--icon m-btn--icon-only m-btn--pill btn-outline-primary" title="Kemaskini Maklumat">\t\t\t\t\t\t\t<i class="la la-pencil"></i>\t\t\t\t\t\t</a>\t\t\t\t\t\t<button id="'+t.id+'" class="deleteFn m-portlet__nav-link btn m-btn m-btn--hover-warning m-btn--icon m-btn--icon-only m-btn--pill btn-outline-warning" title="Batal Permohonan">\t\t\t\t\t\t\t<i class="la la-trash"></i>\t\t\t\t\t\t</a>\t\t\t\t\t';
                        }
                        return toreturn;
                    }

                }]
            }

            let datatable = (<any>$('#infraList')).mDatatable(options);
            this.datatable = datatable;
          $("#m_form_search").on("keyup", function(e) {
              datatable.setDataSourceParam("search", $(this).val());
              datatable.load();
          })

          var flag = localStorage.getItem('RELOAD');
          if(flag == 'YES'){
            datatable.reload();
            localStorage.removeItem('RELOAD');
          }

          $(document).on('click', '.deleteFn',  (e) => {
            e.preventDefault()
            var id = $(e.target).closest('.m-datatable__row').find('[data-field="id"]').find('.m-checkbox > input').val();
            var newid = id.toString();
            
            this.batalInfra(newid)
            
          });
    }

    batalInfra(id: string){
        this.confirmMsg = "Adakah anda pasti untuk membatalkan permohonan prasana ini ?";
        this.deleteId = id;
        $('#modal_batal').modal('show');
    }

    batal(){
        this.infrastructureService.getInfrastructureById(this.deleteId).subscribe(
                infra =>{
                    var chch = infra;
                    
                        let infraStruc: Infrastructure = new Infrastructure(
                            null,
                            null,
                            null,
                            '4',
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            chch.adminRemarks,
                            null,
                            null,
                            chch.user,
                            null,
                            chch.id
                        );
                      this.infrastructureService.updateInfrastructure(infraStruc).subscribe(
                          suceess=>{
                            this.isEditable = true;
                            this.loading = false;
                            this.datatable.reload();
                            toastr.success(this.message.success);
                            $('#modal_batal').modal('hide');
                        }
                      );
                    
                }
            );
    }

redirectNewInfraPage(){
    this.router.navigate(['infra-management/application']);
}
}
