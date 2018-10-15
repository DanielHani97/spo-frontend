import { Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { NavigationEnd, Router } from '@angular/router';

import { Agency } from '../../../../../model/setup/agency';
import { AgencyService } from '../../../../../services/setup/agency.service';

import { environment } from "../../../../../../environments/environment";

import { message } from "../../../../../message/default";

declare let toastr:any;
declare let jQuery:any;

@Component({
    selector: '.m-grid__item.m-grid__item--fluid.m-wrapper',
    templateUrl: "./agency-list.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [AgencyService]
})
export class AgencyListComponent implements OnInit, AfterViewInit{

    //datatable: any;
    token : string;
    bearToken : string;
    allId: any[];
    id: string;

    confirmType: string;
    confirmMsg: string;
    btnAction: string;

    datatable: any;

    constructor(private elRef: ElementRef, private router: Router, private agencyService:AgencyService) { }

    ngOnInit() {
      this.bearToken = "Bearer "+localStorage.getItem('jwtToken');
    }

    ngAfterViewInit() {

      var options = {
        data: {
            type: "remote",
            source: {
                read: {
                    url: environment.hostname+"/api/agency",
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
                class: "m-checkbox--solid m-checkbox--brand cbFn"
            }
        }, {
            field: "name",
            title: "Nama",
            sortable: "asc",
            filterable: !1,
            width: 150
        }, {
            field: "code",
            title: "Nama Singkatan",
            width: 150
        }, {
            field: "state",
            title: "Negeri",
            sortable: !1,
            template: function(row){
              var state = row.state;
              if(state == null){
                return "";
              }else{
                return row.state.name;
              }
            }
        }, {
            field: "city",
            title: "Bandar",
            width: 100,
            template: function(row){
              var city = row.city;
              if(city == null){
                return "";
              }else{
                return row.city.name;
              }
            }
        }, {
            field: "phoneNo",
            title: "No Tel."
        },{
            field: "Actions",
            width: 110,
            title: "Actions",
            sortable: !1,
            overflow: "visible",
            template: function(t) {
                return '<a href="/agency/edit/'+t.id+'" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill btn-outline-success" title="Edit details">\t\t\t\t\t\t\t<i class="la la-pencil"></i>\t\t\t\t\t\t</a>\t\t\t\t\t\t'+
                '<button id="'+t.id+'" class="agencyDeleteFn m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill btn-outline-danger" title="Delete">\t\t\t\t\t\t\t<i class="la la-trash"></i>\t\t\t\t\t\t</button>\t\t\t\t\t'
            }
        }]
      }

      var datatable = (<any>$('#agencyList')).mDatatable(options);
      this.datatable = datatable;

      $("#m_form_search").on("keyup", function(e) {
          datatable.setDataSourceParam("search", $(this).val());
          datatable.load();
      })

      $(document).on('click', '#m_datatable_check_all', (e) => {
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
         this.btnAction = "DELETE_ALL";
         this.confirmMsg = message.global.confirmDelete;
         jQuery('#m_modal_add').modal('show');
      });

      $(".m_datatable").on("m-datatable--on-check", function(e, a) {
          var l = datatable.setSelectedRecords().getSelectedRecords().length;
          $("#m_datatable_selected_number").html(l), l > 0 && $("#m_datatable_group_action_form").slideDown()
      }).on("m-datatable--on-uncheck m-datatable--on-layout-updated", function(e, a) {
          var l = datatable.setSelectedRecords().getSelectedRecords().length;
          $("#m_datatable_selected_number").html(l), 0 === l && $("#m_datatable_group_action_form").slideUp()
      })

      $(document).on('click', '.agencyDeleteFn', (e) => {
        e.preventDefault();
        var id = $(e.target).closest('.m-datatable__row').find('[data-field="id"]').find('.m-checkbox > input').val();
        var newid = id.toString();

        this.id = newid;
        this.btnAction = "DELETE";
        this.confirmMsg = message.global.confirmDelete;
        jQuery('#m_modal_add').modal('show');

      });

    }

    redirectNewAgencyPage() {
    this.router.navigate(['agency/setup']);
  }

   deleteAgency(agencyId: string) {
       this.agencyService.deleteAgencyById(agencyId)
 	      .subscribe(
          successCode => {
           console.log("MASUK1111");
 		      },
       		errorCode => {
           console.log("MASUK222");
          });
   }

   onConfirm($event) {
     $event.preventDefault();

     let currentUser = JSON.parse(localStorage.getItem("currentUser"));

     if(this.btnAction === "DELETE"){
       //DELETE
       if(this.id){
         this.agencyService.deleteAgencyById(this.id)
           .subscribe(
            successCode => {
              toastr.success(message.global.successDelete);
              jQuery('#m_modal_add').modal('hide');
               this.datatable.reload();
             },
             errorCode => {
               toastr.success(message.global.successDelete);
               jQuery('#m_modal_add').modal('hide');
               this.datatable.reload();
            });
       }

     }else if(this.btnAction === "DELETE_ALL"){
       //DELETE_ALL
       for(let id of this.allId){
         this.agencyService.deleteAgencyById(id)
           .subscribe();
       }
       toastr.success(message.global.successDelete);
       jQuery('#m_modal_add').modal('hide');
       setTimeout(()=>{ this.datatable.reload(); }, 2000)
     }
   }
}
