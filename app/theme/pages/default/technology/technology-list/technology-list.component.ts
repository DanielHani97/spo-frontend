import { Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { Router } from '@angular/router';

import { Technology } from '../../../../../model/setup/technology';
import { TechnologyService } from '../../../../../services/setup/technology.service';
import { environment } from "../../../../../../environments/environment";
declare var $: any;
declare let toastr: any;

@Component({
    selector: '.m-grid__item.m-grid__item--fluid.m-wrapper',
    templateUrl: "./technology-list.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [TechnologyService]
})
export class TechnologyListComponent implements OnInit, AfterViewInit {

    bearToken: string;
    confirmMsg: string;
    deleteId: any;
    datatable: any;
    loading: boolean = false;
    isEditable = false;
    message: any = {
        success: "Teknologi Telah Berjaya Dipadamkan",
        fail: "Teknologi ini sedang digunakan"
    }
    constructor(private elRef: ElementRef, private router: Router, private technologyService: TechnologyService) { }

    ngOnInit() {
        this.bearToken = "Bearer " + localStorage.getItem('jwtToken');
    }

    ngAfterViewInit() {

        var options = {

            data: {
                type: "remote",
                source: {
                    read: {
                        url: environment.hostname + "/api/technology",
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
                field: "type",
                title: "Jenis",
                width: 150,
                template: function(row) {
                    if (row.type == null) {
                        return "Tiada Maklumat";
                    } else if (row.type == "Frontend") {
                        return "Framework"
                    } else if (row.type == "Backend") {
                        return "Language"
                    } else {
                        return row.type;
                    }
                }
            }, {
                field: "status",
                title: "Status",
                width: 100,
                template: function(t) {
                    var e = {
                        1: {
                            title: "Aktif",
                            class: "m-badge--success"
                        },
                        2: {
                            title: "Tidak Aktif",
                            class: " m-badge--danger"
                        }
                    };
                    return '<span class="m-badge ' + e[t.status].class + ' m-badge--wide">' + e[t.status].title + "</span>"
                }
            }, {
                field: "Tindakan",
                width: 110,
                title: "Actions",
                sortable: !1,
                overflow: "visible",
                template: function(t) {
                    return '<a href="/technology/edit/' + t.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill btn-outline-success" title="Kemaskini Maklumat">\t\t\t\t\t\t\t<i class="la la-edit"></i>\t\t\t\t\t\t</a>\t\t\t\t\t\t<button id="' + t.id + '" class="deleteTech m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill btn-outline-danger" title="Padam Teknologi">\t\t\t\t\t\t\t<i class="la la-trash"></i>\t\t\t\t\t\t</button>\t\t\t\t\t'
                }
            }]

        }

        let datatable = (<any>$('#techList')).mDatatable(options);
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

        $(document).on('click', '.deleteTech', (e) => {
            e.preventDefault()
            var id = $(e.target).closest('.m-datatable__row').find('[data-field="id"]').find('.m-checkbox > input').val();
            var newid = id.toString();

            var title = $(e.target).closest('.m-datatable__row').find('[data-field="name"]').text();
            this.deleteArticle(newid, title)

        });

    }

    redirectNewTechnologyPage() {
        this.router.navigate(['technology/setup']);
    }

    deleteArticle(technologyId: string, title: string) {
        this.confirmMsg = "Adakah anda pasti untuk menghapuskan teknologi ini?";
        this.deleteId = technologyId;
        $('#m_modal_del').modal('show');
        //this.technologyService.deleteTechnologyById(technologyId).subscribe();
    }

    padam() {
        this.technologyService.deleteTechnologyById(this.deleteId).subscribe(
            success => {
                this.isEditable = true;
                this.loading = false;
                this.datatable.reload();
                toastr.success(this.message.success);
                $('#m_modal_del').modal('hide');
            },
            error => {
                if (error == 409) {
                    this.isEditable = true;
                    this.loading = false;
                    this.datatable.reload();
                    toastr.error(this.message.fail);
                    $('#m_modal_del').modal('hide');
                }
            }
        );
    }


}
