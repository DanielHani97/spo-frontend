import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";

import { Coaching } from '../../../../../model/coaching/coaching';
import { CoachingCoach } from '../../../../../model/coaching/coachingCoach';
import { CoachingService } from '../../../../../services/coaching/coaching.service'
import { User } from '../../../../../model/user';
import { UserService } from '../../../../../services/user.service';
import { environment } from "../../../../../../environments/environment";
declare var $: any;
declare let toastr:any;
@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./coaching-assign-coacher.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [CoachingService, UserService]
})
export class CoachingAssignCoacherComponent implements OnInit, AfterViewInit, OnDestroy {

	coaching: Coaching;
	id: string;
    bearToken : string;
    //used in userForm
    user: any;

    //coach list (dropdown)
    coachLs: any[];

    //FormGrouping
	coachingForm: FormGroup;

    //for function getoach
    currentCoach: any;
    coach: User;
    datatable: any;
    coachingObj = null;
    //toastr
    loading: boolean = false;
    isEditable = false;
    message: any = {
      success: "Coach Telah Berjaya Ditetapkan"
    }

    coachList: String[] = [];


	//catch coaching id
    private sub: any;
    private coachers = [];


    constructor(private _script: ScriptLoaderService, private coachingService:CoachingService,private userService:UserService, private router:Router, private route: ActivatedRoute) { }

    ngOnInit() {

        this.bearToken = "Bearer "+localStorage.getItem('jwtToken');


        //for userForm


    	this.coachingForm = new FormGroup({
    		name: new FormControl({value: '', disabled: true}, Validators.required),
            user: new FormControl({value: '', disabled: true}, Validators.required),
	        agency: new FormControl({value: '', disabled: true}, Validators.required),
	        status: new FormControl({value: '', disabled: true}, Validators.required),
	        frontend: new FormControl({value: '', disabled: true}, Validators.required),
	        backend: new FormControl({value: '', disabled: true}, Validators.required),
	        frontendlevel: new FormControl({value: '', disabled: true}, Validators.required),
            backendlevel: new FormControl({value: '', disabled: true}, Validators.required),
            databaselevel: new FormControl({value: '', disabled: true}, Validators.required),
	        database: new FormControl({value: '', disabled: true}, Validators.required),
	        remarks: new FormControl({value: '', disabled: true}, Validators.required),
            admin_remarks: new FormControl({value: '', disabled: true}, Validators.required),
            coach_remarks: new FormControl({value: '', disabled: true}, Validators.required)
	    });



        //for this . id
        this.sub = this.route.params.subscribe(
            params => {
                this.id = params['id'];

                //for coachingForm
                if (this.id){
                    this.coachingService.getCoachingById(this.id).subscribe(
                        coaching => {
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

                             var frameName = "";
                             var langName = "";
                             var dbName = "";

                             var frameLvl = "";
                             var langLvl = "";
                             var dbLvl = "";

                             var frameId = "";
                             var langId = "";
                             var dbId = "";

                             if(coaching.frontend){
                               frameName = coaching.frontend.name;
                               frameId = coaching.frontend.id;
                               frameLvl= coaching.frontendlevel;
                             }if(coaching.backend){
                               langName = coaching.backend.name;
                               langId = coaching.backend.id;
                               langLvl= coaching.backendlevel;
                             }if(coaching.database){
                               dbName = coaching.database.name;
                               dbId = coaching.database.id;
                               dbLvl= coaching.databaselevel;
                             }


                            this.id = coaching.id;
                            this.coachingObj = coaching;

                            this.coachingForm.patchValue({
                                name: coaching.name,
                                user: coaching.user.name,
                                agency: agensi,
                                status: coaching.status,
                                frontend: frameName,
                                backend: langName,
                                database: dbName,
                                frontendlevel: coaching.frontendlevel,
                                backendlevel: coaching.backendlevel,
                                databaselevel: coaching.databaselevel,
                                remarks: coaching.remarks,
                                admin_remarks: coaching.admin_remarks,
                                coach_remarks: coaching.coach_remarks
                            });

                            //load user for coaching
                            this.coachingService.getUserByCoaching(this.id).subscribe(
                                data => {
                                    this.user = data;


                                    for(let obj of this.user){
                                      var skills = obj.user.skill;

                                      for(let skill of skills){
                                        var skillTechId = skill.technology.id
                                        var skillLvl = skill.level;
                                        var skillMark = skill.mark;

                                        if(frameId){
                                          if((frameId == skillTechId) && (frameLvl == skillLvl) ){
                                            obj.coaching.frontend.modifiedby = skillMark;
                                          }else{
                                            obj.coaching.frontend.modifiedby = 0;
                                          }
                                        }
                                        if(langId){
                                          if((langId == skillTechId) && (langLvl == skillLvl) ){
                                            obj.coaching.backend.modifiedby = skillMark;
                                          }else{
                                            obj.coaching.backend.modifiedby = 0;
                                          }
                                        }
                                        if(dbId){
                                          if((dbId == skillTechId) && (dbLvl == skillLvl) ){
                                            obj.coaching.database.modifiedby = skillMark;
                                          }else{
                                            obj.coaching.database.modifiedby = 0;
                                          }
                                        }

                                      }
                                    }
                                }
                            );
                        },

                        error => {
                            console.log(error);
                        }
                    );
                }

                // if (this.id){
                //
                //     this.coachingService.getUserByCoaching(this.id).subscribe(
                //         data => {
                //           this.user = data;
                //         }
                //     );
                //
                //     this.coachingService.getCoachingById(this.id).subscribe(
                //         coaching => {
                //              let agensi = "";
                //              if(coaching.agency!=null){
                //                 agensi = coaching.agency.name
                //              }else{
                //                agensi = "";
                //              }
                //             this.id = coaching.id;
                //
                //
                //             this.coachingForm.patchValue({
                //                 name: coaching.name,
                //                 user: coaching.user.name,
                //                 agency: agensi,
                //                 status: coaching.status,
                //                 frontend: coaching.frontend.name,
                //                 backend: coaching.backend.name,
                //                 frontendlevel: coaching.frontendlevel,
                //                 backendlevel: coaching.backendlevel,
                //                 databaselevel: coaching.databaselevel,
                //                 database: coaching.database.name,
                //                 remarks: coaching.remarks,
                //                 admin_remarks: coaching.admin_remarks,
                //                 coach_remarks: coaching.coach_remarks
                //
                //             });
                //             this.coachingObj = coaching;
                //         },
                //
                //
                //         error => {
                //             console.log(error);
                //         }
                //     );
                // }
            }
        );

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

    ngOnDestroy(): void{
       this.sub.unsubscribe();
    }


    modalCoach(){

        if(this.datatable!=null){
            this.datatable.destroy();
        }
        
        
            var options = {
                data: {
                        type: "remote",
                        source: {
                            read: {

                                url: environment.hostname+"/api/usergetcoach",
                                headers: {
                                    "Authorization": this.bearToken,
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

                let datatable = (<any>$('#api_methods')).mDatatable(options);

                
                

                this.datatable = datatable;
                
                //datatable.setDataSourceParam("coachLs", "jj")
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


    onCheckOn(id: string){

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

    onCheckOff(index){
      this.coachers.splice(index, 1);
      this.coachList.splice(index, 1);
    }

    ngAfterViewInit() {
         this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
             'assets/osdec/validation/coaching/coaching-val.js');
    }

    onSubmit(){

        if (this.id) {
            if(this.coachers.length>0){
                let coaching: Coaching = new Coaching(
                    null,
                    null,
                    null,
                    '2',
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    this.coachingForm.controls['admin_remarks'].value,
                    this.coachingForm.controls['coach_remarks'].value,
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
                    this.id,null,null,null
                );

                this.coachingService.updateCoaching(coaching).subscribe(
                    success=>{
                        for (var i = 0; i < this.coachers.length; ++i) {
                            this.userService.getUserById(this.coachers[i].id).subscribe(
                                data =>{
                                    let coachingCoach : CoachingCoach = new CoachingCoach(
                                        data,
                                        this.coachingObj,
                                        null
                                    )
                                    this.coachingService.createCoach(coachingCoach).subscribe(
                                        success=>{
                                            this.isEditable = true;
                                            this.loading = false;
                                            toastr.success(this.message.success);
                                            this.redirectListPage();
                                        }
                                    );
                                }
                            )
                        }
                    }
                );
            }else{
                $("#m_modal_coach").modal("show");
            }
        }
    }

    redirectListPage() {
      this.router.navigate(['/coaching/list/admin']);
    }

    redirectProfile(id){
      this.router.navigate(['/header/profile/view/', id]);
    }
}
