import { Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { Router } from '@angular/router';

import { Coaching } from '../../../../../model/coaching/coaching';
import { CoachingService } from '../../../../../services/coaching/coaching.service';
import { environment } from "../../../../../../environments/environment";
import { UserService } from '../../../../../services/user.service';

import { User } from '../../../../../model/user';
import { AssesmentService } from '../../../../../services/assesment/assesment.service';
import { Assesment } from '../../../../../model/assesment/assesment'

declare var $: any;
declare let toastr: any;

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./coaching-completion.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [CoachingService, AssesmentService, UserService]
})
export class CoachingCompletionComponent implements OnInit, AfterViewInit {

    datatable: any;
    bearToken: string;
    userid: string;
    userObj: any;
    currentUser: User;
    confirmMsg: string;
    deleteId: any;
    isEditable = false;
    loading: boolean = false;
    message: any = {
        success: "Coaching tamat"
    }

    constructor(private elRef: ElementRef, private router: Router, private userService: UserService, private coachingService: CoachingService, private assesmentService: AssesmentService) { }

    ngOnInit() {
        this.bearToken = "Bearer " + localStorage.getItem('jwtToken');
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.userid = this.currentUser.id;

        this.userService.getUserById(this.userid).subscribe(
            data => {
                this.userObj = data;
            }
        )
    }

    ngAfterViewInit() {
        var options = {
            data: {
                type: "remote",
                source: {
                    read: {

                        url: environment.hostname + "/api/coaching/report",
                        headers: {
                            "Authorization": this.bearToken
                        }
                    }
                },
                pageSize: 10,
                saveState: {
                    cookie: !0,
                    webstorage: !0
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
                sortable: "asc",
                width: 40,
                textAlign: "center",
                selector: {
                    class: "m-checkbox--solid m-checkbox--brand"
                }
            }, {
                field: "name",
                title: "Nama",
                filterable: !1,
                width: 150,
                template: function(row) {
                    return row.name;
                }
            }, {
                field: "agency",
                title: "Agensi",
                width: 150,
                sortable: !1,
                template: function(row) {

                    let agensi = "";

                    if (row.user.type == "GOV") {
                        if (row.user.agency != null) {
                            agensi = row.user.agency.code;
                        } else {
                            agensi = "";
                        }
                    } else if (row.user.type == "PRIVATE") {
                        if (row.user.company != null) {
                            agensi = row.user.company.name;
                        } else {
                            agensi = "";
                        }
                    } else {
                        agensi = "";
                    }

                    return agensi;

                }
            }, {
                field: "starting_date",
                title: "Tarikh Mula",
                type: 'datetime',
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
                            title: "Penilaian Coach",
                            class: " m-badge--metal"
                        },
                        3: {
                            title: "Kelulusan",
                            class: " m-badge--primary"
                        },
                        4: {
                            title: "Sedang Berlangsung",
                            class: " m-badge--success"
                        },
                        5: {
                            title: "Ditolak",
                            class: " m-badge--danger"
                        },
                        6: {
                            title: "Dibatalkan",
                            class: " m-badge--warning"
                        },
                        7: {
                            title: "Selesai",
                            class: " m-badge--accent"
                        },

                    };
                    return '<span class="m-badge ' + e[newStatus].class + ' m-badge--wide">' + e[newStatus].title + "</span>"
                }
            }, {
                field: "Tindakan",
                width: 110,
                title: "Tindakan",
                sortable: !1,
                overflow: "visible",
                template: function(t) {
                    var newStatus = t.status;

                    var htmlNew = '<a href="/coaching/view/' + t.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill btn-outline-success" title="Lihat Maklumat">\t\t\t\t\t\t\t<i class="la la-ellipsis-h"></i>\t\t\t\t\t\t</a>\t\t\t\t\t';

                    if ((newStatus == '4')) {
                        return htmlNew + '<a id="' + t.id + '" class="completeFn m-portlet__nav-link btn m-btn m-btn--hover-warning m-btn--icon m-btn--icon-only m-btn--pill btn-outline-warning" title="Penamatan Coaching">\t\t\t\t\t\t\t<i class="la la-hand-stop-o"></i>\t\t\t\t\t\t</a>\t\t\t\t\t';
                    } else {
                        return htmlNew
                    }

                }
            }]
        }
        let datatable = (<any>$('#coachingUserList')).mDatatable(options);
        this.datatable = datatable;
        $("#m_form_search").on("keyup", function(e) {
            datatable.setDataSourceParam("search", $(this).val());
            console.log($(this).val());
            datatable.load();
        })

        var flag = localStorage.getItem('RELOAD');
        if (flag == 'YES') {
            datatable.reload();
            localStorage.removeItem('RELOAD');
        }

        $(document).on('click', '.completeFn', (e) => {
            e.preventDefault()
            var id = $(e.target).closest('.m-datatable__row').find('[data-field="id"]').find('.m-checkbox > input').val();
            var newid = id.toString();


            var title = $(e.target).closest('.m-datatable__row').find('[data-field="name"]').text();
            this.tamatCoaching(newid, title)

        });

    }

    tamatCoaching(coachingId: string, title: string) {
        this.confirmMsg = "Adakah anda pasti untuk menamatkan coaching: " + title + " ?";
        this.deleteId = coachingId;
        $('#m_modal_tamat').modal('show');
    }

    tamat() {

        let coachingTemp: Coaching = new Coaching(
            null,
            null,
            null,
            '7',
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            this.userObj,
            null,
            null,
            null,
            this.deleteId, null, null, null
        );
        this.coachingService.updateCoaching(coachingTemp).subscribe(
            suceess => {
                this.isEditable = true;
                this.loading = false;
                this.datatable.reload();
                toastr.success(this.message.success);
                $('#m_modal_tamat').modal('hide');
            }
        );


    }

    redirectNewCoachingPage() {
        this.router.navigate(['coaching/register']);
    }

}
