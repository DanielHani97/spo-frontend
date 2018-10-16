import { Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { NavigationEnd, Router } from '@angular/router';

import { Technology } from '../../../../../model/setup/technology';
import { Training } from '../../../../../model/training/training';
import { TrainingTx } from '../../../../../model/training/trainingTx';
import { TrainingService } from '../../../../../services/training/training.service';
import { UserService } from '../../../../../services/user.service';

import { environment } from "../../../../../../environments/environment";
declare var $: any;
declare let toastr: any;

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./training-list.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [TrainingService, UserService]

})
export class TrainingListComponent implements OnInit, AfterViewInit {

    datatable: any;
    token: string;
    bearToken: string;
    userid: string;
    batalId: any;
    isEditable = false;
    loading: boolean = false;
    objUser: any;

    message: any = {
        success: "Permohonan latihan telah berjaya dibatalkan"
    }

    confirmType: string = "danger";
    confirmMsg: string;

    constructor(private _script: ScriptLoaderService, private router: Router, private trainingService: TrainingService, private userService: UserService) { }

    ngOnInit() {

        this.bearToken = "Bearer " + localStorage.getItem('jwtToken');
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.userid = currentUser.id;

        this.userService.getUserById(this.userid).subscribe(
            data => {
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
                        url: environment.hostname + "/api/training/user/list/" + this.userid,
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
                title: "Nama Latihan",
                sortable: "asc",
                filterable: !1,
                width: 150,
                template: function(row) {
                    return row.training.title;
                }
            }, {
                field: "technology",
                title: "Teknologi",
                sortable: "asc",
                filterable: !1,
                width: 150,
                template: function(row) {
                    var result = row.training.technology;
                    if (result != null) {
                        result = row.training.technology.name
                    } else {
                        result = "";
                    }
                    return result;
                }
            }, {
                field: "start_date",
                title: "Tarikh Mula",
                type: 'datetime',
                sortable: "asc",
                template: function(row) {
                    var date = row.training.startDate;
                    var datemagic = new Date(date);
                    var day = datemagic.getDate();
                    var month = datemagic.getMonth() + 1;
                    var year = datemagic.getFullYear();
                    return day + '/' + month + '/' + year;
                },
            }, {
                field: "end_date",
                title: "Tarikh Tamat",
                type: 'datetime',
                sortable: "asc",
                template: function(row) {
                    var date = row.training.endDate;
                    var datemagic = new Date(date);
                    var day = datemagic.getDate();
                    var month = datemagic.getMonth() + 1;
                    var year = datemagic.getFullYear();
                    return day + '/' + month + '/' + year;
                },
            }, {
                field: "place",
                title: "Tempat Latihan",
                sortable: "asc",
                filterable: !1,
                width: 150,
                template: function(row) {
                    return row.training.place;
                }

            },
            {
                field: "status",
                title: "Status",
                template: function(row) {
                    var status = row.status;
                    if (status === '1') {
                        status = '<span class="m-badge m-badge--brand m-badge--wide">Baru</span>';
                    } else if (status === '2') {
                        status = '<span class="m-badge m-badge--metal m-badge--wide">Penilaian</span>';
                    } else if (status === '3') {
                        status = '<span class="m-badge m-badge--success m-badge--wide">Terima</span>';
                    } else if (status === '4') {
                        status = '<span class="m-badge m-badge--danger m-badge--wide">Tolak</span>';
                    }
                    else if (status === '5') {
                        status = '<span class="m-badge m-badge--warning m-badge--wide">Batal</span>';
                    }
                    return status;
                }
            }, {
                field: "Tindakan",
                width: 150,
                title: "Tindakan",
                sortable: !1,
                overflow: "visible",
                template: function(t) {

                    var status = t.status;

                    var date = t.training.startDate;
                    var date2 = new Date(t.training.endDate);
                    let ngbDate3 = { year: date2.getFullYear(), month: date2.getMonth() + 1, day: date2.getDate() + 1 };
                    var date3 = new Date(ngbDate3.year, ngbDate3.month - 1, ngbDate3.day);

                    var today = new Date();

                    var htmlBaru = '<a href="/training/details/view/' + t.training.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-primary m-btn--icon m-btn--icon-only m-btn--pill btn-outline-primary" title="Lihat Maklumat">\t\t\t\t\t\t\t<i class="la la-ellipsis-h"></i>\t\t\t\t\t\t</a>\t\t\t\t\t\t<button id="' + t.id + '" class="rejectFn m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill btn-outline-danger" title="Batal Permohonan">\t\t\t\t\t\t\t<i class="la la-times"></i>\t\t\t\t\t\t</a>\t\t\t\t\t';
                    var htmlNew = '<a href="/training/details/view/' + t.training.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-primary m-btn--icon m-btn--icon-only m-btn--pill btn-outline-primary" title="Lihat Maklumat">\t\t\t\t\t\t\t<i class="la la-ellipsis-h"></i>\t\t\t\t\t\t</a>\t\t\t\t\t\t<a href="/training/attendance/confirmation/' + t.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-primary m-btn--icon m-btn--icon-only m-btn--pill btn-outline-success" title="Pra Kehadiran">\t\t\t\t\t\t\t<i class="la la-calendar"></i>\t\t\t\t\t\t</a>';
                    var htmlAttend = '<a href="/training/details/view/' + t.training.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-primary m-btn--icon m-btn--icon-only m-btn--pill btn-outline-primary" title="Lihat Maklumat">\t\t\t\t\t\t\t<i class="la la-ellipsis-h"></i>\t\t\t\t\t\t</a>\t\t\t\t\t\t<a href="/training/current/attendance/' + t.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-primary m-btn--icon m-btn--icon-only m-btn--pill btn-outline-success" title="Kehadiran">\t\t\t\t\t\t\t<i class="la la-calendar"></i>\t\t\t\t\t\t</a>';
                    var htmlRO = '<a href="/training/details/view/' + t.training.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-primary m-btn--icon m-btn--icon-only m-btn--pill btn-outline-primary" title="Lihat Maklumat">\t\t\t\t\t\t\t<i class="la la-ellipsis-h"></i>\t\t\t\t\t\t</a>';

                    if (status == '1') {
                        return htmlBaru;
                        // }else if (status =='3' &&  today <= date){
                        //   return htmlNew;
                        // }else if (status =='3' && (today >= date && today <= date3)){
                        //   return htmlAttend;
                    } else if (status == '3') {
                        return htmlAttend;
                    } else {
                        return htmlRO;
                    }
                }
            }]
        }

        let datatable = (<any>$('#rekod')).mDatatable(options);
        this.datatable = datatable;

        $("#m_form_search").on("keyup", function(e) {
            datatable.setDataSourceParam("search", $(this).val());
            datatable.load();
        })

        var flag = localStorage.getItem('RELOAD');
        if (flag == 'YES') {
            datatable.reload();
            localStorage.removeItem('RELOAD');
        }

        $(document).on('click', '.rejectFn', ($event) => {
            var id = $(event.target).closest('.m-datatable__row').find('[data-field="id"]').find('.m-checkbox > input').val();
            var newid = id.toString();
            var title = $($event.target).closest('.m-datatable__row').find('[data-field="title"]').find('.m-checkbox > input').text();
            this.batalLatihan(newid, title)

        });

    }

    batalLatihan(trainingTxId: string, title: string) {
        this.confirmMsg = "Adakah anda pasti untuk membatalkan permohonan " + title + " ?";
        this.batalId = trainingTxId;
        $('#m_modal_batal').modal('show');
    }

    batal() {
        this.trainingService.getTrainingTxById(this.batalId).subscribe(
            trainingTx => {
                var tr = trainingTx;
                //var title = training.title;

                let batal: TrainingTx = new TrainingTx(
                    null,
                    null,
                    null,
                    tr.coach_remarks,
                    tr.admin_remarks,
                    "5",
                    null,
                    tr.id,
                    null,
                    null,
                    this.objUser
                );
                this.trainingService.updateTrainingTx(batal).subscribe(
                    success => {
                        this.isEditable = true;
                        this.loading = false;
                        this.datatable.reload();
                        toastr.success(this.message.success);
                        $('#m_modal_batal').modal('hide');
                    });
            }
        );
    }

    redirectNewTrainingListPage() {
        this.router.navigate(['training/register']);
    }

}
