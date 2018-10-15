import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { Router } from '@angular/router';

import { User } from '../../../../../model/user';
import { UserService } from '../../../../../services/user.service';

import { environment } from "../../../../../../environments/environment";

import { message } from "../../../../../message/default";

declare let toastr:any;
declare let jQuery:any;

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./user-m-list-application.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [UserService]
})
export class UserMListApplicationComponent implements OnInit, AfterViewInit {

    bearToken : string;
    confirmType: string;
    confirmMsg: string;
    id: string;

    allId: any[];

    datatable: any;

    btnAction: string;



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
                                url: environment.hostname+"/api/user/application",
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
                    },
                    {
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
                        field: "Tindakan",
                        title: "Tindakan",
                        width: 80,
                        sortable: !1,
                        overflow: "visible",
                        template: function(t) {

                          var htmlNew = '\t\t\t\t\t\t<button id="'+t.id+'" class="approveFn m-portlet__nav-link btn m-btn m-btn--hover-success m-btn--icon m-btn--icon-only m-btn--pill btn-outline-success" title="Delete">\t\t\t\t\t\t\t<i class="la la-check"></i>\t\t\t\t\t\t</button>\t\t\t\t\t';
                                        //'\t\t\t\t\t\t<button id="'+t.id+'" class="rejectFn m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill btn-outline-danger" title="Delete">\t\t\t\t\t\t\t<i class="la la-times"></i>\t\t\t\t\t\t</button>\t\t\t\t\t';

                          return htmlNew;
                        }
                    }]
                  }

      let datatable = (<any>$('#userListApp')).mDatatable(options);
      this.datatable = datatable;

      $("#m_form_search").on("keyup", function(e) {
          datatable.setDataSourceParam("search", $(this).val());
          console.log($(this).val());
          datatable.load();
      });

      $(document).on('click', '#m_datatable_check_all_approve', (e) => {
        e.preventDefault();

        let cbArr: any[] = new Array();

        var $cbAnswer = $(".m-datatable__body").find(".m-checkbox > input");
        $cbAnswer.each( function(i) {
          var status = $(this).is(":checked");
          if(status){
            var id = $(this).val();
            cbArr.push(id);
          }

         });
         this.allId = cbArr;

         this.btnAction = "APPROVE_ALL";
         this.confirmType = "success";
         this.confirmMsg = message.global.confirmApproveAll;
         jQuery('#m_modal_add').modal('show');

      });

      $(document).on('click', '#m_datatable_check_all_reject', (e) => {
        e.preventDefault();

        let cbArr: any[] = new Array();

        var $cbAnswer = $(".m-datatable__body").find(".m-checkbox > input");
        $cbAnswer.each( function(i) {
          var status = $(this).is(":checked");
          if(status){
            var id = $(this).val();
            cbArr.push(id);
          }

         });
         this.allId = cbArr;

         this.btnAction = "REJECT_ALL";
         this.confirmType = "danger";
         this.confirmMsg = message.global.confirmRejectAll;
         jQuery('#m_modal_add').modal('show');

      });

      $(".m_datatable").on("m-datatable--on-check", function(e, a) {
          var l = datatable.setSelectedRecords().getSelectedRecords().length;
          $("#m_datatable_selected_number").html(l), l > 0 && $("#m_datatable_group_action_form").slideDown()
      }).on("m-datatable--on-uncheck m-datatable--on-layout-updated", function(e, a) {
          var l = datatable.setSelectedRecords().getSelectedRecords().length;
          $("#m_datatable_selected_number").html(l), 0 === l && $("#m_datatable_group_action_form").slideUp()
      })

      $(document).on('click', '.approveFn', (e) => {
        e.preventDefault();

        this.btnAction = "APPROVE";
        this.confirmType = "success";
        this.confirmMsg = message.global.confirmApprove;
        jQuery('#m_modal_add').modal('show');

        var id = $(e.target).closest('.m-datatable__row').find('[data-field="id"]').find('.m-checkbox > input').val();
        this.id = id.toString();

      });

      $(document).on('click', '.rejectFn', (e) => {
        e.preventDefault();

        this.btnAction = "REJECT";
        this.confirmType = "danger";
        this.confirmMsg = message.global.confirmReject;
        jQuery('#m_modal_add').modal('show');

        var id = $(e.target).closest('.m-datatable__row').find('[data-field="id"]').find('.m-checkbox > input').val();
        this.id = id.toString();

        //reject function here

      });

    }

    onConfirm($event) {
      $event.preventDefault();
      if(this.btnAction === "APPROVE"){
        this.userService.updateStatusUser(this.id).subscribe(
          success => {
            toastr.success(message.global.approve);
            jQuery('#m_modal_add').modal('hide');
            this.datatable.reload();
          }
        );
      }else if(this.btnAction === "REJECT"){
        //reject
        toastr.success(message.global.reject);
          this.datatable.reload();
      }else if(this.btnAction === "REJECT_ALL"){
        //REJECT_ALL ALL
      }else if(this.btnAction === "APPROVE_ALL"){
        //APPROVE ALL
        for(let id of this.allId){
          this.userService.updateStatusUser(id).subscribe();
        }
        toastr.success(message.global.approve);
        jQuery('#m_modal_add').modal('hide');
        this.datatable.reload();
      }
    }

    redirectNewApp() {
    this.router.navigate(['user/new']);
  }

}
