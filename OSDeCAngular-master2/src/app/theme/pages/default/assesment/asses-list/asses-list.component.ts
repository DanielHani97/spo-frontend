import { Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { NavigationEnd, Router } from '@angular/router';

import { Agency } from '../../../../../model/setup/agency';
import { AssesmentService } from '../../../../../services/assesment/assesment.service';

import { environment } from "../../../../../../environments/environment";

@Component({
    selector: '.m-grid__item.m-grid__item--fluid.m-wrapper',
    templateUrl: "./asses-list.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [AssesmentService]
})
export class AssesListComponent implements OnInit, AfterViewInit {

    token: string;
    bearToken: string;

    constructor(private elRef: ElementRef, private router: Router, private assesmentService: AssesmentService) { }

    ngOnInit() {
        this.bearToken = "Bearer " + localStorage.getItem('jwtToken');
    }

    ngAfterViewInit() {

        var options = {
            data: {
                type: "remote",
                source: {
                    read: {
                        url: environment.hostname + "/api/asses/list",
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
                field: "title",
                title: "Soalan",
                sortable: "asc",
                filterable: !1
            }, {
                field: "technology",
                title: "Teknologi",
                sortable: !1,
                width: 120,
                template: function(row) {
                    var technology = row.technology;
                    if (technology == null) {
                        return "";
                    } else {
                        return row.technology.name;
                    }
                }
            }, {
                field: "level",
                title: "Tahap",
                width: 100,
                template: function(row) {

                    var htmlInter = '<div class="m-widget4__info"> ' +
                        '<span class="fa fa-star star-checked w3-large"></span> ' +
                        '<span class="fa fa-star star-checked w3-large"></span> ' +
                        '<span class="fa fa-star star-checked w3-large"></span> ' +
                        '<span class="fa fa-star  w3-large"></span> ' +
                        '<span class="fa fa-star  w3-large"></span> ' +
                        '<span class="m-widget4__sub"></span> ' +
                        '</div>';

                    var htmlBegin = '<div class="m-widget4__info"> ' +
                        '<span class="fa fa-star star-checked w3-large"></span> ' +
                        '<span class="fa fa-star w3-large"></span> ' +
                        '<span class="fa fa-star w3-large"></span> ' +
                        '<span class="fa fa-star  w3-large"></span> ' +
                        '<span class="fa fa-star  w3-large"></span> ' +
                        '<span class="m-widget4__sub"></span> ' +
                        '</div>';

                    var htmlExp = '<div class="m-widget4__info"> ' +
                        '<span class="fa fa-star star-checked w3-large"></span> ' +
                        '<span class="fa fa-star star-checked w3-large"></span> ' +
                        '<span class="fa fa-star star-checked w3-large"></span> ' +
                        '<span class="fa fa-star star-checked w3-large"></span> ' +
                        '<span class="fa fa-star star-checked w3-large"></span> ' +
                        '<span class="m-widget4__sub"></span> ' +
                        '</div>';


                    var lvl = row.level;
                    if (lvl == "Permulaan") {
                        return htmlBegin;
                    } if (lvl == "Pertengahan") {
                        return htmlInter;
                    } if (lvl == "Mahir") {
                        return htmlExp;
                    } else {
                        return "";
                    }
                }
            }, {
                field: "Actions",
                width: 110,
                title: "Actions",
                sortable: !1,
                overflow: "visible",
                template: function(t) {
                    return '<a href="/assesment/list/edit/' + t.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill btn-outline-success" title="Edit details">\t\t\t\t\t\t\t<i class="la la-pencil"></i>\t\t\t\t\t\t</a>\t\t\t\t\t\t' +
                        '<button id="' + t.id + '" class="deleteFn m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill btn-outline-danger" title="Delete">\t\t\t\t\t\t\t<i class="la la-trash"></i>\t\t\t\t\t\t</button>\t\t\t\t\t'
                }
            }]
        }

        let datatable = (<any>$('#assesList')).mDatatable(options);

        $("#m_form_search").on("keyup", function(e) {
            datatable.setDataSourceParam("search", $(this).val());
            console.log($(this).val());
            datatable.load();
        })

        // $(document).on('click', '.deleteFn',  ($event) => {
        //   var id = $event.target.id
        //   alert(id);
        //   // if(confirm("Are you sure to delete "+id)) {
        //   //   // this.agencyService.deleteAgencyById(id)
        //   //   //   .subscribe(
        //   //   //    successCode => {
        //   //   //       datatable.reload();
        // 	//   //     },
        //   //   // 		errorCode => {
        //   //   //       datatable.reload();
        //   //   //    });
        //   // }
        // });

        $(document).on('click', '.deleteFn', (e) => {
            e.preventDefault();
            var id = $(e.target).closest('.m-datatable__row').find('[data-field="id"]').find('.m-checkbox > input').val();
            var newid = id.toString();

            if (confirm("Adakah anda pasti untuk menghapuskan soalan ini ?")) {
                this.assesmentService.deleteAssesmentById(newid)
                    .subscribe(
                    successCode => {
                        datatable.reload();
                    },
                    errorCode => {
                        datatable.reload();
                    });
            }

        });
    }

    addNewAsses() {
        this.router.navigate(['assesment/list/setup']);
    }
}
