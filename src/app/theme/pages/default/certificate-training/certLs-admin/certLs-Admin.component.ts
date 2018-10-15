import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, NavigationEnd} from '@angular/router';
import { Location } from "@angular/common";

import { Certification } from '../../../../../model/certification/certification';
import { Agency } from '../../../../../model/setup/agency';
import { CertificationService } from '../../../../../services/certification/certification.service'

import { environment } from "../../../../../../environments/environment";

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./certLs-Admin.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [CertificationService]
})
export class CertListAdminComponent implements OnInit, AfterViewInit, OnDestroy {

    datatable: any;
    token : string;
    bearToken : string;

    certification: Certification;
    id: string;
    
    user: any;

    certForm: FormGroup;
    private sub: any;

    constructor(private _script: ScriptLoaderService, private certificationService:CertificationService, private router:Router, private route: ActivatedRoute) { }
    

    ngOnInit() {

        this.bearToken = "Bearer "+localStorage.getItem('jwtToken');


        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];

            this.certificationService.getUserByCertification(this.id).subscribe(
                data => {
                  this.user = data;
        }
      );
        });

        this.certForm = new FormGroup({
            name: new FormControl({value: '', disabled: true}, Validators.required),
        
        })
    
    
    }

    redirectValuation(id){
        this.router.navigate(['/cert/approval/'+id]);
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
                            url: environment.hostname+ "/api/certificationUser/all",
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
                    template: function(row){
                        var user = row.user;

                        if(user!=null){
                            user = user.name;
                        }else{
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
                    template: function(row){
                        var user = row.user;
                        var result = "";
                        if(user!=null){
                            var agency = user.agency;
                            if(agency != null){
                                result = agency.name;
                            }else{
                                result = "";
                            }
                        }else{
                            result = "";
                        }

                        return result;
                    }
                }, {
                    field: "title",
                    title: "Nama Persijilan",
                    sortable: "asc",
                    filterable: !1,
                    width: 150,
                    template: function(row){
                        return row.certification.title;
                    }
                 },{
                    field: "status",
                    title: "Status",
                    template: function(row) {
                        var status = row.status;
                          if(status === '1'){
                            status = '<span class="m-badge m-badge--brand m-badge--wide">Permohonan Baru</span>';
                          }else if(status === '2'){
                            status = '<span class="m-badge m-badge--metal m-badge--wide">Penilaian</span>';
                          }else if(status === '3'){
                            status = '<span class="m-badge m-badge--success m-badge--wide">Diterima</span>';  
                          }else if(status === '4'){
                            status = '<span class="m-badge m-badge--danger m-badge--wide">Ditolak</span>';
                          }
                          else if(status === '5'){
                            status = '<span class="m-badge m-badge--warning m-badge--wide">Dibatal</span>';
                          }
                          return status;
                        }
                }, {
                    field: "Tindakan",
                    width: 110,
                    title: "Tindakan",
                    sortable: !1,
                    overflow: "visible",
                    template: function(t) {

                      var status = t.status;

                      var htmlNew = '<a href="/cert/approval/'+t.id+'" class="m-portlet__nav-link btn m-btn m-btn--hover-primary m-btn--icon m-btn--icon-only m-btn--pill btn-outline-primary" title="Kelulusan">\t\t\t\t\t\t\t<i class="la la-pencil"></i>\t\t\t\t\t\t</a>';
                      var htmlRO = '<a href="/cert/approval/view/'+t.id+'" class="m-portlet__nav-link btn m-btn m-btn--hover-primary m-btn--icon m-btn--icon-only m-btn--pill btn-outline-primary" title="Lihat Maklumat">\t\t\t\t\t\t\t<i class="la la-ellipsis-h"></i>\t\t\t\t\t\t</a>';

                      if(status == '1'){
                        return htmlNew;
                      }else{
                        return htmlRO;
                      }
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
        
           }
         }