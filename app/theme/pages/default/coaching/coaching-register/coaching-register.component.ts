import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";

import { User } from '../../../../../model/user';
import { Coaching } from '../../../../../model/coaching/coaching';
import { CoachingUser } from '../../../../../model/coaching/coachingUser';
import { CoachingService } from '../../../../../services/coaching/coaching.service';
import { UserService } from '../../../../../services/user.service';
import { Technology } from '../../../../../model/setup/technology';
import { TechnologyService } from '../../../../../services/setup/technology.service';
import { environment } from "../../../../../../environments/environment";
import { AssesmentService } from '../../../../../services/assesment/assesment.service';
import { Assesment } from '../../../../../model/assesment/assesment'

import { message } from "../../../../../message/default";

declare var $: any;
declare let toastr: any;
@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./coaching-register.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [CoachingService, TechnologyService, UserService, AssesmentService]
})
export class CoachingRegisterComponent implements OnInit, AfterViewInit, OnDestroy {

    showC: Coaching;
    coaching: Coaching;
    id: string;
    coachingTemp: Coaching;
    coachingUser: User;
    coachingUserTemp: CoachingUser;
    userLs: any[];

    frontend: Technology;
    backend: Technology;
    database: Technology;
    userid: string;
    datatable: any;

    frontendLs: any[];

    backendLs: any[];

    databaseLs: any[];
    bearToken: string;

    //for technology
    currentFrontend: any;
    currentBackend: any;
    currentLanguage: any;
    currentDatabase: any;

    //toastr
    loading: boolean = false;
    isEditable = false;
    message: any = {
        success: "Coaching Telah Berjaya Didaftarkan"
    }

    userlist: String[] = [];

    userObj = null;
    agencyObj = null;

    coachingForm: FormGroup;
    private sub: any;
    private userArray = [];
    private currentUser = [];
    private tempUser = [];

    //document upload
    @ViewChild('fileURS') fileURS;
    ursName: String;
    ursId: string;

    @ViewChild('fileSRS') fileSRS;
    srsName: String;
    srsId: string;

    @ViewChild('fileSDS') fileSDS;
    sdsName: String;
    sdsId: string;

    constructor(
        private _script: ScriptLoaderService,
        private userService: UserService,
        private technologyService: TechnologyService,
        private coachingService: CoachingService,
        private router: Router,
        private route: ActivatedRoute,
        private assesmentService: AssesmentService) { }

    ngOnInit() {

        this.bearToken = "Bearer " + localStorage.getItem('jwtToken');
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.userid = currentUser.id;

        this.coachingService.getBackend().subscribe(
            data => {
                this.backendLs = data;
            }
        );

        this.coachingService.getFrontend().subscribe(
            res => {
                this.frontendLs = res;
            }
        );

        this.coachingService.getDatabase().subscribe(
            rose => {
                this.databaseLs = rose;
            }
        );

        /*this.userService.getUsers().subscribe(
          data => {
              this.userLs = data;
          }
        );*/



        //this.frontendLs = [this.coachingService.getFrontend().subscribe()]

        // this.sub = this.route.params.subscribe(params => {
        // this.id = params['id'];
        // });
        this.coachingForm = new FormGroup({

            name: new FormControl('', Validators.required),
            pemohon: new FormControl({ value: '', disabled: true }, Validators.required),
            agency: new FormControl({ value: '', disabled: true }, Validators.required),
            frontend: new FormControl('', Validators.required),
            backend: new FormControl('', Validators.required),
            database: new FormControl('', Validators.required),
            remarks: new FormControl('', Validators.required),
            frontendlevel: new FormControl('', Validators.required),
            backendlevel: new FormControl('', Validators.required),
            databaselevel: new FormControl('', Validators.required),
            admin_remarks: new FormControl(),
            coach_remarks: new FormControl(),
            fileURS: new FormControl(),
            fileSRS: new FormControl(),
            fileSDS: new FormControl()
        });




        this.coachingService.getUser(this.userid).subscribe(
            user => {
                let agensi = "";

                if (user.type == "GOV") {
                    if (user.agency != null) {
                        agensi = user.agency.name;
                    } else {
                        agensi = "";
                    }
                } else if (user.type == "PRIVATE") {
                    if (user.company != null) {
                        agensi = user.company.name;
                    } else {
                        agensi = "";
                    }
                } else {
                    agensi = "";
                }


                this.coachingForm.patchValue({
                    agency: agensi,
                    pemohon: user.name

                })
                this.agencyObj = user.agency;
                this.userObj = user;
                this.userlist.push(user.id)
                this.userArray.push({
                    id: user.id,
                    name: user.name,
                    email: user.email
                })
            }
        );








        //this.userArray.push(this.userObj);
        // console.log("agencyObj", this.agencyObj);

        //console.log("userArray", this.userArray);

        /*if (this.id) { //edit form
           this.coachingService.getCoachingById(this.id).subscribe(
             coaching => {
                 this.id = coaching.id;
                 this.coachingForm.patchValue({
                 name: coaching.name,
                 type: coaching.agency,
                 status: coaching.status
               });
  
              },error => {
               console.log(error);
              }
           );
         }*/

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

            for (var i = 0; i < cbArr.length; ++i) {
                this.onCheckOn(cbArr[i])
            }

            $("#m_modal_1").modal("hide");

        });
    }
    ngOnDestroy() {
    }

    ngAfterViewInit() {
        this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
            'assets/osdec/validation/coaching/coaching-val.js',
            'assets/osdec/validation/validation.js');
    }

    openModal() {
        $("#m_modal_1").modal("show");
        if (this.datatable != null) {
            this.datatable.destroy();
        }


        var options = {
            data: {
                type: "remote",
                source: {
                    read: {

                        url: environment.hostname + "/api/usergetuser",
                        headers: {
                            "Authorization": this.bearToken
                        },
                        params: {
                            userLs: this.userlist
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
                template: function(row) {
                    return row.user.id;
                },
                selector: {
                    class: "m-checkbox--solid m-checkbox--brand checkFn"
                }
            }, {
                field: "name",
                title: "Nama",
                sortable: "asc",
                filterable: !1,
                width: 150,
                template: function(row) {
                    return row.user.name;
                }
            }, {
                field: "email",
                title: "Email",
                sortable: !1,
                width: 150,
                template: function(row) {
                    return row.user.email;
                }
            }]
        }

        let datatable = (<any>$('#api_methods')).mDatatable(options);

        this.datatable = datatable;
        this.datatable.load();

        $("#m_form_search").on("keyup", function(e) {
            this.datatable.setDataSourceParam("search", $(this).val());
            this.datatable.load();
        })



        $(".m_datatable").on("m-datatable--on-check", function(e, a) {
            var l = datatable.setSelectedRecords().getSelectedRecords().length;
            $("#m_datatable_selected_number").html(l), l > 0 && $("#m_datatable_group_action_form").slideDown()
        }).on("m-datatable--on-uncheck m-datatable--on-layout-updated", function(e, a) {
            var l = datatable.setSelectedRecords().getSelectedRecords().length;
            $("#m_datatable_selected_number").html(l), 0 === l && $("#m_datatable_group_action_form").slideUp()
        })


    }

    onCheckOn(id: string) {

        for (var i = 0; i < this.userArray.length; ++i) {
            if (this.userArray[i].id == id) {
                this.userArray.splice(i, 1)
                this.userlist.splice(i, 1)
                break;
            }
        }

        this.userService.getUserById(id).subscribe(
            data => {
                this.userlist.push(data.id)
                this.userArray.push({
                    id: data.id,
                    name: data.name,
                    email: data.email
                })
            }
        )
    }

    onCheckOff(index) {
        this.userlist.splice(index, 1);
        this.userArray.splice(index, 1);
    }

    onSubmit() {
        if (this.coachingForm.valid) {


            this.coaching = new Coaching(
                this.coachingForm.controls['name'].value,
                this.userObj,
                null,
                '1',
                this.frontend,
                this.backend,
                this.database,
                this.coachingForm.controls['frontendlevel'].value,
                this.coachingForm.controls['backendlevel'].value,
                this.coachingForm.controls['databaselevel'].value,
                this.coachingForm.controls['remarks'].value,
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
                null,
                null, null, null, null);


            //start to assign assesment for user

            // let assesArr: any[] = new Array();
            //
            // let frontObj : Assesment =  new Assesment (
            //   null,
            //   null,
            //   null,
            //   this.coachingForm.controls['frontendlevel'].value,//level
            //   null,
            //   this.frontend,//tech
            //   null,
            //   null,
            //   null,
            //   null,
            //   this.userObj//user
            // )
            // assesArr.push(frontObj);
            //
            // let backObj : Assesment =  new Assesment (
            //   null,
            //   null,
            //   null,
            //   this.coachingForm.controls['backendlevel'].value,//level
            //   null,
            //   this.backend,//tech
            //   null,
            //   null,
            //   null,
            //   null,
            //   this.userObj//user
            // )
            // assesArr.push(backObj);
            //
            // let dbObj : Assesment =  new Assesment (
            //   null,
            //   null,
            //   null,
            //   this.coachingForm.controls['databaselevel'].value,//level
            //   null,
            //   this.database,//tech
            //   null,
            //   null,
            //   null,
            //   null,
            //   this.userObj//user
            // )
            // assesArr.push(dbObj);
            //
            // this.assesmentService.generateQue(assesArr).subscribe(
            //   success => {
            //     localStorage.setItem("EXAMOBJ",JSON.stringify(success));
            //     //this.router.navigate(['assesment/user']);
            //     localStorage.setItem("ASSESMODE","COACHING");
            //   }
            // );

            //end of assign assesment to user

            let input = new FormData();

            input.append('fileURS', this.coachingForm.get('fileURS').value);
            input.append('fileSRS', this.coachingForm.get('fileSRS').value);
            input.append('fileSDS', this.coachingForm.get('fileSDS').value);
            input.append('info', new Blob([JSON.stringify(this.coaching)],
                {
                    type: "application/json"
                }));

            const formModel = input;

            this.coachingService.createCoaching(formModel).subscribe(
                data => {

                    this.coachingTemp = data;

                    if (data != null) {
                        this.isEditable = true;
                        this.loading = false;
                        toastr.success(this.message.success);
                    }
                    for (var i = 0; i < this.userArray.length; ++i) {
                        this.userService.getUserById(this.userArray[i].id).subscribe(
                            data => {
                                this.coachingUser = data;
                                let coachingUser: CoachingUser = new CoachingUser(
                                    this.coachingUser,
                                    this.coachingTemp,
                                    null)

                                this.coachingService.createUser(coachingUser).subscribe(success => {
                                    this.redirectCoachingPage()
                                })
                            }
                        )
                    }

                });




        }
        else {
            console.log("error")
        }

    }



    redirectCoachingPage() {
        this.router.navigate(['/coaching/list']).then(() => { window.location.reload(); });
    }

    setFrontend(id: any): void {
        // Match the selected ID with the ID's in array
        this.currentFrontend = this.frontendLs.filter(value => value.id === id);
        this.frontend = this.currentFrontend[0];

    }

    setBackend(id: any): void {
        // Match the selected ID with the ID's in array
        this.currentBackend = this.backendLs.filter(value => value.id === id);
        this.backend = this.currentBackend[0];

    }

    setDatabase(id: any): void {
        // Match the selected ID with the ID's in array
        this.currentDatabase = this.databaseLs.filter(value => value.id === id);
        this.database = this.currentDatabase[0];

    }

    fileURSChange(e) {
        var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

        var pattern = "application/pdf";
        var reader = new FileReader();

        if (file.type != pattern) {
            toastr.error(message.global.invalidFormatPdf);
            return;
        } else {
            this.ursName = file.name;
            reader.readAsDataURL(file);
            this.coachingForm.get('fileURS').setValue(file);
        }
    }

    fileSRSChange(e) {
        var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

        var pattern = "application/pdf";
        var reader = new FileReader();

        if (file.type != pattern) {
            toastr.error(message.global.invalidFormatPdf);
            return;
        } else {
            this.srsName = file.name;
            reader.readAsDataURL(file);
            this.coachingForm.get('fileSRS').setValue(file);
        }
    }

    fileSDSChange(e) {
        var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

        var pattern = "application/pdf";
        var reader = new FileReader();

        if (file.type != pattern) {
            toastr.error(message.global.invalidFormatPdf);
            return;
        } else {
            this.sdsName = file.name;
            reader.readAsDataURL(file);
            this.coachingForm.get('fileSDS').setValue(file);
        }
    }
}
