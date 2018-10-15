import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, NavigationEnd} from '@angular/router';
import { Location } from "@angular/common";

import { Training } from '../../../../../model/training/training';
import { Agency } from '../../../../../model/setup/agency';
import { TrainingService } from '../../../../../services/training/training.service'

import { environment } from "../../../../../../environments/environment";

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./training-admin.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [TrainingService]
})
export class TrainingAdminComponent implements OnInit, AfterViewInit, OnDestroy {

    datatable: any;
    token : string;
    bearToken : string;

    training: Training;
    id: string;

    user: any;

    trainingForm: FormGroup;
    private sub: any;

    constructor(private _script: ScriptLoaderService, private trainingService:TrainingService, private router:Router, private route: ActivatedRoute) { }


    ngOnInit() {

        this.bearToken = "Bearer "+localStorage.getItem('jwtToken');
    }

    ngOnDestroy(): void{

    }

    ngAfterViewInit() {

        var options = {
        data: {
                    type: "remote",
                    source: {
                        read: {
                            url: environment.hostname+"/api/training",
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
                    template: function(row){
                        return row.title;
                    }
                }, {
                    field: "technology",
                    title: "Teknologi",
                    sortable: "asc",
                    filterable: !1,
                    width: 150,
                    template: function(row){
                        var tech = row.technology;
                        var techName = "";

                        if(tech){
                          techName = tech.name;
                        }
                        return techName;
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
                    title: "Tempat Latihan",
                    sortable: "asc",
                    filterable: !1,
                    width: 150,
                    template: function(row){
                        return row.place;
                    }
                }, {
                    field: "attendance",
                    width: 110,
                    title: "Tindakan",
                    sortable: !1,
                    overflow: "visible",
                    template: function(t){

                        return '<a href="/training/list/admin/' +t.id+ '" class="m-portlet__nav-link btn m-btn m-btn--hover-primary m-btn--icon m-btn--icon-only m-btn--pill btn-outline-primary" title="Senarai Peserta">\t\t\t\t\t\t\t<i class="la la-users"></i>\t\t\t\t\t\t</a>\t\t\t\t\t\t'
                     }
                }]
            }

        let datatable = (<any>$('#recordList')).mDatatable(options);

                $("#m_form_search").on("keyup", function(e) {
                    datatable.setDataSourceParam("search", $(this).val());
                    datatable.load();
                })

                var flag = localStorage.getItem('RELOAD');
                if(flag == 'YES'){
                  datatable.reload();
                  localStorage.removeItem('RELOAD');
                }

       }
     }
