import { Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { NavigationEnd, Router } from '@angular/router';

import { Schema } from '../../../../../model/setup/schema';
import { SchemaService } from '../../../../../services/setup/schema.service';
import { environment } from "../../../../../../environments/environment";

import { message } from "../../../../../message/default";

declare let toastr: any;
declare let jQuery: any;


@Component({
    selector: '.m-grid__item.m-grid__item--fluid.m-wrapper',
    templateUrl: "./schema-list.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [SchemaService]
})
export class SchemaListComponent implements OnInit, AfterViewInit {

    token: string;
    bearToken: string;
    allId: any[];
    id: string;

    confirmType: string;
    confirmMsg: string;
    btnAction: string;

    datatable: any;
    constructor(private elRef: ElementRef, private _script: ScriptLoaderService, private router: Router, private schemaService: SchemaService) { }

    ngOnInit() {
        this.bearToken = "Bearer " + localStorage.getItem('jwtToken');
    }

    ngAfterViewInit() {
        var options = {
            data: {
                type: "remote",
                source: {
                    read: {
                        url: environment.hostname + "/api/schema",
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
                field: "seniority",
                title: "Kekananan",
                width: 150
            }, {
                field: "status",
                title: "Status",
                template: function(t) {

                    var result = t.status;
                    if (result == "Aktif") {
                        return '<span class="m-badge m-badge--success m-badge--wide">Aktif</span>';
                    } else if (result == "Tidak Aktif") {
                        return '<span class="m-badge m-badge--danger m-badge--wide">Tidak Aktif</span>';
                    }


                }

            }, {
                field: "Actions",
                width: 110,
                title: "Tindakan",
                sortable: !1,
                overflow: "visible",
                template: function(t) {
                    return '<a href="/setting-schema/edit/' + t.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill btn-outline-success" title="Kemaskini Maklumat">\t\t\t\t\t\t\t<i class="la la-pencil"></i>\t\t\t\t\t\t</a>\t\t\t\t\t\t' +
                        '<button id="' + t.id + '" class="deleteFn m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill btn-outline-danger" title="Delete">\t\t\t\t\t\t\t<i class="la la-trash"></i>\t\t\t\t\t\t</button>\t\t\t\t\t'
                }
            }]
        }

        var datatable = (<any>$('#schemaList')).mDatatable(options);
        this.datatable = datatable;

        $("#m_form_search").on("keyup", function(e) {
            datatable.setDataSourceParam("search", $(this).val());
            datatable.load();
        })

        $(document).on('click', '#m_datatable_check_all', (e) => {
            e.preventDefault();

            let cbArr: any[] = new Array();

            var $cbAnswer = $(".m-datatable__body").find(".m-checkbox > input");
            $cbAnswer.each(function(i) {
                var status = $(this).is(":checked");
                if (status) {
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

        $(document).on('click', '.deleteFn', (e) => {
            e.preventDefault();
            var id = $(e.target).closest('.m-datatable__row').find('[data-field="id"]').find('.m-checkbox > input').val();
            var newid = id.toString();

            this.id = newid;
            this.btnAction = "DELETE";
            this.confirmMsg = message.global.confirmDelete;
            jQuery('#m_modal_add').modal('show');

        });
    }

    redirectNewSchemaPage() {
        this.router.navigate(['setting-schema/setting']);
    }



    onConfirm($event) {
        $event.preventDefault();

        let currentUser = JSON.parse(localStorage.getItem("currentUser"));

        if (this.btnAction === "DELETE") {

            if (this.id) {
                this.schemaService.deleteSchemaById(this.id)
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
        } else if (this.btnAction === "DELETE_ALL") {
            for (let id of this.allId) {
                this.schemaService.deleteSchemaById(id)
                    .subscribe();
            }
            toastr.success(message.global.successDelete);
            jQuery('#m_modal_add').modal('hide');
            setTimeout(() => { this.datatable.reload(); }, 2000)
        }
    }


}
