import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { Router } from '@angular/router';

import { User } from '../../../../../model/user';
import { UserService } from '../../../../../services/user.service';

import { environment } from "../../../../../../environments/environment";

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./user-m-list.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [UserService]
})
export class UserMListComponent implements OnInit, AfterViewInit {

    bearToken : string;

    constructor(
      private _script: ScriptLoaderService,
      private router: Router,
      private userService:UserService
    ) {

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
                                url: environment.hostname+"/api/user/list",
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
                        field: "username",
                        title: "No Kad Pengenalan",
                        sortable: !1,
                        width: 150
                    }, {
                        field: "email",
                        title: "Emel",
                        sortable: !1
                    }, {
                        field: "position",
                        title: "Jawatan",
                        width: 100,
                        sortable: !1
                    },{
                        field: "agency",
                        title: "Agensi",
                        width: 150,
                        sortable: !1,
                        template: function(row){

                          var type = row.type;
                          var result = "";

                          if(type == 'GOV'){
                            var agency = row.agency;
                            if(agency!=null){
                              result = agency.name;
                            }
                          }else if(type == 'PRIVATE'){
                            var company = row.company;
                            if(company!=null){
                              result = company.name;
                            }
                          }else{
                            result = "";
                          }

                          return result;
                        }
                    },
                    {
                        field: "enabled",
                        title: "Status",
                        width: 100,
                        template : function(row){
                          var status = row.enabled;
                          if(status){
                            status = '<span class="m-badge m-badge--success m-badge--wide">Aktif</span>';
                          }else{
                            status = '<span class="m-badge m-badge--danger m-badge--wide">Tidak Aktif</span>';
                          }

                          return status;
                        }
                    },{
                        field: "Actions",
                        title: "Actions",
                        width: 80,
                        sortable: !1,
                        overflow: "visible",
                        template: function(t) {

                          var htmlNew = '<a href="/user/edit/'+t.id+'" class="m-portlet__nav-link btn m-btn m-btn--hover-primary m-btn--icon m-btn--icon-only m-btn--pill btn-outline-primary" title="Edit details">\t\t\t\t\t\t\t<i class="la la-pencil"></i>\t\t\t\t\t\t</a>\t\t\t\t\t\t<a href="/header/profile/view/'+t.id+'" class="m-portlet__nav-link btn m-btn m-btn--hover-primary m-btn--icon m-btn--icon-only m-btn--pill btn-outline-primary" title="Lihat Profil">\t\t\t\t\t\t\t<i class="la la-user"></i>\t\t\t\t\t\t</a>';

                          return htmlNew;
                        }
                    }]
                  }

      let datatable = (<any>$('#userList')).mDatatable(options);

      $("#m_form_search").on("keyup", function(e) {
          datatable.setDataSourceParam("search", $(this).val());
          console.log($(this).val());
          datatable.load();
      })

    }

    redirectNewApp() {
    this.router.navigate(['user/new']);
  }

}
