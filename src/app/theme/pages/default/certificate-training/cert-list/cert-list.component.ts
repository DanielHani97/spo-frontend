import { Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef} from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { NavigationEnd, Router } from '@angular/router';

import { Technology } from '../../../../../model/setup/technology';
import { Certification } from '../../../../../model/certification/certification';
import { CertificationUser } from '../../../../../model/certification/certificationUser';
import { CertificationService } from '../../../../../services/certification/certification.service';
import { UserService } from '../../../../../services/user.service';

import { environment } from "../../../../../../environments/environment";
declare var $:any;
declare let toastr:any;

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./cert-list.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [CertificationService, UserService]

})
export class CertListComponent implements OnInit, AfterViewInit {

    datatable: any;
    token : string;
    bearToken : string;
    userid : string;
    batalId : any;
    isEditable = false;
    loading: boolean = false;
    userId : string;
    objUser : any;

    message: any = {
      success: "Permohonan latihan persijilan telah berjaya dibatalkan"
    }

    confirmType : string = "danger";
    confirmMsg : string;

    constructor(private _script: ScriptLoaderService, private router: Router, private certificationService:CertificationService, private userService:UserService) { }


    ngOnInit() {

        this.bearToken = "Bearer "+localStorage.getItem('jwtToken');
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.userid = currentUser.id;

        this.userService.getUserById(this.userid).subscribe(
                        data=>{
                            this.objUser = data;
                        }
                    )
    }

    ngAfterViewInit() {

        var options = {
                data: {
                    type: "remote",
                    source: {
                        read: {
                            url: environment.hostname+"/api/certification/user/list/" +this.userid,
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
                    field: "title",
                    title: "Nama Persijilan",
                    sortable: "asc",
                    filterable: !1,
                    width: 150,
                    template: function(row){
                        return row.certification.title;
                    }
                }, {
                    field: "technology",
                    title: "Teknologi",
                    sortable: "asc",
                    filterable: !1,
                    width: 150,
                    template: function(row){
                         var result = row.certification.technology;
                        if(result!=null){
                          result = row.certification.technology.name
                        }else{
                          result = "";
                        }
                        return result;
                       }
                }, {
                    field: "startDate",
                    title: "Tarikh Mula",
                    type: 'datetime',
                    sortable: "asc",
                    template:    function (row) {
                        var date = row.certification.startDate;
                        var datemagic = new Date(date);
                        var day = datemagic.getDate();
                        var month = datemagic.getMonth()+1;
                        var year = datemagic.getFullYear();
                        return day + '/' + month + '/' + year;
                 },
                }, {
                    field: "end_date",
                    title: "Tarikh Tamat",
                    type: 'datetime',
                    sortable: "asc",
                    template:    function (row) {
                        var date = row.certification.endDate;
                        var datemagic = new Date(date);
                        var day = datemagic.getDate();
                        var month = datemagic.getMonth()+1;
                        var year = datemagic.getFullYear();
                        return day + '/' + month + '/' + year;
                   },
                }, {
                    field: "place",
                    title: "Tempat",
                    sortable: "asc",
                    filterable: !1,
                    width: 150,
                    template: function(row){
                        return row.certification.place;
                    }

                },
                {
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
                },

                {
                    field: "Tindakan",
                    width: 150,
                    title: "Tindakan",
                    sortable: !1,
                    overflow: "visible",
                    template: function(t) {
                        var status = t.status;

                      var date = t.certification.startDate;
                      var date2 = new Date(t.certification.endDate);
                      let ngbDate3 = {year: date2.getFullYear(), month: date2.getMonth()+1, day: date2.getDate()+3};
                      var date3 = new Date(ngbDate3.year, ngbDate3.month-1, ngbDate3.day);

                      var today = new Date();

                      var htmlBaru = '<a href="/cert/details/view/'+t.certification.id+'" class="m-portlet__nav-link btn m-btn m-btn--hover-primary m-btn--icon m-btn--icon-only m-btn--pill btn-outline-primary" title="Lihat Maklumat">\t\t\t\t\t\t\t<i class="la la-ellipsis-h"></i>\t\t\t\t\t\t</a>\t\t\t\t\t\t<button id="'+t.id+'" class="rejectFn m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill btn-outline-danger" title="Batal Permohonan">\t\t\t\t\t\t\t<i class="la la-times"></i>\t\t\t\t\t\t</a>\t\t\t\t\t';
                      var htmlNew = '<a href="/cert/details/view/'+t.certification.id+'" class="m-portlet__nav-link btn m-btn m-btn--hover-primary m-btn--icon m-btn--icon-only m-btn--pill btn-outline-primary" title="Lihat Maklumat">\t\t\t\t\t\t\t<i class="la la-ellipsis-h"></i>\t\t\t\t\t\t</a>\t\t\t\t\t\t<a href="/cert/preattendance/'+t.id+'" class="m-portlet__nav-link btn m-btn m-btn--hover-primary m-btn--icon m-btn--icon-only m-btn--pill btn-outline-success" title="Pra Kehadiran">\t\t\t\t\t\t\t<i class="la la-calendar"></i>\t\t\t\t\t\t</a>';
                      var htmlAttend = '<a href="/cert/details/view/'+t.certification.id+'" class="m-portlet__nav-link btn m-btn m-btn--hover-primary m-btn--icon m-btn--icon-only m-btn--pill btn-outline-primary" title="Lihat Maklumat">\t\t\t\t\t\t\t<i class="la la-ellipsis-h"></i>\t\t\t\t\t\t</a>\t\t\t\t\t\t<a href="/cert/attendance/'+t.id+'" class="m-portlet__nav-link btn m-btn m-btn--hover-primary m-btn--icon m-btn--icon-only m-btn--pill btn-outline-success" title="Kehadiran">\t\t\t\t\t\t\t<i class="la la-calendar"></i>\t\t\t\t\t\t</a>';
                      var htmlRO = '<a href="/cert/details/view/'+t.certification.id+'" class="m-portlet__nav-link btn m-btn m-btn--hover-primary m-btn--icon m-btn--icon-only m-btn--pill btn-outline-primary" title="Lihat Maklumat">\t\t\t\t\t\t\t<i class="la la-ellipsis-h"></i>\t\t\t\t\t\t</a>';

                      if(status == '1'){
                        return htmlBaru;
                      // }else if (status =='3' &&  today <= date){
                      //   return htmlNew;
                      // }else if (status =='3' && (today > date2 && today <= date3)){
                      //   return htmlAttend;
                      }else if (status =='3'){
                        return htmlAttend;
                      }else {
                        return htmlRO;
                      }
                    }
                }]
              }


          let datatable = (<any>$('#recordList')).mDatatable(options);
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

       $(document).on('click', '.rejectFn',  ($event) => {
            var id = $(event.target).closest('.m-datatable__row').find('[data-field="id"]').find('.m-checkbox > input').val();
            var newid = id.toString();
            var title = $($event.target).closest('.m-datatable__row').find('[data-field="title"]').find('.m-checkbox > input').text();
            this.batalLatihan(newid, title)

      });

    }

   batalLatihan(trainingTxId: string, title: string) {
       this.confirmMsg = "Adakah anda pasti untuk membatalkan permohonan latihan "+title+" ?";
       this.batalId = trainingTxId;
       $('#m_modal_batal').modal('show');
    }

    batal() {
      this.certificationService.getCertificationUserById(this.batalId).subscribe(
            certUser =>{
                var cert = certUser;
                    let batal: CertificationUser = new CertificationUser(
                        null,
                        null,
                        //cert.coach_remarks,
                        cert.admin_remarks,
                        '5',
                        cert.id,
                        null,
                        null,
                        this.objUser,
                        null,
                        null,null
                    );

                  this.certificationService.updateCertificationUser(batal).subscribe(
                     success=>{
                        this.isEditable = true;
                        this.loading = false;
                        this.datatable.reload();
                        toastr.success(this.message.success);
                        $('#m_modal_batal').modal('hide');
                    });
                }
        );
    }

    redirectNewCertListPage() {
    this.router.navigate(['cert/register']);
    }

}
