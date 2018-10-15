import { Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef  } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { NavigationEnd, Router } from '@angular/router';

import { Capability } from '../../../../../model/capability/capability';
import { CapabilityUser } from '../../../../../model/capability/capabilityUser';
import { CapabilityService } from '../../../../../services/capability/capability.service';
import { UserService } from '../../../../../services/user.service';

import { environment } from "../../../../../../environments/environment";
declare var $:any;
declare let toastr:any;

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./cap-list.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [CapabilityService, UserService]
})
export class CapListComponent implements OnInit, AfterViewInit {

	datatable: any;
    token : string;
    bearToken : string;
    userid : string;
    userobj: any;
    confirmMsg : string;
    deleteId: any;
    isEditable = false;
    loading: boolean = false;
    message: any = {
         success: "Permohonan Kepakaran Telah Berjaya Dibatalkan"
    }

    constructor(private _script: ScriptLoaderService, private router: Router, private capabilityService:CapabilityService, private userService: UserService) { }

    ngOnInit() {
    	this.bearToken = "Bearer "+localStorage.getItem('jwtToken');
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.userid = currentUser.id;
        this.userService.getUserById(this.userid).subscribe(
            data=>{
                this.userobj = data;
            }
        )
    }

    ngAfterViewInit() {
            var options = {
                data: {
                    type: "remote",
                    source: {
                        read: {
                            url: environment.hostname+"/api/capability/user/list/" +this.userid,
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
                    title: "Nama Kepakaran",
                    sortable: "asc",
                    filterable: !1,
                    width: 150,
                    template: function(row){
                        return row.capability.name;
                    }
                }, {
                    field: "kepakaran",
                    title: "Teknologi",
                    sortable: "asc",
                    filterable: !1,
                    width: 150,
                    template: function(row){
                        return row.capability.kepakaran.name;
                    }
                }, {
                    field: "starting_date",
                    title: "Tarikh Mula",
                    type: 'datetime',
                    filterable: !1,
                    sortable: !1,
                    template:    function (row) {
                        var date = row.capability.starting_date;
                        if(date == null){
                          return "";
                        }else{
                          var datemagic = new Date(date);
                          var day = datemagic.getDate();
                          var month = datemagic.getMonth()+1;
                          var year = datemagic.getFullYear();
                          return day + '/' + month + '/' + year;
                        }
                        
                    }
                }, {
                    field: "ending_date",
                    title: "Tarikh Tamat",
                    type: 'datetime',
                    filterable: !1,
                    sortable: !1,
                    template:    function (row) {
                        var date = row.capability.ending_date;
                        if(date == null){
                          return "";
                        }else{
                          var datemagic = new Date(date);
                          var day = datemagic.getDate();
                          var month = datemagic.getMonth()+1;
                          var year = datemagic.getFullYear();
                          return day + '/' + month + '/' + year;
                        }
                   },
                },  {
                    field: "status",
                    title: "Status",
                    template: function(t) {
                        var newStatus = t.status;
                        var e = {
                            1: {
                                title: "Permohonan Baru",
                                class: "m-badge--brand"
                            },
                            2: {
                                title: "Penilaian",
                                class: "m-badge--metal"
                            },
                            3: {
                                title: "Diterima",
                                class: "m-badge--success"
                            },
                            4: {
                                title: "Ditolak",
                                class: "m-badge--danger"
                            },
                            5: {
                                title: "Dibatal",
                                class: "m-badge--warning"
                            }
                        };
                        return '<span class="m-badge ' + e[t.status].class + ' m-badge--wide">' + e[t.status].title + "</span>"
                    }
                },

                {
                    field: "Tindakan",
                    width: 150,
                    title: "Tindakan",
                    sortable: !1,
                    overflow: "visible",
                    template: function(t) {
                        

                        var toreturn = '<a href="/cap/view/'+ t.capability.id +'" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill btn-outline-success" title="Lihat Maklumat">\t\t\t\t\t\t\t<i class="la la-ellipsis-h"></i>\t\t\t\t\t\t</a>\t\t\t\t\t\t'
                        if(t.status=="1"||t.status=="2"){
                            return toreturn + '<button id="'+t.id+'" class="deleteFn m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill btn-outline-danger" title="Batal Permohonan">\t\t\t\t\t\t\t<i class="la la-times"></i>\t\t\t\t\t\t</a>\t\t\t\t\t';
                        }else if(t.status=="3") {
                            return toreturn + '<a href="/cap/attendance/'+ t.capability.id +'" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill btn-outline-success" title="Kehadiran">\t\t\t\t\t\t\t<i class="la la-calendar"></i>\t\t\t\t\t\t</a>\t\t\t\t\t\t';
                        }else{
                            return toreturn;
                        }

                        
                        
                    }

                }]
               }

          let datatable = (<any>$('#capabilityUserList')).mDatatable(options);
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

           $(document).on('click', '.deleteFn', (e) =>{
               e.preventDefault()
              var id = $(e.target).closest('.m-datatable__row').find('[data-field="id"]').find('.m-checkbox > input').val();
              var newid = id.toString();

               var title = $(e.target).closest('.m-datatable__row').find('[data-field="name"]').text();
               this.batalCap(newid, title)
               
           })

           }

    batalCap(capId: string, title: string) {
       this.confirmMsg = "Adakah anda pasti untuk membatalkan permohonan kepakaran: "+title+" ?";
       this.deleteId = capId;
       $('#m_modal_batal').modal('show');
    }

    batal(){
        this.capabilityService.getCapUserById(this.deleteId).subscribe(
        capabilityUser=>{
            
               let batal: CapabilityUser = new CapabilityUser(
                   null,
                   null,
                   '5',
                   null,
                   null,
                   null,
                   null,
                   this.userobj,
                   capabilityUser.id
               );
               
               this.capabilityService.updateCapabilityUser(batal).subscribe(
                   success=>{
                        this.isEditable = true;
                        this.loading = false;
                        this.datatable.reload();
                        toastr.success(this.message.success);
                        $('#m_modal_batal').modal('hide');
                   }
               )
            
        })
    }
    redirectNewCapListPage() {
    this.router.navigate(['cap/register']);
    }

}
