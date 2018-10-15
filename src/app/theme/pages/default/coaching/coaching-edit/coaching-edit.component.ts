import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";
import { NgbDatepickerConfig, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateFRParserFormatter } from "../../../../../_directives/ngb-date-fr-parser-formatter"

import { User } from '../../../../../model/user';
import { Coaching } from '../../../../../model/coaching/coaching';
import { CoachingUser } from '../../../../../model/coaching/coachingUser';
import { CoachingCoach } from '../../../../../model/coaching/coachingCoach';
import { CoachingService } from '../../../../../services/coaching/coaching.service';
import { UserService } from '../../../../../services/user.service';
import { Technology } from '../../../../../model/setup/technology';
import { TechnologyService } from '../../../../../services/setup/technology.service';
import { environment } from "../../../../../../environments/environment";
import { AssesmentService } from '../../../../../services/assesment/assesment.service';
import { Assesment } from '../../../../../model/assesment/assesment';
import { Manday } from '../../../../../model/setup/manday';
import { MandayService } from '../../../../../services/setup/manday.service';

import { message } from "../../../../../message/default";

declare var $: any;
declare let toastr:any;

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./coaching-edit.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [CoachingService, TechnologyService, UserService, AssesmentService, MandayService, {provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class CoachingEditComponent implements OnInit, AfterViewInit, OnDestroy {
    model;
    minDate: NgbDateStruct = {year: 1950, month: 1, day: 1};
    maxDate: NgbDateStruct = {year: 2099, month: 12, day: 31};

    endMin: NgbDateStruct = {year: 1950, month: 1, day: 1};
    startMax: NgbDateStruct = {year: 2099, month: 12, day: 31};

    showC: Coaching;
    coaching: Coaching;
    id: string;
    jumlahManday: number;
    adminId: string;
    adminObj: any;

    coachingTemp: Coaching;
    coachingUser: User;
    coachingUserTemp: CoachingUser;
    userLs: any[];

    datatable: any;
    datatable2: any;
    frontend: Technology;
    backend: Technology;
    database: Technology;
    userid: string;
    mandayTotal: number;
    mandayTotalMsg: any;

    frontendLs: any[];
    coachLs: any[];
    currentCoach: any[];
    backendLs: any[];

    databaseLs: any[];
    bearToken : string;

    reservedNew: number;
    reserveOld: number;
    mandayReserved: number;
    mandayId: any;
    mandayObj: any;

    //for technology
    currentFrontend: any;
    currentBackend: any;
    currentLanguage: any;
    currentDatabase: any;

    //toastr
    loading: boolean = false;
    isEditable = false;
    message: any = {
      success: "Maklumat Coaching Telah Berjaya Disimpan"
    }

    userObj = null;
    agencyObj = null;

    coachingForm: FormGroup;
    belowForm: FormGroup;
    coachList: String[] = [];
    userList: String[] = [];
    private sub:any;
    private coachers = [];
    private coachersOld = [];
    private userArray = [];
    private userOld = [];
    private currentUser = [];
    private tempUser = [];

    //document upload
    fileForm: FormGroup;

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
      private userService:UserService,
      private technologyService:TechnologyService,
      private coachingService:CoachingService,
      private router:Router,
      private route: ActivatedRoute,
      private assesmentService: AssesmentService,
      private mandayService: MandayService,
      private parserFormatter: NgbDateParserFormatter,
      config: NgbDatepickerConfig) {
      config.outsideDays = 'collapsed';
          config.firstDayOfWeek = 7;
          // weekends are disabled
          config.markDisabled = (date: NgbDateStruct) => {
            const d = new Date(date.year, date.month - 1, date.day);
            return d.getDay() === 0 || d.getDay() === 6;
          };
      }

    onChange(value){
        if(value==null){
            this.endMin = this.endMin;
        }else{
            this.endMin = value;
        }
    }

    onChange2(value){
        if(value==null){
            this.startMax = this.startMax;
        }else{
            this.startMax = value;
        }
    }

    ngOnInit() {

      this.bearToken = "Bearer "+localStorage.getItem('jwtToken');
      this.sub = this.route.params.subscribe(
        params => {
          this.id = params['id'];
      });

      let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.adminId = currentUser.id;

      this.coachingService.getBackend().subscribe(
        data => {
          this.backendLs = data;
        }
      );

      this.coachingService.getFrontend().subscribe(
          data => {
            this.frontendLs = data;
         }
      );

      this.coachingService.getDatabase().subscribe(
        data =>{
          this.databaseLs = data;
        }
      );

      this.mandayService.getManday().subscribe(
        data=>{
            let manday2 = data.filter(value => value.category === 'coaching');
            this.mandayObj = manday2[0];
            this.mandayId = this.mandayObj.id;
            this.mandayReserved = Number(this.mandayObj.mandayReserved);
            this.mandayTotal = this.mandayObj.total;
        }
      );


      this.coachingForm = new FormGroup({
        name: new FormControl('', Validators.required),
        pemohon: new FormControl({value: '', disabled: true}, Validators.required),
        agency: new FormControl({value: '', disabled: true}, Validators.required),
        frontend: new FormControl('', Validators.required),
        backend: new FormControl('', Validators.required),
        database: new FormControl('', Validators.required),
        remarks: new FormControl('', Validators.required),
        frontendlevel: new FormControl('', Validators.required),
        backendlevel: new FormControl('', Validators.required),
        databaselevel: new FormControl('', Validators.required)
      });

      this.fileForm = new FormGroup({
        fileURS: new FormControl(),
        fileSRS: new FormControl(),
        fileSDS: new FormControl()
      });

      this.belowForm = new FormGroup({
          coach_remarks: new FormControl('',Validators.required),
          admin_remarks: new FormControl('', Validators.required),
          cstart: new FormControl('', Validators.required),
          cendo: new FormControl('', Validators.required),
          reservedManday: new FormControl('',Validators.required)
      });

      if (this.id) {
        this.coachingService.getCoachingById(this.id).subscribe(
          coaching => {

            this.userService.getUserById(this.adminId).subscribe(
              data=>{
                this.adminObj = data;
              }
            )

            this.coachingTemp = coaching;
            let agensi = "";

            if(coaching.user.type=="GOV"){
                if(coaching.user.agency!=null){
                    agensi = coaching.user.agency.name;
                }else{
                    agensi = "";
                }
            }else if(coaching.user.type=="PRIVATE"){
                if(coaching.user.company!=null){
                    agensi = coaching.user.company.name;
                }else{
                    agensi = "";
                }
            }else{
                agensi = "";
            }

            var usedManday;
            if(coaching.mandayUsed==null){
              usedManday = "0"
            }else{
              usedManday = coaching.mandayUsed
            }
            this.jumlahManday = Number(usedManday);
            this.frontend = coaching.frontend;
            this.backend = coaching.backend;
            this.database = coaching.database;

            this.coachingForm.patchValue({
              name: coaching.name,
              pemohon: coaching.user.name,
              agency: agensi,
              frontend: coaching.frontend.id,
              backend: coaching.backend.id,
              database: coaching.database.id,
              remarks: coaching.remarks,
              frontendlevel: coaching.frontendlevel,
              backendlevel: coaching.backendlevel,
              databaselevel: coaching.databaselevel,
            });

            var urs = coaching.urs;
            var srs = coaching.srs;
            var sds = coaching.sds;

            if(urs){
              this.ursName = urs.name;
            }if(srs){
              this.srsName = srs.name;
            }if(sds){
              this.sdsName = sds.name;
            }

            var startDate;
            var endDate;

            if (coaching.starting_date != null){
              startDate = new Date(coaching.starting_date);
              startDate = {year: startDate.getFullYear(), month: startDate.getMonth()+1, day: startDate.getDate()};
            }else{
              startDate = null;
            }

            if (coaching.ending_date != null){
             endDate = new Date(coaching.ending_date);
             endDate = {year: endDate.getFullYear(), month: endDate.getMonth()+1, day: endDate.getDate()};
            }else{
              endDate = null
            }

            var reservedOld;
            if(coaching.mandayReserved==null){
              reservedOld = "0"
            }else{
              reservedOld = coaching.mandayReserved
            }

            this.reserveOld= Number(reservedOld);

            this.belowForm.patchValue({
              coach_remarks: coaching.coach_remarks,
              admin_remarks: coaching.admin_remarks,
              cstart: startDate,
              cendo: endDate,
              reservedManday: coaching.mandayReserved,
            })

            this.coachingService.getCoachingCoach(this.id).subscribe(
                data => {
                    this.currentCoach = data;

                    for (var i = 0; i < this.currentCoach.length; ++i) {
                       this.coachList.push(this.currentCoach[i].coach.id)

                       this.coachersOld.push({
                         id: this.currentCoach[i].id
                       })

                       this.coachers.push({
                         id: this.currentCoach[i].coach.id,
                         name: this.currentCoach[i].coach.name,
                         email: this.currentCoach[i].coach.email
                       })
                    }
                }
            );
            this.coachingService.getUserByCoaching(this.id).subscribe(
              data=>{
                this.userLs = data;
                for (var i = 0; i < this.userLs.length; ++i) {
                  this.userList.push(this.userLs[i].user.id)
                  this.userOld.push({
                    id: this.userLs[i].id
                  })

                  this.userArray.push({
                    id: this.userLs[i].user.id,
                    name: this.userLs[i].user.name,
                    email: this.userLs[i].user.email
                  })
                }
              }
            );
          },error => {
            console.log(error);
          }
        );
      }

      $(document).on('click', '#m_datatable_check_all2', (e) => {
        e.preventDefault();
        let cbArr2: any[] = new Array();
        var $cbAnswer2 = $(".m-datatable__body").find(".m-checkbox > input");

        $cbAnswer2.each( function(i) {
          var status2 = $(this).is(":checked");
          if(status2){
            var id2 = $(this).val();

            cbArr2.push(id2);
          }
        });

        for (var i = 0; i < cbArr2.length; ++i) {
          this.onCheckOn2(cbArr2[i])
        }

         $("#m_modal_2").modal("hide");

      });


      $(document).on('click', '#m_datatable_check_all', (e) => {
              e.preventDefault();
              let cbArr: any[] = new Array();
              var $cbAnswer = $(".m-datatable__body").find(".m-checkbox > input");

              $cbAnswer.each( function(i) {
                var status = $(this).is(":checked");
                if(status){
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
    ngOnDestroy(){
    }

    ngAfterViewInit() {
         this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
             'assets/osdec/validation/coaching/coaching-val.js',
             'assets/osdec/validation/validation.js');
    }

    modalCoach(){
        if(this.datatable2!=null){
            this.datatable2.destroy();
        }
            var options = {
                data: {
                        type: "remote",
                        source: {
                            read: {

                                url: environment.hostname+"/api/usergetcoach",
                                headers: {
                                    "Authorization": this.bearToken
                                 },
                                params:{
                                    coachLs: this.coachList
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
                        template: function(row){
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
                        template: function(row){
                            return row.user.name;
                           }
                    }, {
                        field: "skill",
                        title: "Kepakaran",
                        width: 150,
                        sortable: false,
                        template: function(row){

                            var result = "";
                            var skills = row.user.skill;

                            if(skills!=null){
                                for(let obj of skills){
                                    result+=obj.technology.name+","
                                }
                                result = result.slice(0,-1)
                            }

                            return result;
                        }
                    }, {
                        field: "email",
                        title: "Email",
                        width: 150,
                        template: function(row){
                            return row.user.email;
                           }
                    }]
                  }

                let datatable = (<any>$('#coachList')).mDatatable(options);
                this.datatable2 = datatable;
                this.datatable2.load();

                $("#m_form_search2").on("keyup", function(e) {
                    this.datatable2.setDataSourceParam("search", $(this).val());

                    this.datatable2.load();
                })

                

              $("#coachList").on("m-datatable--on-check", function(e, a) {
                  var l = datatable.setSelectedRecords().getSelectedRecords().length;
                  $("#m_datatable_selected_number").html(l), l > 0 && $("#m_datatable_group_action_form2").slideDown()
              }).on("m-datatable--on-uncheck m-datatable--on-layout-updated", function(e, a) {
                  var l = datatable.setSelectedRecords().getSelectedRecords().length;
                  $("#m_datatable_selected_number").html(l), 0 === l && $("#m_datatable_group_action_form2").slideUp()
              })
        
    }

    openModal(){

         if (this.datatable!=null){
            this.datatable.destroy();
          }
           var options = {
            data: {
                    type: "remote",
                    source: {
                        read: {

                            url: environment.hostname+"/api/usergetuser",
                            headers: {
                                "Authorization": this.bearToken
                             },
                              params:{
                                userLs: this.userList
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
                    template: function(row){
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
                    template: function(row){
                        return row.user.name;
                       }
                }, {
                    field: "email",
                    title: "Email",
                    width: 150,
                    template: function(row){
                        return row.user.email;
                       }
                }]
              }

            let datatable = (<any>$('#userList')).mDatatable(options);
            this.datatable = datatable
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

          /*$(document).on('click', '.onClickOn',  ($event) => {
            $event.preventDefault()
            var id = $event.target.id

            this.onCheckOn(id);
            alert("user added");
          })*/
         


    }

    onCheckOn(id: string){

      for (var i = 0; i < this.userArray.length; ++i) {
        if(this.userArray[i].id == id){
          this.userList.splice(i, 1);
          this.userArray.splice(i, 1)
          break;
        }
      }

      this.userService.getUserById(id).subscribe(
        data => {
          this.userList.push(data.id);
          this.userArray.push({
            id: data.id,
            name: data.name,
            email: data.email
          })
        }
      )
    }

    onCheckOff(index){
      this.userList.splice(index, 1);
      this.userArray.splice(index, 1);
    }

    onCheckOn2(id: string){

        for (var i = 0; i < this.coachers.length; ++i) {
            if(this.coachers[i].id == id){
                this.coachList.splice(i, 1)
                this.coachers.splice(i, 1)
                break;
            }
        }

        this.userService.getUserById(id).subscribe(
            data => {
              this.coachList.push(data.id)
                this.coachers.push({
                    id: data.id,
                    name: data.name,
                    email: data.email
                })
            }
        )
    }

    onCheckOff2(index){
      this.coachList.splice(index, 1);
      this.coachers.splice(index, 1);
    }

    onSubmit() {
      var form = $('#belowForm');

         form.validate({
           rules:{
             reservedManday: {
                 number: !0
             }
           }
        });

      if(!form.valid) {
        return false;
      }else{
        if(Number(this.belowForm.controls['reservedManday'].value)<this.jumlahManday){
          $("#m_modal_manday").modal("show");
        }else{

            if(this.id) {
              var newReserved = this.mandayReserved - this.reserveOld + Number(this.belowForm.controls['reservedManday'].value);
              if(newReserved>this.mandayTotal){
                var mandayUsed = this.mandayReserved - this.reserveOld;
                this.mandayTotalMsg = "Jumlah peruntukan manday coaching yang telah digunakan adalah: " + mandayUsed +"/"+this.mandayTotal
                $("#m_modal_total").modal("show");

              }else{
                this.reservedNew = newReserved;
                let date;
                let ngbDate = this.belowForm.controls['cstart'].value;
                if(ngbDate != null){
                   date = new Date(ngbDate.year, ngbDate.month-1, ngbDate.day);
                }else{
                   date = null
                }
                let date2;
                let ngbDate2 = this.belowForm.controls['cendo'].value;
                if(ngbDate2 != null){
                  date2 = new Date(ngbDate2.year, ngbDate2.month-1, ngbDate2.day);
                }else{
                  date2 =null;
                }


                let coaching : Coaching = new Coaching(
                  this.coachingForm.controls['name'].value,
                  null,
                  null,
                  null,
                  this.frontend,
                  this.backend,
                  this.database,
                  this.coachingForm.controls['frontendlevel'].value,
                  this.coachingForm.controls['backendlevel'].value,
                  this.coachingForm.controls['databaselevel'].value,
                  this.coachingForm.controls['remarks'].value,
                  this.belowForm.controls['admin_remarks'].value,
                  this.belowForm.controls['coach_remarks'].value,
                  date,
                  date2,
                  null,
                  null,
                  this.belowForm.controls['reservedManday'].value,
                  null,
                  this.adminObj,
                  null,
                  null,
                  null,
                  this.id,null,null,null
                );

                let input = new FormData();

                input.append('fileURS', this.fileForm.get('fileURS').value);
                input.append('fileSRS', this.fileForm.get('fileSRS').value);
                input.append('fileSDS', this.fileForm.get('fileSDS').value);
                input.append('info', new Blob([JSON.stringify(coaching)],
                    {
                        type: "application/json"
                    }));

                const formModel = input;

                this.coachingService.editCoaching(formModel).subscribe(
                  success=>{


                    let manday : Manday = new Manday(
                         null,
                         null,
                         null,
                         this.reservedNew.toString(),
                         this.mandayId
                     )
                     this.mandayService.updateMandayReserved(manday).subscribe(
                       success=>{
                         for (var j = 0; j < this.userOld.length; ++j) {
                             this.coachingService.deleteCoachingUser(this.userOld[j].id).subscribe();
                          }
                          for (var i = 0; i < this.userArray.length; ++i) {
                            this.userService.getUserById(this.userArray[i].id).subscribe(
                              data =>{
                                this.coachingUser = data;
                                let coachingUser: CoachingUser = new CoachingUser(
                                  this.coachingUser,
                                  this.coachingTemp,
                                  null)

                                this.coachingService.createUser(coachingUser).subscribe()
                              }
                            )
                          }

                          for (var j = 0; j < this.coachersOld.length; ++j) {
                             this.coachingService.deleteCoachingCoach(this.coachersOld[j].id).subscribe();
                          }
                          for (var i = 0; i < this.coachers.length; ++i) {
                            this.userService.getUserById(this.coachers[i].id).subscribe(
                              data =>{
                                var user = data;
                                let coachingUser: CoachingCoach = new CoachingCoach(
                                  user,
                                  this.coachingTemp,
                                  null)

                                this.coachingService.createCoach(coachingUser).subscribe( success =>{
                                  //this.redirectCoachingPage()
                                })
                              }
                            )
                          }

                          this.isEditable = true;
                          this.loading = false;
                          this.redirectCoachingPage();
                          toastr.success(this.message.success);
                       }
                     )
                  }
                );
              }


            }

        }
      }





    }



    redirectCoachingPage() {
      this.router.navigate(['/coaching/list/admin']);
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
        }else if (file.size > 10000000) {
            toastr.error(message.global.invalidSize);
            return;
        }else{
          this.ursName = file.name;
          reader.readAsDataURL(file);
          this.fileForm.get('fileURS').setValue(file);
        }
    }

    fileSRSChange(e) {
        var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

        var pattern = "application/pdf";
        var reader = new FileReader();

        if (file.type != pattern) {
            toastr.error(message.global.invalidFormatPdf);
            return;
        }else if (file.size > 10000000) {
            toastr.error(message.global.invalidSize);
            return;
        }else{
          this.srsName = file.name;
          reader.readAsDataURL(file);
          this.fileForm.get('fileSRS').setValue(file);
        }
    }

    fileSDSChange(e) {
        var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

        var pattern = "application/pdf";
        var reader = new FileReader();

        if (file.type != pattern) {
            toastr.error(message.global.invalidFormatPdf);
            return;
        }else if (file.size > 10000000) {
            toastr.error(message.global.invalidSize);
            return;
        }else{
          this.sdsName = file.name;
          reader.readAsDataURL(file);
          this.fileForm.get('fileSDS').setValue(file);
        }
    }
}
