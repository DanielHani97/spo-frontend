import { Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { NavigationEnd, Router } from '@angular/router';

import { FeedbackService } from '../../../../../services/feedback/feedback.service';

import { environment } from "../../../../../../environments/environment";

import { message } from "../../../../../message/default";

declare let toastr: any;
declare let jQuery: any;

@Component({
    selector: '.m-grid__item.m-grid__item--fluid.m-wrapper',
    templateUrl: "./fb-list.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [FeedbackService]
})
export class FbListComponent implements OnInit, AfterViewInit {

    //datatable: any;
    token: string;
    bearToken: string;
    allId: any[];
    id: string;

    constructor(private elRef: ElementRef, private router: Router, private feedbackService: FeedbackService) { }

    ngOnInit() {
        this.bearToken = "Bearer " + localStorage.getItem('jwtToken');
    }

    ngAfterViewInit() {

        var options = {
            data: {
                type: "remote",
                source: {
                    read: {
                        url: environment.hostname + "/api/feedback/list",
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
                field: "Jenis",
                title: "Jenis",
                sortable: "asc",
                filterable: !1,
                width: 200,
                template: function(row) {
                    var type = row.type;
                    if (type == "PK") {
                        type = "Penilaian Kursus"
                    } else if (type == "PKK") {
                        type = "Penilaian Keberkesanan Kursus"
                    } else if (type == "PC") {
                        type = "Penilaian Penceramah"
                    } else if (type == "PBCP") {
                        type = "Penilaian Berkala Coach Terhadap Peserta"
                    } else if (type == "PBPC") {
                        type = "Penilaian Berkala Peserta Terhadap Coach"
                    }

                    return type;
                }
            }, {
                field: "title",
                title: "Nama",
                filterable: !1,
                width: 200,
                template: function(row) {
                    var titleTxt = row.title;
                    if (titleTxt == null) {
                        return "";
                    } else {
                        return titleTxt;
                    }
                }
            }, {
                field: "objective",
                title: "Objektif",
                sortable: !1,
                template: function(row) {
                    var objcTxt = row.objective;
                    if (objcTxt == null) {
                        return "";
                    } else {
                        return objcTxt;
                    }
                }
            }, {
                field: "Tindakan",
                width: 100,
                title: "Tindakan",
                sortable: !1,
                overflow: "visible",
                template: function(t) {
                    return '<a href="/feedback/setup/' + t.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill btn-outline-success" title="Edit details">\t\t\t\t\t\t\t<i class="la la-pencil"></i>\t\t\t\t\t\t</a>\t\t\t\t\t\t';
                }
            }]
        }

        let datatable = (<any>$('#feedbackList')).mDatatable(options);
    }

}
