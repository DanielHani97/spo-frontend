import { Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { NavigationEnd, Router } from '@angular/router';

import { Technology } from '../../../../../model/setup/technology';
import { Certification } from '../../../../../model/certification/certification';
import { CertificationService } from '../../../../../services/certification/certification.service';
import { Manday } from '../../../../../model/setup/manday';
import { MandayService } from '../../../../../services/setup/manday.service';

import { environment } from "../../../../../../environments/environment";
declare let toastr:any;
declare var jQuery:any;
declare var $:any;

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./cert-listing.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [CertificationService, MandayService]
})
export class CertificationListingComponent implements OnInit, AfterViewInit {

    datatable: any;
    datatable2:any;
    token : string;
    bearToken : string;
    mandayObj: any;
    padamId: any;
    isEditable = false;
    loading: boolean = false;

    manday: any;
    manday2:any;
    mandayUsed: any;
    mandayId: string;
    usedManday: number;

    message: any = {
      new: "Bilangan baki sesi latihan persijilan: " ,
      danger: "Bilangan baki sesi latihan persijilan: ",
      success: "Permohonan latihan persijilan telah berjaya dihapuskan"
    }

    confirmType : string = "success";
    confirmType2 : string = "danger";

    confirmMsg : string;

    constructor(private _script: ScriptLoaderService, private router: Router, private certificationService:CertificationService, private mandayService:MandayService) { }

    ngOnInit() {
         this.bearToken = "Bearer "+localStorage.getItem('jwtToken');

         this.mandayService.getManday().subscribe(
           data => {
                this.manday = data;
                this.manday2= this.manday.filter(value =>value.category==='certificate');
                this.mandayObj = this.manday2[0];
                this.usedManday = this.mandayObj.total - this.mandayObj.mandayUsed; //balance manday
          }
        );
    }

    ngAfterViewInit() {

              var options = {
                data: {
                    type: "remote",
                    source: {
                        read: {
                            url: environment.hostname+"/api/certification",
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
                    width: 150
                }, {
                    field: "technology",
                    title: "Teknologi",
                    sortable: "asc",
                    filterable: !1,
                    width: 150,
                    template: function(row){

                        var result = row.technology;
                        if(result!=null){
                          result = row.technology.name
                        }else{
                          result = "";
                        }
                        return result;
                       }
                }, {
                    field: "start_date",
                    title: "Tarikh Mula",
                    type: 'datetime',
                    sortable: "asc",
                    template:    function (row) {
                        var date = row.startDate;
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
                        var date = row.endDate;
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
                    width: 150
                }, {
                    field: "Tahap",
                    title: "Tahap Kesukaran",
                    width: 150,
                    sortable: "asc",
                    template: function (row){

                        var htmlInter = '<div class="m-widget4__info"> '+
                                        '<span class="fa fa-star star-checked w3-large"></span> '+
                                        '<span class="fa fa-star star-checked w3-large"></span> '+
                                        '<span class="fa fa-star star-checked w3-large"></span> '+
                                        '<span class="fa fa-star  w3-large"></span> '+
                                        '<span class="fa fa-star  w3-large"></span> '+
                                        '<span class="m-widget4__sub"></span> '+
                                    '</div>';

                      var htmlBegin = '<div class="m-widget4__info"> '+
                                        '<span class="fa fa-star star-checked w3-large"></span> '+
                                        '<span class="fa fa-star w3-large"></span> '+
                                        '<span class="fa fa-star w3-large"></span> '+
                                        '<span class="fa fa-star  w3-large"></span> '+
                                        '<span class="fa fa-star  w3-large"></span> '+
                                        '<span class="m-widget4__sub"></span> '+
                                    '</div>';

                      var htmlExp = '<div class="m-widget4__info"> '+
                                        '<span class="fa fa-star star-checked w3-large"></span> '+
                                        '<span class="fa fa-star star-checked w3-large"></span> '+
                                        '<span class="fa fa-star star-checked w3-large"></span> '+
                                        '<span class="fa fa-star star-checked w3-large"></span> '+
                                        '<span class="fa fa-star star-checked w3-large"></span> '+
                                        '<span class="m-widget4__sub"></span> '+
                                    '</div>';

                        var level = row.level;
                        if(level != null){
                            if(level == "Permulaan"){
                                return htmlBegin;
                            }else if(level == "Pertengahan"){
                                return htmlInter;
                            }if(level == "Mahir"){
                                return htmlExp;
                            }
                        }else{
                            return "";
                        }
                    }
                },
                {
                    field: "Status",
                    title: "Status",
                    template: function(t) {

                        var result = t.status;
                        if(result == "Aktif"){
                            return '<span class="m-badge m-badge--success m-badge--wide">Aktif</span>';
                        }else if(result == "Tidak Aktif"){
                            return '<span class="m-badge m-badge--danger m-badge--wide">Tidak Aktif</span>';
                        }


                    }
                },
                {
                    field: "Actions",
                    width: 110,
                    title: "Tindakan",
                    sortable: !1,
                    overflow: "visible",
                    template: function(t) {
                        return '<a href="/certification/edit/'+t.id+'" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill btn-outline-primary" title="Kemaskini">\t\t\t\t\t\t\t<i class="la la-pencil"></i>\t\t\t\t\t\t</a>\t\t\t\t\t\t<button id="'+t.id+'" class="deleteFn m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill btn-outline-danger" title="Hapus">\t\t\t\t\t\t\t<i class="la la-trash"></i>\t\t\t\t\t\t</a>\t\t\t\t\t'
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

            $(document).on('click', '.deleteFn', ($event) => {
             var id = $(event.target).closest('.m-datatable__row').find('[data-field="id"]').find('.m-checkbox > input').val();
             var newid = id.toString();
             var title = $($event.target).closest('.m-datatable__row').find('[data-field="title"]').text();
             this.deleteArticle(newid, title)

          });

            // ##################################### AUDIT LATIHAN ############################################


            var options2 = {
                data: {
                    type: "remote",
                    source: {
                        read: {
                            url: environment.hostname+"/api/certTxAudit",
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
                    template: function(row) {
                        var result;
                        var e = row.certification;
                        if (e==null){
                           result = " ";
                        }else{
                            result = row.certification.title;
                        }

                        return result;
                    }
                }, {
                    field: "name",
                    title: "Nama Pemohon",
                    sortable: "asc",
                    filterable: !1,
                    width: 150,
                    template: function(row) {
                        var result;
                        var e = row.user;
                        if (e==null){
                           result = " ";
                        }else{
                            result = row.user.name;
                        }

                        return result;
                    }
                }, {
                    field: "createdDate",
                    title: "Tarikh Permohonan",
                    sortable: "asc",
                    filterable: !1,
                    width: 150,
                    template:    function (row) {
                        var date = row.createdDate;
                        var datemagic = new Date(date);
                        var day = datemagic.getDate();
                        var month = datemagic.getMonth()+1;
                        var year = datemagic.getFullYear();
                        return day + '/' + month + '/' + year;
                   }
                }, {
                    field: "status",
                    title: "Tindakan",
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
                }, {
                    field: "approvedDate",
                    title: "Tarikh Perlaksanaan",
                    sortable: "asc",
                    filterable: !1,
                    width: 150,
                    template:    function (row) {
                        var date = row.approvedDate;
                        var datemagic = new Date(date);
                        var day = datemagic.getDate();
                        var month = datemagic.getMonth()+1;
                        var year = datemagic.getFullYear();
                        return day + '/' + month + '/' + year;
                   },

                }]
            }

          let datatable2 = (<any>$('#auditPersijilan')).mDatatable(options2);
          this.datatable2 = datatable2;

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

    deleteArticle(certId: string, title: string) {
        this.confirmMsg = "Adakah anda pasti untuk menghapuskan latihan persijilan "+title+" ?";
        this.padamId = certId;
        $('#m_modal_padam').modal('show');
    }

    padam() {
            this.certificationService.deleteCertificationById(this.padamId).subscribe(
            success=>{
                this.usedManday = this.mandayObj.mandayUsed; //value lama
                  this.usedManday = this.usedManday -1;

                  let manday2: Manday = new Manday (
                    null,
                    null,
                    this.usedManday,
                    null,
                    this.mandayObj.id
                    );

                  this.mandayService.updateMandayUsed(manday2).subscribe(
                      success => {
                        this.isEditable = true;
                        this.loading = false;
                        this.datatable.reload();
                        toastr.success(this.message.success);
                        $('#m_modal_padam').modal('hide');

                      })
               },
             errorcode=>{

                $('#m_modal_padam').modal('hide');
                this.confirmMsg = "Persijilan tidak berjaya dihapuskan. Pengguna telah memohon latihan persijilan tersebut.";
                $('#m_modal_padamUser').modal('show');
            });
           }

        redirectNewCertPage() {

        jQuery('#m_modal_add').modal('hide');
        this.router.navigate(['cert/setting']);
      }

      onConfirm($event){
              $event.preventDefault();

               if (this.usedManday != 0) {

                  this.confirmMsg = this.message.new + this.usedManday + " (" + this.mandayObj.mandayUsed + "/" + this.mandayObj.total + ")";
                  this.confirmType = "success";
                  jQuery('#m_modal_add').modal('show');

               } else {
                  this.confirmMsg = this.message.danger + this.usedManday + ". Sila hubungi Pentadbir sistem untuk maklumat lanjut";
                  this.confirmType = "danger";
                  jQuery('#m_modal_add2').modal('show');

               }
           }
    }
