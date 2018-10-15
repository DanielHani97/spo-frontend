import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { environment } from "../../../../../../environments/environment";

import { AppAuthority } from "../../../../../model/setup/appauthority";

import { RoleService } from '../../../../../services/setup/role.service';

import { message } from "../../../../../message/default";

declare let toastr:any;
declare let jQuery:any;

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./role-approval-list.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [RoleService]
})
export class RoleApprovalListComponent implements OnInit, AfterViewInit {

    bearToken : string;

    confirmType: string;
    confirmMsg: string;
    btnAction: string;

    id: string;
    allId: any[];

    datatable: any;
    datatable2: any;

    constructor(private _script: ScriptLoaderService, private roleService: RoleService) {

    }
    ngOnInit() {
        this.bearToken = "Bearer "+localStorage.getItem('jwtToken');
    }

    ngAfterViewInit() {

      //{ begin auditTrail table}
      var option = {
        data: {
            type: "remote",
            source: {
                read: {
                    url: environment.hostname+"/api/role/listAudit",
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
            field: "createdby",
            title: "Pemohon",
            sortable: "asc",
            template : function(row){
              var result;
              var e = row.createdby;
              if (e==null){
                 result = " ";
              }else{
                  result = row.createdby.name;
              }

              return result;
            }
        },{
            field: "createdon",
            title: "Tarikh Permohonan",
            overflow: "visible",
            template: function(row) {
              var result;
              var e = row.createdon;
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
        }, {
            field: "Peranan",
            title: "Peranan",
            sortable: !1,
            filterable: !1,
            width: 100,
            template : function(row){
              return row.authority.rolename
            }
        }, {
            field: "status",
            title: "Status",
            template : function(row){
              var status = row.status;
              if(status === 'NEW'){
                status = '<span class="m-badge m-badge--primary m-badge--wide">Permohonan Baru</span>';
              }else if(status === 'REJECT'){
                status = '<span class="m-badge m-badge--danger m-badge--wide">Ditolak</span>';
              }else if(status === 'APPROVE'){
                status = '<span class="m-badge m-badge--success m-badge--wide">Diluluskan</span>';
              }
              return status;
            }
        }, {
            field: "modifiedby",
            title: "Pelaksana",
            template : function(row){
              var result;
              var e = row.modifiedby;
              if (e==null){
                 result = " ";
              }else{
                  result = row.modifiedby.name;
              }

              return result;
            }
        },{
            field: "modifiedon",
            title: "Tarikh Perlaksanaan",
            overflow: "visible",
            template: function(row) {
              var result;
              var e = row.modifiedon;
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
        }]
      }

      let datatable2 = (<any>$('#audit_table')).mDatatable(option);

      this.datatable2 = datatable2;

      $("#m_form_search2").on("keyup", function(e) {
          datatable2.setDataSourceParam("search", $(this).val());
          datatable2.load();
      })
      //{ end auditTrail table }

      //{ begin approval table}
      var options = {
        data: {
            type: "remote",
            source: {
                read: {
                    url: environment.hostname+"/api/role/list",
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
            title: "Nama",
            sortable: "asc",
            filterable: !1,
            width: 150,
            template : function(row){
              return row.user.name
            }
        }, {
            field: "agency",
            title: "Agensi",
            width: 150,
            template : function(row){

              var type = row.user.type;
              var result = "";

              if(type == 'GOV'){
                var agency = row.user.agency;
                if(agency!=null){
                  result = agency.name;
                }
              }else if(type == 'PRIVATE'){
                var company = row.user.company;
                if(company!=null){
                  result = company.name;
                }
              }else{
                result = "";
              }

              return result;
            }
        }, {
            field: "Emel",
            title: "Emel",
            sortable: !1,
            template : function(row){
              return row.user.email
            }
        }, {
            field: "Peranan",
            title: "Peranan",
            width: 100,
            template : function(row){
              return row.authority.rolename
            }
        }, {
            field: "status",
            title: "Status",
            template : function(row){
              var status = row.status;
              if(status === 'NEW'){
                status = '<span class="m-badge m-badge--primary m-badge--wide">Permohonan Baru</span>';
              }else if(status === 'REJECT'){
                status = '<span class="m-badge m-badge--danger m-badge--wide">Ditolak</span>';
              }else if(status === 'APPROVE'){
                status = '<span class="m-badge m-badge--success m-badge--wide">Lulus</span>';
              }
              return status;
            }
        },{
            field: "Actions",
            width: 110,
            title: "Actions",
            sortable: !1,
            overflow: "visible",
            template: function(t) {

              var status = t.status;

              var htmlNew = '<a href="/role/application/approval/'+t.id+'" class="m-portlet__nav-link btn m-btn m-btn--hover-primary m-btn--icon m-btn--icon-only m-btn--pill btn-outline-primary" title="Edit details">\t\t\t\t\t\t\t<i class="la la-pencil"></i>\t\t\t\t\t\t</a>'+
              '\t\t\t\t\t\t<button id="'+t.id+'" class="approveFn m-portlet__nav-link btn m-btn m-btn--hover-success m-btn--icon m-btn--icon-only m-btn--pill btn-outline-success" title="Delete">\t\t\t\t\t\t\t<i class="la la-check"></i>\t\t\t\t\t\t</button>\t\t\t\t\t'+
              '\t\t\t\t\t\t<button id="'+t.id+'" class="rejectFn m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill btn-outline-danger" title="Delete">\t\t\t\t\t\t\t<i class="la la-times"></i>\t\t\t\t\t\t</button>\t\t\t\t\t';

              var htmlRO = '<a href="/role/application/approval/'+t.id+'" class="m-portlet__nav-link btn m-btn m-btn--hover-primary m-btn--icon m-btn--icon-only m-btn--pill btn-outline-primary" title="Edit details">\t\t\t\t\t\t\t<i class="la la-ellipsis-h"></i>\t\t\t\t\t\t</a>';

              if(status == 'NEW'){
                return htmlNew;
              }else{
                return htmlRO;
              }


            }
        }]
      }

      let datatable = (<any>$('#approval_table')).mDatatable(options);

      this.datatable = datatable;

      $("#m_form_search").on("keyup", function(e) {
          datatable.setDataSourceParam("search", $(this).val());
          console.log($(this).val());
          datatable.load();
      })

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

      $(document).on('click', '.rejectFn', (e) => {
        e.preventDefault();

        this.btnAction = "REJECT";
        this.confirmType = "danger";
        this.confirmMsg = message.global.confirmReject;
        jQuery('#m_modal_add').modal('show');

        var id = $(e.target).closest('.m-datatable__row').find('[data-field="id"]').find('.m-checkbox > input').val();
        this.id = id.toString();
      });

      $(document).on('click', '.approveFn', (e) => {
        e.preventDefault();

        this.btnAction = "APPROVE";
        this.confirmType = "success";
        this.confirmMsg = message.global.confirmApprove;
        jQuery('#m_modal_add').modal('show');

        var id = $(e.target).closest('.m-datatable__row').find('[data-field="id"]').find('.m-checkbox > input').val();
        this.id = id.toString();
      });

      //{ end approval table}

    }

    onConfirm($event) {
      $event.preventDefault();

      let currentUser = JSON.parse(localStorage.getItem("currentUser"));

      if(this.btnAction === "APPROVE"){
        //approve
        let app: AppAuthority = new AppAuthority(
        this.id,
        null,
        "APPROVE",
        null,
        null,
        null,
        null,
        null,
        currentUser,
        null);

        this.roleService.updateAppAuth(app).subscribe(
          success => {
            toastr.success(message.global.approve);
            jQuery('#m_modal_add').modal('hide');
            this.datatable.reload();
          }
        );
      }else if(this.btnAction === "REJECT"){
        //reject
        let app: AppAuthority = new AppAuthority(
        this.id,
        null,
        "REJECT",
        null,
        null,
        null,
        null,
        null,
        currentUser,
        null);

        this.roleService.updateAppAuth(app).subscribe(
          success => {
            toastr.success(message.global.reject);
            jQuery('#m_modal_add').modal('hide');
            this.datatable.reload();
          }
        );
      }else if(this.btnAction === "REJECT_ALL"){
        //REJECT_ALL ALL
        for(let id of this.allId){
          let app: AppAuthority = new AppAuthority(
          id,
          null,
          "REJECT",
          null,
          null,
          null,
          null,
          null,
          currentUser,
          null);

          this.roleService.updateAppAuth(app).subscribe();
        }
        toastr.success(message.global.approve);
        jQuery('#m_modal_add').modal('hide');
        setTimeout(()=>{ this.datatable.reload(); }, 2000)
      }else if(this.btnAction === "APPROVE_ALL"){
        //APPROVE ALL
        for(let id of this.allId){
          let app: AppAuthority = new AppAuthority(
          id,
          null,
          "APPROVE",
          null,
          null,
          null,
          null,
          null,
          currentUser,
          null);

          this.roleService.updateAppAuth(app).subscribe();
        }
        toastr.success(message.global.approve);
        jQuery('#m_modal_add').modal('hide');
        setTimeout(()=>{ this.datatable.reload(); }, 2000)

      }
    }

}
