import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy  } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";

import { Coaching } from '../../../../../model/coaching/coaching';
import { CoachingService } from '../../../../../services/coaching/coaching.service';
import { UserService } from '../../../../../services/user.service';

declare let toastr:any;

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./coaching-valuation.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [CoachingService, UserService]
})
export class CoachingValuationComponent implements OnInit, AfterViewInit, OnDestroy  {

	coaching: Coaching;
	id: string;
  userid: string;
  userObj: any;

	user: any;

    belowForm: FormGroup;
	coachingForm: FormGroup;
	private sub: any;
    //toastr
    loading: boolean = false;
    isEditable = false;
    message: any = {
      success: "Penilaian Telah Direkodkan"
    }

    constructor(private _script: ScriptLoaderService, private coachingService:CoachingService, private userService: UserService, private router:Router, private route: ActivatedRoute) { }

    ngOnInit() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.userid = currentUser.id;

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
            admin_remarks: new FormControl({value: '', disabled: true}, Validators.required)
        });

        this.belowForm = new FormGroup({
            kelayakan: new FormControl('', Validators.required),
            coach_remarks: new FormControl('', Validators.required)
        });

    	this.sub = this.route.params.subscribe(
    		params => {

    			this.id = params['id'];

                if (this.id){

                    this.coachingService.getCoachingById(this.id).subscribe(
                        coaching => {

                          this.userService.getUserById(this.userid).subscribe(
                            data=>{
                              this.userObj = data;
                            }
                          )

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
                            this.coaching =coaching;
                            this.id = coaching.id;
                            this.coachingForm.patchValue({
                                name: coaching.name,
                                user: coaching.user.name,
                                agency: agensi,
                                status: coaching.status,
                                frontend: coaching.frontend.name,
                                backend: coaching.backend.name,
                                frontendlevel: coaching.frontendlevel,
                                backendlevel: coaching.backendlevel,
                                databaselevel: coaching.databaselevel,
                                database: coaching.database.name,
                                admin_remarks: coaching.admin_remarks,
                                remarks: coaching.remarks
                            });


                            this.belowForm.patchValue({
                                coach_remarks: coaching.coach_remarks
                            });

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
    		}
    	);
    }


    ngOnDestroy(): void{
    	this.sub.unsubscribe();
    }

    ngAfterViewInit() {
    	this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
             'assets/osdec/validation/coaching/coaching-valuation.js',
             'assets/osdec/validation/validation.js');
    }
    redirectListPage() {
      this.router.navigate(['/coaching/list/coach']);
    }

    onSubmit(){

    	if (this.belowForm.valid) {
            if (this.id) {
                let coaching: Coaching = new Coaching(
                    null,
                    null,
                    null,
                    '3',
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    this.coachingForm.controls['admin_remarks'].value,
                    this.belowForm.controls['coach_remarks'].value,
                    null,
                    null,
                    this.belowForm.controls['kelayakan'].value,
                    null,
                    null,
                    null,
                    null,
                    this.userObj,
                    null,
                    null,
                    this.id,null,null,null);


                this.coachingService.updateCoaching(coaching).subscribe(
                    success=>{
                        this.isEditable = true;
                          this.loading = false;
                          toastr.success(this.message.success);
                        this.redirectListPage();
                    }
                );
            }


        }
    }

    redirectProfile(id){
      this.router.navigate(['/header/profile/view/', id]);
    }

}
