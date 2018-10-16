import { Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { NavigationEnd, Router } from '@angular/router';

import { Technology } from '../../../../../model/setup/technology';
import { CapabilityService } from '../../../../../services/capability/capability.service';
import { Manday } from '../../../../../model/setup/manday';
import { MandayService } from '../../../../../services/setup/manday.service';

import { environment } from "../../../../../../environments/environment";
declare var $: any;
declare let toastr: any;
@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./cap-listing.components.html",
    encapsulation: ViewEncapsulation.None,
    providers: [CapabilityService, MandayService]
})
export class CapListingComponent implements OnInit, AfterViewInit {

    confirmMsg: string;
    deleteId: any;
    datatable: any;
    token: string;
    mandayObj: any;
    manday: any;
    manday2: any;
    mandayUsed: any;
    mandayId: string;
    usedManday: number;

    bearToken: string;
    isEditable = false;
    loading: boolean = false;
    message: any = {
        success: "Kepakaran Telah Berjaya Dipadam",
        error404: "Kepakaran Gagal Dipadam. Pengguna Telah Memohon Kepakaran Tersebut"
    }

    constructor(private _script: ScriptLoaderService, private mandayService: MandayService, private router: Router, private capabilityService: CapabilityService) { }

    ngOnInit() {
        this.bearToken = "Bearer " + localStorage.getItem('jwtToken');
        this.mandayService.getManday().subscribe(
            data => {
                this.manday = data;
                this.manday2 = this.manday.filter(value => value.category === 'capability');
                this.mandayObj = this.manday2[0];

                this.usedManday = this.mandayObj.total - this.mandayObj.mandayUsed;
            }
        );
    }

    ngAfterViewInit() {

        var options = {
            data: {
                type: "remote",
                source: {
                    read: {
                        url: environment.hostname + "/api/capability",
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
                width: 150
            }, {
                field: "kepakaran",
                title: "Kepakaran",
                sortable: "asc",
                filterable: !1,
                width: 150,
                template: function(row) {

                    var result = row.kepakaran;
                    if (result != null) {
                        result = row.kepakaran.name
                    } else {
                        result = "";
                    }
                    return result;
                }
            }, {
                field: "starting_date",
                title: "Tarikh Mula",
                type: 'datetime',
                filterable: !1,
                sortable: !1,
                template: function(row) {
                    var date = row.starting_date;
                    if (date == null) {
                        return "";
                    } else {
                        var datemagic = new Date(date);
                        var day = datemagic.getDate();
                        var month = datemagic.getMonth() + 1;
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
                template: function(row) {
                    var date = row.ending_date;
                    if (date == null) {
                        return "";
                    } else {
                        var datemagic = new Date(date);
                        var day = datemagic.getDate();
                        var month = datemagic.getMonth() + 1;
                        var year = datemagic.getFullYear();
                        return day + '/' + month + '/' + year;
                    }
                },
            }, {
                field: "Status",
                title: "Status",
                template: function(t) {

                    var result = t.status;
                    if (result == "1") {
                        return '<span class="m-badge m-badge--success m-badge--wide">Aktif</span>';
                    } else if (result == "2") {
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
                    return '<a href="/cap/edit/' + t.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill btn-outline-success" title="Kemaskini Maklumat">\t\t\t\t\t\t\t<i class="la la-pencil"></i>\t\t\t\t\t\t</a>\t\t\t\t\t\t<button id="' + t.id + '" class="deleteFn m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill btn-outline-danger" title="Padam">\t\t\t\t\t\t\t<i class="la la-trash"></i>\t\t\t\t\t\t</a>\t\t\t\t\t';
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
        if (flag == 'YES') {
            datatable.reload();
            localStorage.removeItem('RELOAD');
        }

        $(document).on('click', '.deleteFn', (e) => {
            e.preventDefault()
            var id = $(e.target).closest('.m-datatable__row').find('[data-field="id"]').find('.m-checkbox > input').val();
            var newid = id.toString();

            var title = $(e.target).closest('.m-datatable__row').find('[data-field="name"]').text();
            this.deleteCap(newid, title);
        });

    }


    redirectNewCapabilityPage() {
        this.router.navigate(['setting/cap']);
    }

    deleteCap(capId: string, title: string) {
        this.confirmMsg = "Adakah anda pasti untuk membatalkan permohonan kepakaran: " + title + " ?";
        this.deleteId = capId;
        $('#m_modal_delete').modal('show');
    }

    delete() {
        this.capabilityService.deleteCapabilityById(this.deleteId).subscribe(
            success => {
                this.usedManday = this.mandayObj.mandayUsed; //value lama
                this.usedManday = this.usedManday - 1;

                let manday2: Manday = new Manday(
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
                        $('#m_modal_delete').modal('hide');
                    })

            },
            error => {
                if (error == 404) {
                    this.isEditable = true;
                    this.loading = false;
                    this.datatable.reload();
                    toastr.error(this.message.error404);
                    $('#m_modal_delete').modal('hide');
                }
            }
        )
    }

}
