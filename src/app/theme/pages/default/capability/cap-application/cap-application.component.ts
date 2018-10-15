import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";

import { User } from '../../../../../model/user';
import { Capability } from '../../../../../model/capability/capability';
import { CapabilityUser } from '../../../../../model/capability/capabilityUser';
import { CapabilityService } from '../../../../../services/capability/capability.service';
import { UserService } from '../../../../../services/user.service';

import { Assesment } from '../../../../../model/assesment/assesment'
import { AssesmentService } from '../../../../../services/assesment/assesment.service';
import { message } from "../../../../../message/default";

declare let toastr:any;
declare var jQuery:any;

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./cap-application.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [CapabilityService, UserService, AssesmentService]
})
export class CapApplicationComponent implements OnInit, AfterViewInit {

    capability: Capability;
    id: string;
    bearToken: string;
    userid: string;
    userObj = null;
    capObj = null;
    start : string;
    end : string;
    aktivitiLs : any[];
    coachLs: any[];
    currentCoach: any;

    capForm: FormGroup;
    private activities = [];
    private aktiviti = [];
    private sub : any;
    objUser = null

    confirmType : string = "success";
    confirmMsg : string;
    action : string;

    constructor(private _script: ScriptLoaderService,
      private userService:UserService,
      private capabilityService:CapabilityService,
      private router:Router,
      private route: ActivatedRoute,
      private assesmentService: AssesmentService
    ) { }

    ngOnInit() {

        //user id get
        this.bearToken = "Bearer "+localStorage.getItem('jwtToken');
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.userid = currentUser.id;

        //capability id get
        this.sub = this.route.params.subscribe(
            params => {
                this.id = params['id'];
            }
        );

        this.userService.getUserById(this.userid).subscribe(
                data => {
                    this.objUser = data;
                }

                )

        this.capabilityService.getCapabilityById(this.id).subscribe(
            data=>{
                this.capObj =data;
                this.start = this.formatDate(this.capObj.starting_date),
                this.end = this.formatDate(this.capObj.ending_date),
                this.capForm.patchValue({
                    name: this.capObj.name,
                    kepakaran: this.capObj.kepakaran.name,
                    duration: this.capObj.duration,
                    start_date: this.start,
                    end_date: this.end,
                    remarks: this.capObj.remarks
                })
            }
        )

        this.userService.getUserById(this.userid).subscribe(
            data=>{
                this.userObj =data;
                let agency;

                if(data.type=="GOV"){
                    if(data.agency!=null){
                        agency = data.agency.name;
                    }else{
                        agency = "";
                    }
                }else if(data.type=="PRIVATE"){
                    if(data.company!=null){
                        agency = data.company.name;
                    }else{
                        agency = "";
                    }
                }else{
                    agency = "";
                }

                this.capForm.patchValue({
                    pemohon: data.name,
                    agensi: agency
                })
            }
        )

        this.capForm = new FormGroup({
            pemohon: new FormControl({value: '', disabled: true}, Validators.required),
            agensi: new FormControl({value: '', disabled: true}, Validators.required),
            name: new FormControl({value: '', disabled: true}, Validators.required),
            kepakaran: new FormControl({value: '', disabled: true}, Validators.required),
            coach: new FormControl({value: '', disabled: true}, Validators.required),
            duration: new FormControl({value: '', disabled: true}, Validators.required),
            start_date: new FormControl({value: '', disabled: true}, Validators.required),
            end_date: new FormControl({value: '', disabled: true}, Validators.required),
            remarks: new FormControl({value: '', disabled: true}, Validators.required),
        })

        this.capabilityService.getCapabilityAct(this.id).subscribe(
            data => {
                this.aktiviti = data;
                for (var i = 0; i < this.aktiviti.length; ++i) {

                    //format Start_Date
                    var datestart = new Date();
                    var startdate = this.formatDate(this.aktiviti[i].start_date);

                    //format End_Date
                    var dateend = new Date();
                    var enddate = this.formatDate(this.aktiviti[i].end_date);

                    this.activities.push({
                            name: this.aktiviti[i].name,
                            venue: this.aktiviti[i].venue,
                            start: startdate,
                            endo: enddate,
                            attendance: this.aktiviti[i].attendance,
                            duration: this.aktiviti[i].duration

                    })
                }
            }
        )

        this.capabilityService.getCapabilityCoach(this.id).subscribe(
            data => {
                this.currentCoach = data;

            }
        )
    }

    onSubmit(){
        if(this.id){
            this.capabilityService.getCapabilityById(this.id).subscribe(
                data => {
                    this.capability = data;

                    let assesArr: any[] = new Array();
                    let assesObj : Assesment =  new Assesment (
                      null,
                      null,
                      null,
                      "Mahir",
                      null,
                      data.kepakaran,//tech
                      null,
                      null,
                      null,
                      null,
                      this.objUser//user
                    )
                    assesArr.push(assesObj);

                    let capabilityUser: CapabilityUser = new CapabilityUser (
                    this.objUser,
                    this.capability,
                    "1",
                    null,
                    null,
                    this.objUser,
                    null,
                    null,
                    null);

                    this.capabilityService.isExistCapabilityUser(capabilityUser).subscribe(
                        success=>{

                          this.assesmentService.generateQue(assesArr).subscribe(
                            success => {
                              this.action = "NEW";
                              this.confirmMsg = message.cap.new;
                              this.confirmType = "danger";
                              jQuery('#m_modal_add').modal('show');
                              localStorage.setItem("EXAMOBJ",JSON.stringify(success));
                              localStorage.setItem("CAPOBJ",JSON.stringify(data));
                              localStorage.setItem("ASSESMODE","CAP");
                            },
                            error => {
                              var errorType = error;

                              if(errorType == 404){
                                toastr.error(message.cap.error404);
                              }else if(errorType == 409){
                                this.confirmMsg = message.cap.error409;
                                this.confirmType = "success";
                                this.action = "EXIST";
                                jQuery('#m_modal_add').modal('show');

                              }
                            }
                          );
                        },
                        error=>{
                            toastr.error(message.cap.danger);
                        }
                    );
                }
            );
        }

    }

    formatDate(date){
        var datemagic = new Date(date);
        var day = datemagic.getDate();
        var month = datemagic.getMonth()+1;
        var year = datemagic.getFullYear();
        return day + '/' + month + '/' + year;
    }

    ngAfterViewInit() {
        this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
            'assets/demo/default/custom/header/actions.js');

    }
    redirecListPage(){
        this.router.navigate(['cap/register/']);
    }

    onConfirm($event){
      $event.preventDefault();

      if(this.action === "NEW"){

        jQuery('#m_modal_add').modal('hide');
        this.router.navigate(['assesment/user']);
      }else if(this.action === "EXIST"){

        let capabilityUser: CapabilityUser = new CapabilityUser (
        this.objUser,
        this.capability,
        "1",
        null,
        null,
        this.objUser,
        null,
        null,
        null);

        this.capabilityService.createUser(capabilityUser).subscribe(
          success=>{
              toastr.success(message.cap.success);
              jQuery('#m_modal_add').modal('hide');
              this.router.navigate(['cap/list/']);
          }
        );
      }
    }

}
