import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";

import { CapabilityUser } from '../../../../../model/capability/capabilityUser';
import { CapabilityService } from '../../../../../services/capability/capability.service';
import { UserService } from '../../../../../services/user.service';

declare var $: any;
declare let toastr:any;
declare var moment: any;
@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./cap-approval.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [CapabilityService, UserService]
})
export class CapApprovalComponent implements OnInit, AfterViewInit {


    capForm: FormGroup;
    id: string;
    userid: string;
    idUser: string;
    userobj: any;
    private sub :any;
    coachLs: any[];
    currentCoach: any;
    tempCapid: string;
    aktivitiLs : any[];
    private aktiviti = [];
    private activities = [];
    mark: any;

    loading: boolean = false;
    isEditable = false;
    message: any = {
      success: "Kepakaran Telah Berjaya Diterima",
      danger: "Kepakaran Telah Berjaya Ditolak"
    }

    constructor(private _script: ScriptLoaderService, private capabilityService:CapabilityService, private userService: UserService, private router:Router, private route: ActivatedRoute) { }
    
    ngOnInit() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.userid = currentUser.id;



        this.capForm = new FormGroup({
            agency: new FormControl({value: '', disabled: true}, Validators.required),
            pemohon: new FormControl({value: '', disabled: true}, Validators.required),
            name: new FormControl({value: '', disabled: true}, Validators.required),
            kepakaran: new FormControl({value: '', disabled: true}, Validators.required),
            duration: new FormControl({value: '', disabled: true}, Validators.required),
            start_date: new FormControl({value: '', disabled: true}, Validators.required),
            end_date: new FormControl({value: '', disabled: true}, Validators.required),
            remarks: new FormControl({value: '', disabled: true}, Validators.required),
            coach_remarks: new FormControl({value: '', disabled: true}, Validators.required),
            admin_remarks: new FormControl('', Validators.required)
        })

        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];

            if(this.id){
                this.userService.getUserById(this.userid).subscribe(
                    data=>{
                        this.userobj = data;
                    }
                )
                this.capabilityService.getCapUserById(this.id).subscribe(
                    data=>{
                        this.idUser = data.user.id;
                        this.tempCapid = data.capability.id;
                        let agency;

                        if(data.user.type=="GOV"){
                            if(data.user.agency!=null){
                                agency = data.user.agency.name;
                            }else{
                                agency = "";
                            }
                        }else if(data.user.type=="PRIVATE"){
                            if(data.user.company!=null){
                                agency = data.user.company.name;
                            }else{
                                agency = "";
                            }
                        }else{
                            agency = "";
                        }

                        for(let obj of data.user.skill){
                            var objId = obj.technology.id;
                            if(objId === data.capability.kepakaran.id){
                                this.mark = obj.mark;
                            }
                        }
                        this.capForm.patchValue({
                            agency: agency,
                            pemohon: data.user.name,
                            name: data.capability.name,
                            kepakaran: data.capability.kepakaran.name,
                            duration: data.capability.duration,
                            start_date: this.formatDate(data.capability.starting_date),
                            end_date: this.formatDate(data.capability.ending_date),
                            remarks: data.capability.remarks,
                            coach_remarks: data.coach_remarks
                        })
                        this.capabilityService.getCapabilityCoach(this.tempCapid).subscribe(
                            temp => {
                                this.currentCoach = temp;
                            }
                        )
                        this.capabilityService.getCapabilityAct(this.tempCapid).subscribe(
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
                    }  
                )
            }
        })

        

        
    }

    ngAfterViewInit() {
        this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
            'assets/demo/default/custom/header/actions.js');

    }

    formatDate(date){
        var datemagic = new Date(date);
        var day = datemagic.getDate();
        var month = datemagic.getMonth()+1;
        var year = datemagic.getFullYear();
        return day + '/' + month + '/' + year;
    }

    redirectListPage() {
      this.router.navigate(['/cap/list/admin']);
    }

    onSubmit(){
        if(this.capForm.valid){
            if(this.id){
                let capUser: CapabilityUser = new CapabilityUser(
                    null,
                    null,
                    '3',
                    this.capForm.controls['coach_remarks'].value,
                    this.capForm.controls['admin_remarks'].value,
                    null,
                    null,
                    this.userobj,
                    this.id
                )
                this.capabilityService.updateCapabilityUser(capUser).subscribe(
                    success=>{
                        this.isEditable = true;
                        this.loading = false;
                        toastr.success(this.message.success);
                        this.redirectListPage();
                    });
                
            }
        }
    }

    directTolak(){
        if(this.capForm.valid){
            if(this.id){
                let capUser: CapabilityUser = new CapabilityUser(
                    null,
                    null,
                    '4',
                    this.capForm.controls['coach_remarks'].value,
                    this.capForm.controls['admin_remarks'].value,
                    null,
                    null,
                    this.userobj,
                    this.id
                )
                this.capabilityService.updateCapabilityUser(capUser).subscribe(
                    success=>{
                        this.isEditable = true;
                        this.loading = false;
                        toastr.success(this.message.danger);
                        this.redirectListPage();
                    });
                
            }
        }
    }

    LihatProfilPage() {
      this.router.navigate(['/header/profile/view/', this.idUser]);
    }

}